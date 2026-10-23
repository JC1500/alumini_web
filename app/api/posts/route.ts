
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/sessions";
import { getVerifiedUser } from "@/lib/auth/authorization";

type PostImageInput = {
  imageUrl: string;
  imageKey: string;
};

// Delete only uploads that are still pending and unused.
async function cleanupUnusedUploads(
  ownerId: string,
  keys: string[],
) {
  let r2Module: typeof import("@/lib/r2");

  try {
    r2Module = await import("@/lib/r2");
  } catch (error) {
    console.error(
      "Unable to initialize R2 while cleaning up uploads:",
      error,
    );
    return;
  }

  for (const key of keys) {
    try {
      const deleted = await prisma.pendingPostImage.deleteMany({
        where: {
          clerkUserId: ownerId,
          imageKey: key,
          consumedAt: null,
        },
      });

      if (deleted.count === 1) {
        try {
          await r2Module.r2.send(
            new r2Module.DeleteObjectCommand({
              Bucket: r2Module.bucketName,
              Key: key,
            }),
          );
        } catch (error) {
          console.error(
            `Failed to delete unused R2 image ${key}:`,
            error,
          );
        }
      }
    } catch (error) {
      console.error(
        `Failed to clean up pending image ${key}:`,
        error,
      );
    }
  }
}

// GET /api/posts?username=mayank
// Fetch posts belonging to a public alumni profile.

export async function GET(request: NextRequest) {
  try {
    const session = await getVerifiedUser();

    if (!session) {
      const currentSession = await getCurrentUser();

      if (!currentSession) {
        return NextResponse.json(
          { error: "Unauthorized." },
          { status: 401 },
        );
      }

      return NextResponse.json(
        {
          error: "Complete personal and college email verification to view posts.",
          code: "ACCOUNT_VERIFICATION_REQUIRED",
        },
        { status: 403 },
      );
    }

    const username = request.nextUrl.searchParams
      .get("username")
      ?.trim();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 },
      );
    }

    const profile = await prisma.alumniProfile.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 },
      );
    }

    const posts = await prisma.post.findMany({
      where: { authorId: profile.id },
      include: {
        images: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Fetch posts error:", error);

    return NextResponse.json(
      { error: "Failed to fetch posts." },
      { status: 500 },
    );
  }
}


// POST /api/posts
// Create a post and atomically consume its pending images.
export async function POST(request: NextRequest) {
  const session = await getVerifiedUser();



  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to create a post." },
      { status: 401 },
    );
  }

  const userId = session.user.id;
  let imageData: PostImageInput[] = [];

  try {
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

    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("text" in body) ||
      !("images" in body) ||
      typeof body.text !== "string" ||
      !Array.isArray(body.images)
    ) {
      return NextResponse.json(
        { error: "Invalid post data." },
        { status: 400 },
      );
    }

    const text = body.text.trim();
    const images: unknown[] = body.images;

    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Post text cannot exceed 5000 characters." },
        { status: 400 },
      );
    }

    if (
      images.length > 5 ||
      !images.every(
        (image) =>
          typeof image === "object" &&
          image !== null &&
          "imageUrl" in image &&
          "imageKey" in image &&
          typeof image.imageUrl === "string" &&
          typeof image.imageKey === "string",
      )
    ) {
      return NextResponse.json(
        { error: "Invalid images. You can attach up to 5 images." },
        { status: 400 },
      );
    }

    imageData = images as PostImageInput[];

    if (!text && imageData.length === 0) {
      return NextResponse.json(
        { error: "Write something or attach at least one image." },
        { status: 400 },
      );
    }

    // Validate image keys and URLs.
    const seenKeys = new Set<string>();

    for (const image of imageData) {
      const {
        HeadObjectCommand,
        getPublicImageUrl,
        r2,
        bucketName,
      } = await import("@/lib/r2");

      const expectedPrefix = `posts/${userId}/`;

      if (
        !image.imageKey.startsWith(expectedPrefix) ||
        !image.imageKey.endsWith(".webp") ||
        image.imageKey.includes("..") ||
        image.imageKey.includes("\\") ||
        seenKeys.has(image.imageKey) ||
        image.imageUrl !== getPublicImageUrl(image.imageKey)
      ) {
        return NextResponse.json(
          { error: "One or more images are invalid." },
          { status: 400 },
        );
      }

      seenKeys.add(image.imageKey);

      try {
        await r2.send(
          new HeadObjectCommand({
            Bucket: bucketName,
            Key: image.imageKey,
          }),
        );
      } catch (error) {
        console.error("R2 image verification failed:", error);

        return NextResponse.json(
          { error: "An uploaded image could not be verified." },
          { status: 400 },
        );
      }
    }

    // Transitional note: the existing database field is still
    // named clerkUserId. The upload API must use this same owner ID
    // until that field is migrated to userId in Prisma.
    const pendingImages =
      imageData.length === 0
        ? []
        : await prisma.pendingPostImage.findMany({
          where: {
            clerkUserId: userId,
            imageKey: {
              in: imageData.map((image) => image.imageKey),
            },
            consumedAt: null,
            expiresAt: { gt: new Date() },
          },
          select: {
            imageKey: true,
            imageUrl: true,
          },
        });

    const pendingByKey = new Map(
      pendingImages.map((image) => [
        image.imageKey,
        image,
      ]),
    );

    const allImagesAreOwned = imageData.every((image) => {
      const pending = pendingByKey.get(image.imageKey);

      return (
        pending !== undefined &&
        pending.imageUrl === image.imageUrl
      );
    });

    if (
      !allImagesAreOwned ||
      pendingImages.length !== imageData.length
    ) {
      return NextResponse.json(
        {
          error:
            "One or more images are invalid, expired, or already used. Please select them again.",
        },
        { status: 400 },
      );
    }

    const post = await prisma.$transaction(async (tx) => {
      for (const image of imageData) {
        const claim = await tx.pendingPostImage.updateMany({
          where: {
            clerkUserId: userId,
            imageKey: image.imageKey,
            imageUrl: image.imageUrl,
            consumedAt: null,
            expiresAt: { gt: new Date() },
          },
          data: {
            consumedAt: new Date(),
          },
        });

        if (claim.count !== 1) {
          throw new Error("PENDING_IMAGE_CLAIM_FAILED");
        }
      }

      return tx.post.create({
        data: {
          text: text || null,
          authorId: profile.id,
          images: {
            create: imageData.map((image) => ({
              imageUrl: image.imageUrl,
              imageKey: image.imageKey,
            })),
          },
        },
        include: {
          images: true,
        },
      });
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);

    if (imageData.length > 0) {
      await cleanupUnusedUploads(
        userId,
        imageData.map((image) => image.imageKey),
      );
    }

    return NextResponse.json(
      { error: "Failed to create post." },
      { status: 500 },
    );
  }
}

// DELETE /api/posts?id=POST_ID
export async function DELETE(request: NextRequest) {
  const session = await getVerifiedUser();

  if (!session) {
    return NextResponse.json(
      {
        error: "Complete both email verifications to create posts.",
        code: "ACCOUNT_VERIFICATION_REQUIRED",
      },
      { status: 403 },
    );
  }

  try {
    const profile = await prisma.alumniProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Alumni profile not found." },
        { status: 404 },
      );
    }

    const postId = request.nextUrl.searchParams.get("id")?.trim();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required." },
        { status: 400 },
      );
    }

    // Only the post owner may delete the post.
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        authorId: profile.id,
      },
      select: {
        id: true,
        images: {
          select: {
            imageKey: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found or you cannot delete it." },
        { status: 404 },
      );
    }

    await prisma.post.delete({
      where: { id: post.id },
    });

    let failedCleanupCount = 0;

    if (post.images.length > 0) {
      try {
        const {
          r2,
          bucketName,
          DeleteObjectCommand,
        } = await import("@/lib/r2");

        const cleanupResults = await Promise.allSettled(
          post.images.map((image) =>
            r2.send(
              new DeleteObjectCommand({
                Bucket: bucketName,
                Key: image.imageKey,
              }),
            ),
          ),
        );

        failedCleanupCount = cleanupResults.filter(
          (result) => result.status === "rejected",
        ).length;
      } catch (error) {
        console.error(
          `Failed to initialize R2 while deleting images for post ${post.id}:`,
          error,
        );

        failedCleanupCount = post.images.length;
      }
    }

    if (failedCleanupCount > 0) {
      console.error(
        `Failed to delete ${failedCleanupCount} R2 image(s) for post ${post.id}.`,
      );
    }

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully.",
      imageCleanupPending: failedCleanupCount > 0,
    });
  } catch (error) {
    console.error("Delete post error:", error);

    return NextResponse.json(
      { error: "Failed to delete post." },
      { status: 500 },
    );
  }
}
