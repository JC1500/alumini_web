
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/auth/email";
import { verifyPassword } from "@/lib/auth/passwords";
import { createSession } from "@/lib/auth/sessions";

const signInSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 400 }
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const { password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        passwordHash: true,
        emailVerified: true,
        status: true,
      },
    });

    // Reject unknown, unverified, or suspended accounts.
    if (
      !user ||
      !user.passwordHash ||
      !user.emailVerified ||
      user.status !== "ACTIVE"
    ) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const passwordIsValid = await verifyPassword(
      user.passwordHash,
      password
    );

    if (!passwordIsValid) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Create the database-backed session and secure HTTP-only cookie.
    await createSession(user.id);

    return NextResponse.json(
      { message: "Signed in successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sign-in failed:", error);

    return NextResponse.json(
      {
        message: "Unable to sign in right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
