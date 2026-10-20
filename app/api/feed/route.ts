
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/feed
// GET /api/feed?cursor=POST_ID&limit=10
export async function GET(request: NextRequest) {
  try {
    const cursor = request.nextUrl.searchParams.get("cursor");
    const limitParam = Number(
      request.nextUrl.searchParams.get("limit") ?? "10",
    );

    if (
      !Number.isInteger(limitParam) ||
      limitParam < 1
    ) {
      return NextResponse.json(
        { error: "Invalid limit parameter." },
        { status: 400 },
      );
    }

    const limit = Math.min(limitParam, 20);

    // Fetch one extra post to determine whether more posts exist.
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

    return NextResponse.json({
      posts,
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
