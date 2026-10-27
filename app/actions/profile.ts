
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { locationData } from "@/data/location-data";
import { getCurrentUser } from "@/lib/auth/sessions";
import { getVerifiedUser } from "@/lib/auth/authorization";

type ProfileActionState = {
  success?: boolean;
  error?: string;
};

const DEPARTMENTS = ["CS", "ME", "CIV", "EE", "EC"] as const;

export async function saveProfile(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  // Authenticate using the custom session system.
  const session = await getCurrentUser();

  if (!session) {
    return { error: "Please sign in to save your profile." };
  }

  const userId = session.user.id;

  // Fetch the authoritative database state. Never trust academic
  // identity fields submitted by the client.
  const account = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      status: true,
      emailVerified: true,
      collegeEmailVerified: true,
      degreeCode: true,
      degreeName: true,
      enrollmentYear: true,
      academicDepartmentCode: true,
      rollNumber: true,
      expectedGraduationYear: true,
      profile: {
        select: { id: true },
      },
    },
  });

  if (!account) {
    return { error: "Account not found. Please sign in again." };
  }

  const isCompletingProfile =
    account.status === "PENDING_PROFILE_COMPLETION";

  const isEditingActiveProfile =
    account.status === "ACTIVE";

  if (!isCompletingProfile && !isEditingActiveProfile) {
    return {
      error:
        "Please complete your email verification steps before saving your profile.",
    };
  }

  if (!account.emailVerified || !account.collegeEmailVerified) {
    return {
      error: "Please verify both your personal and college email first.",
    };
  }

  // A pending account must not already have an AlumniProfile.
  if (isCompletingProfile && account.profile) {
    return {
      error:
        "A profile already exists for this account. Please sign in again.",
    };
  }

  // An active account should have a profile to edit.
  if (isEditingActiveProfile && !account.profile) {
    return {
      error:
        "Your profile could not be found. Please contact support.",
    };
  }

  // Read and normalize user-editable fields.
  const fullName = String(formData.get("fullName") ?? "").trim();

  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();

  const headline = String(formData.get("headline") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const district = String(formData.get("district") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();

  const company = String(formData.get("company") ?? "").trim();
  const jobTitle = String(formData.get("jobTitle") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  const skillsRaw = formData.getAll("skills");

  if (
    !fullName ||
    !username ||
    !headline ||
    !country ||
    !state ||
    !district ||
    !city ||
    !bio
  ) {
    return { error: "Please complete all required fields." };
  }

  if (fullName.length > 100) {
    return { error: "Full name cannot exceed 100 characters." };
  }

  if (headline.length > 120) {
    return {
      error: "Professional headline cannot exceed 120 characters.",
    };
  }

  if (company.length > 100 || jobTitle.length > 100) {
    return {
      error: "Company and job title cannot exceed 100 characters.",
    };
  }

  if (!/^[a-z0-9_]{3,30}$/.test(username)) {
    return {
      error:
        "Username must be 3–30 characters using letters, numbers, or underscores.",
    };
  }

  // Academic identity must already have been parsed from the verified
  // college email and saved on the User record.
  const academicFields = [
    account.degreeCode,
    account.degreeName,
    account.enrollmentYear,
    account.academicDepartmentCode,
    account.rollNumber,
    account.expectedGraduationYear,
  ];

  if (
    academicFields.some(
      (value) => value === null || value === undefined,
    )
  ) {
    return {
      error:
        "Your academic details are incomplete. Please contact support.",
    };
  }

const degreeCode = account.degreeCode?.toUpperCase();
const departmentCode = account.academicDepartmentCode?.toUpperCase();

if (
  !["BT", "MT"].includes(degreeCode ?? "") ||
  !/^[A-Z]{2,10}$/.test(departmentCode ?? "") ||
  !/^\d{3}$/.test(account.rollNumber ?? "") ||
  !Number.isInteger(account.enrollmentYear) ||
  !Number.isInteger(account.expectedGraduationYear)
) {
  console.error("Invalid academic identity:", {
    degreeCode: account.degreeCode,
    degreeName: account.degreeName,
    enrollmentYear: account.enrollmentYear,
    academicDepartmentCode: account.academicDepartmentCode,
    rollNumber: account.rollNumber,
    expectedGraduationYear: account.expectedGraduationYear,
  });

  return {
    error:
      "Your academic details could not be validated. Please contact support.",
  };
}

  // For profile completion, department and graduation year are taken
  // exclusively from the verified academic identity.
  // For active profile edits, preserve the same locked academic values.
  const department = account.academicDepartmentCode!.toUpperCase();
  const graduationYear = account.expectedGraduationYear!;

  // Validate that the inferred passing year is plausible.
const expectedDuration = degreeCode === "BT" ? 4 : 2;

if (
  graduationYear !== account.enrollmentYear! + expectedDuration
) {
  return {
    error:
      "Your expected graduation year does not match your academic details.",
  };
}

  // Keep the legacy department validation for existing active profiles
  // only if their stored department uses one of the original values.
  // New profiles use the department code parsed from the college email.
  if (
    isEditingActiveProfile &&
    !(DEPARTMENTS as readonly string[]).includes(
      department,
    ) &&
    !/^[A-Z]{2,10}$/.test(department)
  ) {
    return { error: "Your department is invalid." };
  }

  if (country !== "India") {
    return { error: "Please select India as your country." };
  }

  const validCities = locationData[state]?.[district];

  if (!validCities || !validCities.includes(city)) {
    return {
      error: "Please select a valid state, district, and city.",
    };
  }

  if (bio.length < 10 || bio.length > 2000) {
    return {
      error: "About you must contain between 10 and 2000 characters.",
    };
  }

  const parsedSkills = skillsRaw
    .filter((value): value is string => typeof value === "string")
    .map((skill) => skill.trim())
    .filter(Boolean);

  if (parsedSkills.length < 1 || parsedSkills.length > 5) {
    return { error: "Please select between 1 and 5 skills." };
  }

  if (parsedSkills.some((skill) => skill.length > 50)) {
    return {
      error: "Each skill must be 50 characters or fewer.",
    };
  }

  const normalizedSkills = parsedSkills.map((skill) =>
    skill.toLowerCase(),
  );

  if (new Set(normalizedSkills).size !== normalizedSkills.length) {
    return { error: "Duplicate skills are not allowed." };
  }

  const skills = parsedSkills;

  // Store the academic department and expected graduation year from
  // the database, never from formData.
  const profileData = {
    fullName,
    username,
    headline,
    department,
    graduationYear,
    degree: account.degreeName!,
    country,
    state,
    district,
    city,
    location: `${city}, ${district}, ${state}, ${country}`,
    company: company || null,
    jobTitle: jobTitle || null,
    bio,
    skills,
  };

  try {
    if (isCompletingProfile) {
      // Create the profile and activate the account atomically.
      // If either operation fails, both operations roll back.
      await prisma.$transaction(async (tx) => {
        const currentAccount = await tx.user.findUnique({
          where: { id: userId },
          select: {
            status: true,
            emailVerified: true,
            collegeEmailVerified: true,
            profile: { select: { id: true } },
          },
        });

        if (
          !currentAccount ||
          currentAccount.status !== "PENDING_PROFILE_COMPLETION" ||
          !currentAccount.emailVerified ||
          !currentAccount.collegeEmailVerified ||
          currentAccount.profile
        ) {
          throw new Error("PROFILE_COMPLETION_STATE_CHANGED");
        }

        await tx.alumniProfile.create({
          data: {
            userId,
            ...profileData,
          },
        });

        await tx.user.update({
          where: { id: userId },
          data: { status: "ACTIVE" },
        });
      });
    } else {
      // Active accounts must pass the verified-user authorization
      // check before updating their existing profile.
      const verifiedSession = await getVerifiedUser();

      if (!verifiedSession || verifiedSession.user.id !== userId) {
        return {
          error: "Your session is no longer valid. Please sign in again.",
        };
      }

      await prisma.alumniProfile.update({
        where: { userId },
        data: profileData,
      });
    }

    revalidatePath("/me");
    revalidatePath("/user/me");
    revalidatePath("/search");
    revalidatePath("/feed");

    return { success: true };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message === "PROFILE_COMPLETION_STATE_CHANGED"
    ) {
      return {
        error:
          "Your account state changed. Refresh the page and try again.",
      };
    }

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { error: "That username is already taken." };
    }

    console.error("Profile save failed:", error);

    return {
      error: "Unable to save your profile. Please try again.",
    };
  }
}
