
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  normalizeEmail,
  validateEmail,
} from "@/lib/auth/email";
import { isPersonalEmailAllowed } from "@/lib/auth/email-policy";
import {
  hashPassword,
  validatePassword,
} from "@/lib/auth/passwords";
import {
  generateVerificationCode,
  hashVerificationCode,
  verificationConfig,
} from "@/lib/auth/verification";
import { sendVerificationCode } from "@/lib/email/send-auth-email";

export const runtime = "nodejs";

const signupSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(128),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a valid email and password." },
        { status: 400 },
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const password = parsed.data.password;

    if (!validateEmail(email) || !validatePassword(password)) {
      return NextResponse.json(
        { error: "Enter a valid email and password." },
        { status: 400 },
      );
    }

    if (!isPersonalEmailAllowed(email)) {
      return NextResponse.json(
        { error: "Please use an eligible personal email address." },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Unable to register with these details." },
        { status: 409 },
      );
    }

    const existingPending =
      await prisma.pendingRegistration.findUnique({
        where: { email },
        select: { id: true },
      });

    if (existingPending) {
      return NextResponse.json(
        {
          error:
            "A registration is already pending. Use the resend-code option.",
        },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);
    const code = generateVerificationCode();
    const codeHash = hashVerificationCode(email, code);
    const now = Date.now();

    await prisma.pendingRegistration.create({
      data: {
        email,
        passwordHash,
        codeHash,
        expiresAt: new Date(
          now + verificationConfig.expiresInMs,
        ),
        attempts: 0,
        resendAvailableAt: new Date(
          now + verificationConfig.resendCooldownMs,
        ),
      },
    });

    try {
      await sendVerificationCode(email, code);
    } catch {
      await prisma.pendingRegistration.deleteMany({
        where: { email, codeHash },
      });

      return NextResponse.json(
        { error: "Unable to send the verification email. Please try again." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        message: "Verification code sent.",
        email,
        expiresInSeconds:
          verificationConfig.expiresInMs / 1000,
      },
      { status: 202 },
    );
  } catch (error) {
    console.error("Signup request failed", error);

    return NextResponse.json(
      { error: "Unable to process signup right now." },
      { status: 500 },
    );
  }
}
