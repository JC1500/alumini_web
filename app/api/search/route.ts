import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json({ profiles: [] });
    }

    const profiles = await prisma.alumniProfile.findMany({
      where: {
        OR: [
          {
            fullName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            headline: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },

      select: {
        id: true,
        username: true,
        fullName: true,
        headline: true,
        profileImageUrl: true,
      },

      take: 8,
      orderBy: {
        fullName: "asc",
      },
    });

    // Map Prisma's field name to the property expected by SearchBar.tsx.
    const formattedProfiles = profiles.map((profile) => ({
      ...profile,
      profileImage: profile.profileImageUrl,
    }));

    return NextResponse.json({
      profiles: formattedProfiles,
    });
  } catch (error) {
    console.error("Search API error:", error);

    return NextResponse.json(
      { error: "Failed to search profiles", profiles: [] },
      { status: 500 }
    );
  }
}