
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  normalizeEmail,
  validateEmail,
} from "@/lib/auth/email";
import {
  verifyVerificationCode,
  verificationConfig,
} from "@/lib/auth/verification";
import { createSession } from "@/lib/auth/sessions";

export const runtime = "nodejs";

const verifySchema = z.object({
  email: z.string().trim().email().max(254),
  code: z.string().regex(/^\d{6}$/),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a valid email and six-digit code." },
        { status: 400 }
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const code = parsed.data.code;

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Invalid verification request." },
        { status: 400 }
      );
    }

    const pending = await prisma.pendingRegistration.findUnique({
      where: { email },
    });

    if (!pending) {
      return NextResponse.json(
        {
          error:
            "Registration expired or unavailable. Please sign up again.",
        },
        { status: 400 }
      );
    }

    if (pending.expiresAt <= new Date()) {
      await prisma.pendingRegistration.deleteMany({
        where: { id: pending.id },
      });

      return NextResponse.json(
        {
          error: "Verification code expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    if (pending.attempts >= verificationConfig.maxAttempts) {
      return NextResponse.json(
        {
          error: "Too many attempts. Request a new verification code.",
        },
        { status: 429 }
      );
    }

    const valid = verifyVerificationCode(
      email,
      code,
      pending.codeHash
    );

    if (!valid) {
      await prisma.pendingRegistration.updateMany({
        where: {
          id: pending.id,
          attempts: { lt: verificationConfig.maxAttempts },
        },
        data: {
          attempts: { increment: 1 },
        },
      });

      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 }
      );
    }

    const user = await prisma.$transaction(async (tx) => {
      const currentPending =
        await tx.pendingRegistration.findUnique({
          where: { id: pending.id },
        });

      if (
        !currentPending ||
        currentPending.expiresAt <= new Date() ||
        currentPending.attempts >= verificationConfig.maxAttempts ||
        currentPending.codeHash !== pending.codeHash
      ) {
        throw new Error("REGISTRATION_NO_LONGER_VALID");
      }

      const existingUser = await tx.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existingUser) {
        throw new Error("ACCOUNT_ALREADY_EXISTS");
      }

      const createdUser = await tx.user.create({
        data: {
          email,
          passwordHash: currentPending.passwordHash,
          emailVerified: true,
          profile: {
            create: {
              // New custom-auth profiles do not need a Clerk user ID.
              clerkUserId: null,
              fullName: email.split("@")[0],
              username: `user_${randomUUID()
                .replace(/-/g, "")
                .slice(0, 16)}`,
              headline: "",
              bio: "",
              department: "",
              graduationYear: new Date().getFullYear(),
              location: "",
              state: "",
              district: "",
              city: "",
            },
          },
        },
        select: { id: true },
      });

      await tx.pendingRegistration.delete({
        where: { id: currentPending.id },
      });

      return createdUser;
    });

    await createSession(user.id);

    return NextResponse.json({
      message: "Email verified and account created.",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      [
        "REGISTRATION_NO_LONGER_VALID",
        "ACCOUNT_ALREADY_EXISTS",
      ].includes(error.message)
    ) {
      return NextResponse.json(
        {
          error:
            "Registration could not be completed. Please try again.",
        },
        { status: 409 }
      );
    }

    console.error("Email verification failed", error);

    return NextResponse.json(
      { error: "Unable to verify email right now." },
      { status: 500 }
    );
  }
}
