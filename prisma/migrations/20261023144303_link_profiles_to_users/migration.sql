/*
  Warnings:

  - You are about to drop the column `alumniProfileId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `AlumniProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_alumniProfileId_fkey";

-- AlterTable
ALTER TABLE "AlumniProfile" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "clerkUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "alumniProfileId";

-- CreateIndex
CREATE UNIQUE INDEX "AlumniProfile_userId_key" ON "AlumniProfile"("userId");

-- AddForeignKey
ALTER TABLE "AlumniProfile" ADD CONSTRAINT "AlumniProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
