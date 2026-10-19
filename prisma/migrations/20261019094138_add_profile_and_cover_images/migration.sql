/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `AlumniProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AlumniProfile" DROP COLUMN "avatarUrl",
ADD COLUMN     "coverImageKey" TEXT,
ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "profileImageKey" TEXT,
ADD COLUMN     "profileImageUrl" TEXT;
