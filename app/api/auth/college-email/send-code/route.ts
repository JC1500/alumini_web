
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/sessions";
import { normalizeEmail, validateEmail } from "@/lib/auth/email";
import {
  generateVerificationCode,
  hashVerificationCode,
  verificationConfig,
} from "@/lib/auth/verification";
import { sendVerificationCode } from "@/lib/email/send-auth-email";

export const runtime = "nodejs";

const collegeEmailSchema = z.object({
  collegeEmail: z.string().trim().email().max(254),
});

const ALLOWED_COLLEGE_DOMAINS = new Set(["nituk.ac.in"]);

function isAllowedCollegeEmail(email: string): boolean {
  const separatorIndex = email.lastIndexOf("@");

  if (separatorIndex <= 0) {
    return false;
  }

  const domain = email.slice(separatorIndex + 1);

  if (!ALLOWED_COLLEGE_DOMAINS.has(domain)) {
    return false;
  }

  // Expected format: bt24cse017@nituk.ac.in
  // Two letters, two enrollment-year digits, department,
  // and a three-digit roll number.
  const localPart = email.slice(0, separatorIndex);

  return /^[a-z]{2}\d{2}[a-z]{2,10}\d{3}$/.test(localPart);
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: "Please sign in to continue." },
        { status: 401 }
      );
    }

    if (
      !session.user.emailVerified ||
      session.user.status !== "PENDING_COLLEGE_VERIFICATION"
    ) {
      return NextResponse.json(
        { error: "Your account is not awaiting college verification." },
        { status: 403 }
      );
    }

    const body: unknown = await request.json();
    const parsed = collegeEmailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a valid college email address." },
        { status: 400 }
      );
    }

    const collegeEmail = normalizeEmail(parsed.data.collegeEmail);

    if (
      !validateEmail(collegeEmail) ||
      !isAllowedCollegeEmail(collegeEmail)
    ) {
      return NextResponse.json(
        { error: "Enter a valid NIT Uttarakhand college email address." },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        collegeEmail,
        NOT: { id: session.user.id },
      },
      select: { id: true },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Unable to use this college email address." },
        { status: 409 }
      );
    }

    const now = new Date();

    const existingVerification =
      await prisma.collegeEmailVerification.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });

    if (
      existingVerification &&
      existingVerification.resendAvailableAt > now &&
      existingVerification.verifiedAt === null
    ) {
      return NextResponse.json(
        {
          error: "Please wait before requesting another code.",
          resendAvailableAt:
            existingVerification.resendAvailableAt.toISOString(),
        },
        { status: 429 }
      );
    }

    const code = generateVerificationCode();
    const codeHash = hashVerificationCode(collegeEmail, code);

    // Store the submitted college email on the account, but do not
    // mark it verified until the OTP is successfully checked.
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          collegeEmail,
          collegeEmailVerified: false,
        },
      });

      await tx.collegeEmailVerification.deleteMany({
        where: { userId: session.user.id },
      });

      await tx.collegeEmailVerification.create({
        data: {
          userId: session.user.id,
          collegeEmail,
          codeHash,
          expiresAt: new Date(
            now.getTime() + verificationConfig.expiresInMs
          ),
          attempts: 0,
          resendAvailableAt: new Date(
            now.getTime() + verificationConfig.resendCooldownMs
          ),
        },
      });
    });

    try {
      await sendVerificationCode(collegeEmail, code);
    } catch {
      await prisma.collegeEmailVerification.deleteMany({
        where: {
          userId: session.user.id,
          codeHash,
        },
      });

      return NextResponse.json(
        {
          error:
            "Unable to send the verification email. Please try again.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        message: "College verification code sent.",
        expiresInSeconds: verificationConfig.expiresInMs / 1000,
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("College email verification request failed", error);

    return NextResponse.json(
      { error: "Unable to process college verification right now." },
      { status: 500 }
    );
  }
}
