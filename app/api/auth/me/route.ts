
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/sessions";

export const runtime = "nodejs";

export async function GET() {
  const result = await getCurrentUser();

  if (!result) {
    return NextResponse.json(
      { user: null },
      { status: 401 },
    );
  }

  return NextResponse.json({
    user: result.user,
  });
}
