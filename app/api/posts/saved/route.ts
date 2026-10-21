import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "You must be signed in to view saved posts." },
        { status: 401 },
      );
    }

    const profile = await prisma.alumniProfile.findUnique({
      where: { clerkUserId },
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