
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/sessions";

export async function GET() {
  try {
    // Authenticate using the custom session system.
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to view saved posts." },
        { status: 401 },
      );
    }

    // Find the alumni profile linked to the authenticated user.
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

    // Fetch saved posts, newest favourites first.
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
