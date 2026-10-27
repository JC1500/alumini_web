import "server-only";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type CurrentProfileResult =
  | { status: "authenticated"; profile: { id: string } }
  | { status: "unauthenticated"; profile: null }
  | { status: "profile_missing"; profile: null };

export async function getCurrentProfile(): Promise<CurrentProfileResult> {
  const { userId } = await auth();

  if (!userId) {
    return { status: "unauthenticated", profile: null };
  }

  const profile = await prisma.alumniProfile.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!profile) {
    return { status: "profile_missing", profile: null };
  }

  return { status: "authenticated", profile };
}
