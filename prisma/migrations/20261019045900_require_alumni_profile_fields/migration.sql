/*
  Warnings:

  - Made the column `headline` on table `AlumniProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bio` on table `AlumniProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `department` on table `AlumniProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `graduationYear` on table `AlumniProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `AlumniProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `district` on table `AlumniProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `AlumniProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AlumniProfile" ALTER COLUMN "headline" SET NOT NULL,
ALTER COLUMN "bio" SET NOT NULL,
ALTER COLUMN "department" SET NOT NULL,
ALTER COLUMN "graduationYear" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "district" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL;
