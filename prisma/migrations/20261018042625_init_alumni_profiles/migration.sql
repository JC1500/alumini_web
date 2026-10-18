-- CreateTable
CREATE TABLE "AlumniProfile" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "headline" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "department" TEXT,
    "graduationYear" INTEGER,
    "degree" TEXT,
    "company" TEXT,
    "jobTitle" TEXT,
    "location" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlumniProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlumniProfile_clerkUserId_key" ON "AlumniProfile"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "AlumniProfile_username_key" ON "AlumniProfile"("username");

-- CreateIndex
CREATE INDEX "AlumniProfile_fullName_idx" ON "AlumniProfile"("fullName");

-- CreateIndex
CREATE INDEX "AlumniProfile_graduationYear_idx" ON "AlumniProfile"("graduationYear");

-- CreateIndex
CREATE INDEX "AlumniProfile_department_idx" ON "AlumniProfile"("department");

-- CreateIndex
CREATE INDEX "AlumniProfile_company_idx" ON "AlumniProfile"("company");
