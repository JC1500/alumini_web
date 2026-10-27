
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/auth/email";
import { isPersonalEmailAllowed } from "@/lib/auth/email-policy";
import {
  generateVerificationCode,
  hashVerificationCode,
  verificationConfig,
} from "@/lib/auth/verification";
import { sendVerificationCode } from "@/lib/email/send-auth-email";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().email().max(254),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    const email = normalizeEmail(parsed.data.email);

    if (!isPersonalEmailAllowed(email)) {
      return NextResponse.json(
        { error: "This email address is not eligible." },
        { status: 400 },
      );
    }

    const pending = await prisma.pendingRegistration.findUnique({
      where: { email },
    });

    if (!pending) {
      return NextResponse.json(
        { error: "No pending registration found. Please sign up again." },
        { status: 404 },
      );
    }

    const now = new Date();

    if (pending.resendAvailableAt > now) {
      const retryAfterSeconds = Math.ceil(
        (pending.resendAvailableAt.getTime() - now.getTime()) / 1000,
      );

      return NextResponse.json(
        {
          error: "Please wait before requesting another code.",
          retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSeconds),
          },
        },
      );
    }

    const code = generateVerificationCode();
    const codeHash = hashVerificationCode(email, code);

    // Replace the old challenge before sending the new code.
    const updated = await prisma.pendingRegistration.updateMany({
      where: {
        id: pending.id,
        resendAvailableAt: { lte: now },
      },
      data: {
        codeHash,
        expiresAt: new Date(
          now.getTime() + verificationConfig.expiresInMs,
        ),
        attempts: 0,
        resendAvailableAt: new Date(
          now.getTime() + verificationConfig.resendCooldownMs,
        ),
      },
    });

    if (updated.count !== 1) {
      return NextResponse.json(
        { error: "A code was already requested. Please try again shortly." },
        { status: 429 },
      );
    }

    try {
      await sendVerificationCode(email, code);
    } catch {
      // Don't restore or reveal the previous code.
      // The user can retry after the cooldown.
      console.error("Resend verification email failed");

      return NextResponse.json(
        { error: "Unable to send a new code. Please try again later." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        message: "A new verification code has been sent.",
        expiresInSeconds: verificationConfig.expiresInMs / 1000,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Resend OTP request failed", error);

    return NextResponse.json(
      { error: "Unable to process the request right now." },
      { status: 500 },
    );
  }
}
