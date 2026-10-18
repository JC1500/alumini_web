"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ProfileActionState = {
  success?: boolean;
  error?: string;
};

export async function saveProfile( _prevState: ProfileActionState,formData: FormData): Promise<ProfileActionState> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in.");
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();
  const department = String(formData.get("department") ?? "").trim();
  const graduationYearRaw = String(
    formData.get("graduationYear") ?? ""
  ).trim();
  const company = String(formData.get("company") ?? "").trim();
  const jobTitle = String(formData.get("jobTitle") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const headline = String(formData.get("headline") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const skillsRaw = String(formData.get("skills") ?? "");

  if (!fullName || !username) {
    return { error: "Full name and username are required." };
  }

  if (!/^[a-z0-9_]{3,30}$/.test(username)) {
    return {
      error: "Username must be 3–30 characters using letters, numbers, or underscores.",
    };
  }

  const graduationYear = graduationYearRaw
    ? Number(graduationYearRaw)
    : null;

  if (
    graduationYear !== null &&
    (!Number.isInteger(graduationYear) ||
      graduationYear < 1950 ||
      graduationYear > 2100)
  ) {
    return { error: "Enter a valid graduation year." };
  }

  const skills = [
    ...new Set(
      skillsRaw
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
        .map((skill) => skill.slice(0, 50))
    ),
  ].slice(0, 30);

  try {
    await prisma.alumniProfile.upsert({
      where: { clerkUserId: userId },
      create: {
        clerkUserId: userId,
        fullName,
        username,
        department: department || null,
        graduationYear,
        company: company || null,
        jobTitle: jobTitle || null,
        location: location || null,
        headline: headline || null,
        bio: bio || null,
        skills,
      },
      update: {
        fullName,
        username,
        department: department || null,
        graduationYear,
        company: company || null,
        jobTitle: jobTitle || null,
        location: location || null,
        headline: headline || null,
        bio: bio || null,
        skills,
      },
    });

    revalidatePath("/me");
    revalidatePath("/search");

    return { success: true };
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { error: "That username is already taken." };
    }

    console.error("Profile save failed:", error);
    return { error: "Unable to save your profile. Please try again." };
  }
}