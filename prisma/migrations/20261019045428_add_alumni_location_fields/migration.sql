/*
  Warnings:

  - Made the column `location` on table `AlumniProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AlumniProfile" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'India',
ADD COLUMN     "district" TEXT,
ADD COLUMN     "state" TEXT,
ALTER COLUMN "location" SET NOT NULL;
