
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVerifiedUser } from "@/lib/auth/authorization";

export async function GET() {
  try {
    // Only fully verified, active users can view saved posts.
    const session = await getVerifiedUser();

    if (!session) {
      return NextResponse.json(
        {
          error: "Complete both email verifications to view saved posts.",
          code: "ACCOUNT_VERIFICATION_REQUIRED",
        },
        { status: 403 },
      );
    }

    const profile = await prisma.alumniProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 },
      );
    }

    const favourites = await prisma.favourite.findMany({
      where: { userId: profile.id },
      orderBy: { createdAt: "desc" },
      select: {
        post: {
          select: {
            id: true,
            text: true,
            createdAt: true,
            images: {
              orderBy: { createdAt: "asc" },
              select: {
                id: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    const posts = favourites.map(({ post }) => post);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Fetch saved posts error:", error);

    return NextResponse.json(
      { error: "Failed to load saved posts." },
      { status: 500 },
    );
  }
}
