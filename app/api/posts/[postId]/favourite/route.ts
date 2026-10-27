
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVerifiedUser } from "@/lib/auth/authorization";

type RouteContext = {
  params: Promise<{ postId: string }>;
};

// Add a post to the current user's favourites.
export async function POST(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const session = await getVerifiedUser();

    if (!session) {
      return NextResponse.json(
        {
          error: "Complete both email verifications to favourite posts.",
          code: "ACCOUNT_VERIFICATION_REQUIRED",
        },
        { status: 403 },
      );
    }

    const { postId } = await params;

    const profile = await prisma.alumniProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Alumni profile not found." },
        { status: 404 },
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found." },
        { status: 404 },
      );
    }

    await prisma.favourite.upsert({
      where: {
        userId_postId: {
          userId: profile.id,
          postId: post.id,
        },
      },
      update: {},
      create: {
        userId: profile.id,
        postId: post.id,
      },
    });

    return NextResponse.json({ isFavourite: true });
  } catch (error) {
    console.error("Add favourite error:", error);

    return NextResponse.json(
      { error: "Failed to favourite post." },
      { status: 500 },
    );
  }
}

// Remove a post from the current user's favourites.
export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const session = await getVerifiedUser();

    if (!session) {
      return NextResponse.json(
        {
          error: "Complete both email verifications to modify favourites.",
          code: "ACCOUNT_VERIFICATION_REQUIRED",
        },
        { status: 403 },
      );
    }

    const { postId } = await params;

    const profile = await prisma.alumniProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Alumni profile not found." },
        { status: 404 },
      );
    }

    await prisma.favourite.deleteMany({
      where: {
        userId: profile.id,
        postId,
      },
    });

    return NextResponse.json({ isFavourite: false });
  } catch (error) {
    console.error("Remove favourite error:", error);

    return NextResponse.json(
      { error: "Failed to remove favourite." },
      { status: 500 },
    );
  }
}
