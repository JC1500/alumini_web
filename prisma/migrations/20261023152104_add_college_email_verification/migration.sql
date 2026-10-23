/*
  Warnings:

  - A unique constraint covering the columns `[collegeEmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserStatus" ADD VALUE 'PENDING_PERSONAL_VERIFICATION';
ALTER TYPE "UserStatus" ADD VALUE 'PENDING_COLLEGE_VERIFICATION';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "collegeEmail" TEXT,
ADD COLUMN     "collegeEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'PENDING_PERSONAL_VERIFICATION';

-- CreateTable
CREATE TABLE "CollegeEmailVerification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeEmail" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "resendAvailableAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollegeEmailVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CollegeEmailVerification_userId_idx" ON "CollegeEmailVerification"("userId");

-- CreateIndex
CREATE INDEX "CollegeEmailVerification_collegeEmail_idx" ON "CollegeEmailVerification"("collegeEmail");

-- CreateIndex
CREATE INDEX "CollegeEmailVerification_expiresAt_idx" ON "CollegeEmailVerification"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_collegeEmail_key" ON "User"("collegeEmail");

-- AddForeignKey
ALTER TABLE "CollegeEmailVerification" ADD CONSTRAINT "CollegeEmailVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
