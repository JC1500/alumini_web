
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET /api/feed
// GET /api/feed?cursor=POST_ID&limit=10
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "You must be logged in to view the feed." },
        { status: 401 },
      );
    }

    const profile = await prisma.alumniProfile.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Alumni profile not found." },
        { status: 404 },
      );
    }

    const cursor = request.nextUrl.searchParams.get("cursor");
    const limitParam = Number(
      request.nextUrl.searchParams.get("limit") ?? "10",
    );

    if (!Number.isInteger(limitParam) || limitParam < 1) {
      return NextResponse.json(
        { error: "Invalid limit parameter." },
        { status: 400 },
      );
    }

    const limit = Math.min(limitParam, 20);

    const posts = await prisma.post.findMany({
      ...(cursor
        ? {
            cursor: { id: cursor },
            skip: 1,
          }
        : {}),
      take: limit + 1,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profileImageUrl: true,
          },
        },
        images: {
          orderBy: { createdAt: "asc" },
        },
        favourites: {
          where: { userId: profile.id },
          select: { id: true },
        },
      },
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
    });

    const hasMore = posts.length > limit;

    if (hasMore) {
      posts.pop();
    }

    const nextCursor =
      hasMore && posts.length > 0
        ? posts[posts.length - 1].id
        : null;

    const formattedPosts = posts.map(
      ({ favourites, ...post }) => ({
        ...post,
        isFavourite: favourites.length > 0,
      }),
    );

    return NextResponse.json({
      posts: formattedPosts,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Fetch feed error:", error);

    return NextResponse.json(
      { error: "Failed to fetch feed." },
      { status: 500 },
    );
  }
}
