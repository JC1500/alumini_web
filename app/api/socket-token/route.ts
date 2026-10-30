
import "server-only";

import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/sessions";

const secret = process.env.SOCKET_AUTH_SECRET;
if (!secret) {
  throw new Error("SOCKET_AUTH_SECRET is not configured");
}

const secretKey = new TextEncoder().encode(secret);

export async function GET() {
  try {
    const current = await getCurrentUser();

    if (!current) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (current.user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Your account is not active" },
        { status: 403 },
      );
    }

    const token = await new SignJWT({
      sessionId: current.sessionId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(current.user.id)
      .setIssuedAt()
      .setExpirationTime("2m")
      .sign(secretKey);

    return NextResponse.json(
      { token },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Socket token generation failed:", error);

    return NextResponse.json(
      { error: "Unable to authenticate chat connection" },
      { status: 500 },
    );
  }
}
