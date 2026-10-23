
import { NextResponse } from "next/server";
import sharp from "sharp";
import { randomUUID } from "node:crypto";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/sessions";
import {
  r2,
  bucketName,
  getPublicImageUrl,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@/lib/r2";

export const runtime = "nodejs";

const MAX_INPUT_SIZE = 5 * 1024 * 1024;

const IMAGE_CONFIG = {
  avatar: {
    width: 512,
    height: 512,
    maxBytes: 100 * 1024,
  },
  cover: {
    width: 1600,
    height: 600,
    maxBytes: 500 * 1024,
  },
} as const;

export async function POST(request: Request) {
  try {
    // 1. Authenticate using the custom session system.
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    // 2. Read the multipart form.
    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type");

    if (
      !(file instanceof File) ||
      (type !== "avatar" && type !== "cover")
    ) {
      return NextResponse.json(
        { error: "Invalid image upload" },
        { status: 400 },
      );
    }

    if (file.size === 0 || file.size > MAX_INPUT_SIZE) {
      return NextResponse.json(
        { error: "Image must be smaller than 5 MB" },
        { status: 413 },
      );
    }

    // 3. Validate the actual image content.
    const input = Buffer.from(await file.arrayBuffer());

    const metadata = await sharp(input, {
      limitInputPixels: 40_000_000,
    }).metadata();

    if (
      !metadata.width ||
      !metadata.height ||
      !["jpeg", "png", "webp"].includes(metadata.format ?? "") ||
      (metadata.pages ?? 1) > 1
    ) {
      return NextResponse.json(
        { error: "Use a valid JPEG, PNG, or WebP image" },
        { status: 400 },
      );
    }

    const config = IMAGE_CONFIG[type];

    // 4. Resize and compress into WebP.
    let scale = 1;
    let output: Buffer | undefined;

    for (let attempt = 0; attempt < 8; attempt++) {
      const width = Math.max(
        1,
        Math.round(config.width * scale),
      );
      const height = Math.max(
        1,
        Math.round(config.height * scale),
      );

      const candidate = await sharp(input, {
        limitInputPixels: 40_000_000,
      })
        .rotate()
        .resize({
          width,
          height,
          fit: "cover",
          position: "centre",
          withoutEnlargement: true,
        })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      if (candidate.length <= config.maxBytes) {
        output = candidate;
        break;
      }

      scale *= 0.8;
    }

    if (!output) {
      return NextResponse.json(
        { error: "Image could not be compressed enough" },
        { status: 400 },
      );
    }

    // 5. Find the profile linked to the authenticated database user.
    const profile = await prisma.alumniProfile.findUnique({
      where: { userId },
      select: {
        profileImageKey: true,
        coverImageKey: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Create your profile before uploading images" },
        { status: 404 },
      );
    }

    // Use unique keys so old images can be safely replaced.
    const key = `profiles/${userId}/${type}-${randomUUID()}.webp`;

    // 6. Upload the processed image to R2.
    await r2.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: output,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    const imageUrl = getPublicImageUrl(key);

    try {
      // 7. Update only this user's profile.
      await prisma.alumniProfile.update({
        where: { userId },
        data:
          type === "avatar"
            ? {
                profileImageUrl: imageUrl,
                profileImageKey: key,
              }
            : {
                coverImageUrl: imageUrl,
                coverImageKey: key,
              },
      });
    } catch (error) {
      // Remove the newly uploaded object if the DB update fails.
      try {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
          }),
        );
      } catch (cleanupError) {
        console.error(
          "Failed to clean up newly uploaded profile image:",
          cleanupError,
        );
      }

      throw error;
    }

    // 8. Delete the previous image after saving the replacement.
    const oldKey =
      type === "avatar"
        ? profile.profileImageKey
        : profile.coverImageKey;

    if (oldKey && oldKey !== key) {
      try {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: oldKey,
          }),
        );
      } catch (error) {
        console.error("Failed to delete old R2 image:", error);
      }
    }

    return NextResponse.json({
      success: true,
      type,
      url: imageUrl,
      key,
      size: output.length,
    });
  } catch (error) {
    console.error("Profile image upload failed:", error);

    return NextResponse.json(
      { error: "Image upload failed. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // 1. Authenticate using the custom session system.
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    // 2. Validate the requested image type.
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("type" in body) ||
      (body.type !== "avatar" && body.type !== "cover")
    ) {
      return NextResponse.json(
        { error: "Invalid image type" },
        { status: 400 },
      );
    }

    const type = body.type;

    // 3. Find only the authenticated user's profile.
    const profile = await prisma.alumniProfile.findUnique({
      where: { userId },
      select: {
        profileImageKey: true,
        coverImageKey: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 },
      );
    }

    const oldKey =
      type === "avatar"
        ? profile.profileImageKey
        : profile.coverImageKey;

    // 4. Clear the database reference first.
    await prisma.alumniProfile.update({
      where: { userId },
      data:
        type === "avatar"
          ? {
              profileImageUrl: null,
              profileImageKey: null,
            }
          : {
              coverImageUrl: null,
              coverImageKey: null,
            },
    });

    // 5. Delete only the image referenced by this profile.
    if (oldKey) {
      try {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: oldKey,
          }),
        );
      } catch (error) {
        console.error("Failed to delete R2 image:", error);
      }
    }

    return NextResponse.json({
      success: true,
      type,
    });
  } catch (error) {
    console.error("Image deletion failed:", error);

    return NextResponse.json(
      { error: "Could not delete image" },
      { status: 500 },
    );
  }
}
