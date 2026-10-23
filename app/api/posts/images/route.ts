
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

const MAX_IMAGES = 5;
const MAX_INPUT_SIZE = 5 * 1024 * 1024;
const MAX_OUTPUT_SIZE = 500 * 1024;

const ALLOWED_FORMATS = ["jpeg", "png", "webp"];

export async function POST(request: Request) {
  const uploadedKeys: string[] = [];
  let userId: string | null = null;

  try {
    // 1. Authenticate using the custom session system.
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to upload images." },
        { status: 401 },
      );
    }

    userId = session.user.id;

    // 2. Find the profile linked to this database user.
    const profile = await prisma.alumniProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Complete your alumni profile before posting." },
        { status: 403 },
      );
    }

    // 3. Read and validate the multipart form.
    const formData = await request.formData();
    const files = formData.getAll("images");

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No images were received. Please select an image." },
        { status: 400 },
      );
    }

    if (files.length > MAX_IMAGES) {
      return NextResponse.json(
        { error: `You can upload at most ${MAX_IMAGES} images.` },
        { status: 400 },
      );
    }

    if (!files.every((entry) => entry instanceof File)) {
      return NextResponse.json(
        { error: "Invalid image upload. Please select image files." },
        { status: 400 },
      );
    }

    const imageFiles = files as File[];

    // Validate every input before processing or uploading.
    for (const file of imageFiles) {
      if (file.size === 0 || file.size > MAX_INPUT_SIZE) {
        return NextResponse.json(
          {
            error:
              "Each image must be larger than 0 bytes and no larger than 5 MB.",
          },
          { status: 413 },
        );
      }
    }

    const uploadedImages: {
      imageUrl: string;
      imageKey: string;
    }[] = [];

    // 4. Process and upload each image.
    for (const file of imageFiles) {
      const input = Buffer.from(await file.arrayBuffer());

      const metadata = await sharp(input, {
        limitInputPixels: 40_000_000,
      }).metadata();

      if (
        !metadata.width ||
        !metadata.height ||
        !ALLOWED_FORMATS.includes(metadata.format ?? "") ||
        (metadata.pages ?? 1) > 1
      ) {
        throw new Error(
          "Use valid, non-animated JPEG, PNG, or WebP images.",
        );
      }

      // Fit inside 1600 x 1600 without cropping.
      // Reduce dimensions and quality until under 500 KB.
      let scale = 1;
      let quality = 80;
      let output: Buffer | undefined;

      for (let attempt = 0; attempt < 12; attempt++) {
        const candidate = await sharp(input, {
          limitInputPixels: 40_000_000,
        })
          .rotate()
          .resize({
            width: Math.max(1, Math.round(1600 * scale)),
            height: Math.max(1, Math.round(1600 * scale)),
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality, effort: 4 })
          .toBuffer();

        if (candidate.length <= MAX_OUTPUT_SIZE) {
          output = candidate;
          break;
        }

        if (quality > 40) {
          quality -= 10;
        } else {
          scale *= 0.8;
          quality = 70;
        }
      }

      if (!output) {
        throw new Error(
          "An image could not be compressed below 500 KB.",
        );
      }

      // Store images under the authenticated database user's ID.
      const key = `posts/${userId}/${randomUUID()}.webp`;

      await r2.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: output,
          ContentType: "image/webp",
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );

      // Track the uploaded object so failures can clean it up.
      uploadedKeys.push(key);

      const imageUrl = getPublicImageUrl(key);

      // Temporary compatibility: the Prisma field is still named
      // clerkUserId, but now stores the custom User.id.
      await prisma.pendingPostImage.create({
        data: {
          clerkUserId: userId,
          imageUrl,
          imageKey: key,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        },
      });

      uploadedImages.push({
        imageUrl,
        imageKey: key,
      });
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Post image upload failed:", error);

    // Remove only this request's pending records and uploaded objects.
    if (uploadedKeys.length > 0) {
      const cleanupTasks: Promise<unknown>[] = uploadedKeys.map(
        (key) =>
          r2.send(
            new DeleteObjectCommand({
              Bucket: bucketName,
              Key: key,
            }),
          ),
      );

      if (userId) {
        cleanupTasks.push(
          prisma.pendingPostImage.deleteMany({
            where: {
              clerkUserId: userId,
              imageKey: { in: uploadedKeys },
              consumedAt: null,
            },
          }),
        );
      }

      await Promise.allSettled(cleanupTasks);
    }

    const message =
      error instanceof Error
        ? error.message
        : "Image upload failed. Please try again.";

    const isValidationError =
      message.startsWith("Use valid") ||
      message.startsWith("An image could not");

    return NextResponse.json(
      {
        error: isValidationError
          ? message
          : "Image upload failed. Please try again.",
      },
      { status: isValidationError ? 400 : 500 },
    );
  }
}
