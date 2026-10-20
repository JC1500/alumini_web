
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  r2,
  bucketName,
  DeleteObjectCommand,
} from "@/lib/r2";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const now = new Date();
  const batchSize = 100;

  let deletedObjects = 0;
  let deletedRecords = 0;
  let failedObjects = 0;

  try {
    // Process a bounded batch per invocation.
    const expiredImages = await prisma.pendingPostImage.findMany({
      where: {
        expiresAt: { lte: now },
        consumedAt: null,
      },
      orderBy: { expiresAt: "asc" },
      take: batchSize,
      select: {
        id: true,
        clerkUserId: true,
        imageKey: true,
      },
    });

    for (const image of expiredImages) {
      try {
        // Claim this expired record first. Concurrent cleanup
        // runs cannot both claim the same pending upload.
        const claimed = await prisma.pendingPostImage.deleteMany({
          where: {
            id: image.id,
            clerkUserId: image.clerkUserId,
            imageKey: image.imageKey,
            expiresAt: { lte: now },
            consumedAt: null,
          },
        });

        if (claimed.count !== 1) {
          continue;
        }

        try {
          await r2.send(
            new DeleteObjectCommand({
              Bucket: bucketName,
              Key: image.imageKey,
            }),
          );

          deletedObjects++;
          deletedRecords++;
        } catch (error) {
          failedObjects++;

          console.error(
            "Failed to delete expired R2 image:",
            image.imageKey,
            error,
          );

          // The record was removed before the R2 operation.
          // Log this failure for later manual cleanup.
        }
      } catch (error) {
        console.error(
          "Failed to process expired image record:",
          image.id,
          error,
        );
      }
    }

    return NextResponse.json({
      success: true,
      processed: expiredImages.length,
      deletedObjects,
      deletedRecords,
      failedObjects,
    });
  } catch (error) {
    console.error("Pending image cleanup failed:", error);

    return NextResponse.json(
      { error: "Pending image cleanup failed." },
      { status: 500 },
    );
  }
}
