-- AlterEnum
ALTER TYPE "UserStatus" ADD VALUE 'PENDING_PROFILE_COMPLETION';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "academicDepartmentCode" TEXT,
ADD COLUMN     "degreeCode" TEXT,
ADD COLUMN     "degreeName" TEXT,
ADD COLUMN     "enrollmentYear" INTEGER,
ADD COLUMN     "expectedGraduationYear" INTEGER,
ADD COLUMN     "rollNumber" TEXT;
