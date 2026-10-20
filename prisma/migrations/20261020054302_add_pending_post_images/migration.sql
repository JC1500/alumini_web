-- CreateTable
CREATE TABLE "PendingPostImage" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),

    CONSTRAINT "PendingPostImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingPostImage_imageKey_key" ON "PendingPostImage"("imageKey");

-- CreateIndex
CREATE INDEX "PendingPostImage_clerkUserId_expiresAt_idx" ON "PendingPostImage"("clerkUserId", "expiresAt");
