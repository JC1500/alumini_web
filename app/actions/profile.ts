"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { locationData } from "@/data/location-data";

type ProfileActionState = {
success?: boolean;
error?: string;
};

const DEPARTMENTS = ["CS", "ME", "CIV", "EE", "EC"] as const;

export async function saveProfile(
_prevState: ProfileActionState,
formData: FormData,
): Promise<ProfileActionState> {
const { userId } = await auth();

if (!userId) {
return { error: "You must be signed in to save your profile." };
}

// Read and normalize form values.
const fullName = String(formData.get("fullName") ?? "").trim();

const username = String(formData.get("username") ?? "")
.trim()
.toLowerCase();

const headline = String(formData.get("headline") ?? "").trim();
const department = String(formData.get("department") ?? "").trim();

const graduationYearRaw = String(
formData.get("graduationYear") ?? "",
).trim();

const country = String(formData.get("country") ?? "").trim();
const state = String(formData.get("state") ?? "").trim();
const district = String(formData.get("district") ?? "").trim();
const city = String(formData.get("city") ?? "").trim();

const company = String(formData.get("company") ?? "").trim();
const jobTitle = String(formData.get("jobTitle") ?? "").trim();
const bio = String(formData.get("bio") ?? "").trim();
const skillsRaw: FormDataEntryValue[] = formData.getAll("skills");

// Required field validation.
if (
!fullName ||
!username ||
!headline ||
!department ||
!graduationYearRaw ||
!country ||
!state ||
!district ||
!city ||
!bio ||
!skillsRaw
) {
return {
error: "Please complete all required fields.",
};
}

// Field length validation.
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

// Username validation.
if (!/^[a-z0-9_]{3,30}$/.test(username)) {
return {
error:
"Username must be 3–30 characters using letters, numbers, or underscores.",
};
}

// Department validation.
if (
!(DEPARTMENTS as readonly string[]).includes(department)
) {
return { error: "Please select a valid department." };
}

// Graduation year validation.
const currentYear = new Date().getFullYear();
const graduationYear = Number(graduationYearRaw);

if (
!Number.isInteger(graduationYear) ||
graduationYear < 2013 ||
graduationYear > currentYear + 4
) {
return {
error: `Graduation year must be between 2013 and ${currentYear + 4}.`,
};
}

// Location validation.
// Never trust the disabled/read-only country field from the browser.
if (country !== "India") {
return { error: "Please select India as your country." };
}

const validCities = locationData[state]?.[district];

if (!validCities || !validCities.includes(city)) {
return {
error: "Please select a valid state, district, and city.",
};
}

// About-you validation.
if (bio.length < 10 || bio.length > 2000) {
return {
error: "About you must contain between 10 and 2000 characters.",
};
}

const parsedSkills = skillsRaw
  .filter((value): value is string => typeof value === "string")
  .map((skill) => skill.trim())
  .filter(Boolean);

const skills = [
  ...new Set(
    parsedSkills.map((skill) => skill.toLowerCase()),
  ),
];

if (skills.length < 1 || skills.length > 5) {
  return {
    error: "Please select between 1 and 5 skills.",
  };
}

if (skills.some((skill) => skill.length > 50)) {
  return {
    error: "Each skill must be 50 characters or fewer.",
  };
}

if (skills.length !== parsedSkills.length) {
  return {
    error: "Duplicate skills are not allowed.",
  };
}

// Prepare database fields.
const profileData = {
fullName,
username,
headline,
department,
graduationYear,
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
await prisma.alumniProfile.upsert({
where: { clerkUserId: userId },
 create: {
    clerkUserId: userId,
    ...profileData,
  },

  update: profileData,
});

revalidatePath("/me");
revalidatePath("/search");

return { success: true };

} catch (error: unknown) {
if (
error &&
typeof error === "object" &&
"code" in error &&
error.code === "P2002"
) {
return {
error: "That username is already taken.",
};
}
console.error("Profile save failed:", error);

return {
  error: "Unable to save your profile. Please try again.",
};
}
}