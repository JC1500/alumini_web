
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/sessions";
import {
  normalizeEmail,
  validateEmail,
} from "@/lib/auth/email";
import {
  verifyVerificationCode,
  verificationConfig,
} from "@/lib/auth/verification";

export const runtime = "nodejs";

const COLLEGE_DOMAIN = "nituk.ac.in";

const verifySchema = z.object({
  collegeEmail: z.string().trim().email().max(254),
  code: z.string().regex(/^\d{6}$/),
});

type AcademicIdentity = {
  degreeCode: "BT" | "MT";
  degreeName: "B.Tech" | "M.Tech";
  enrollmentYear: number;
  academicDepartmentCode: string;
  rollNumber: string;
  expectedGraduationYear: number;
};

function parseAcademicIdentity(
  collegeEmail: string,
): AcademicIdentity | null {
  const [localPart, domain, ...extra] = collegeEmail.split("@");

  if (
    domain !== COLLEGE_DOMAIN ||
    extra.length > 0 ||
    !localPart
  ) {
    return null;
  }

  // Examples: bt24cse017, mt24cse017
  const match = localPart.match(
    /^(bt|mt)(\d{2})([a-z]{2,10})(\d{3})$/i,
  );

  if (!match) {
    return null;
  }

  const degreeCode = match[1].toUpperCase() as "BT" | "MT";
  const enrollmentYear = 2000 + Number(match[2]);
  const academicDepartmentCode = match[3].toUpperCase();
  const rollNumber = match[4];

  const degreeName = degreeCode === "BT" ? "B.Tech" : "M.Tech";
  const durationYears = degreeCode === "BT" ? 4 : 2;

  return {
    degreeCode,
    degreeName,
    enrollmentYear,
    academicDepartmentCode,
    rollNumber,
    expectedGraduationYear: enrollmentYear + durationYears,
  };
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: "Please sign in to continue." },
        { status: 401 },
      );
    }

    if (
      !session.user.emailVerified ||
      session.user.status !== "PENDING_COLLEGE_VERIFICATION"
    ) {
      return NextResponse.json(
        { error: "Your account is not awaiting college verification." },
        { status: 403 },
      );
    }

    const body: unknown = await request.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a valid college email and six-digit code." },
        { status: 400 },
      );
    }

    const collegeEmail = normalizeEmail(parsed.data.collegeEmail);
    const code = parsed.data.code;

    if (
      !validateEmail(collegeEmail) ||
      collegeEmail.split("@")[1] !== COLLEGE_DOMAIN
    ) {
      return NextResponse.json(
        { error: "Use your valid NIT Uttarakhand college email." },
        { status: 400 },
      );
    }

    const academicIdentity = parseAcademicIdentity(collegeEmail);

    if (!academicIdentity) {
      return NextResponse.json(
        {
          error:
            "Your college email format is not supported. Only BT and MT addresses with a valid enrollment year, department code, and three-digit roll number are currently supported.",
        },
        { status: 400 },
      );
    }

    const verification =
      await prisma.collegeEmailVerification.findFirst({
        where: {
          userId: session.user.id,
          collegeEmail,
        },
        orderBy: { createdAt: "desc" },
      });

    if (!verification) {
      return NextResponse.json(
        { error: "Request a verification code first." },
        { status: 400 },
      );
    }

    if (verification.verifiedAt) {
      return NextResponse.json(
        { error: "This verification code has already been used." },
        { status: 400 },
      );
    }

    if (verification.expiresAt <= new Date()) {
      await prisma.collegeEmailVerification.deleteMany({
        where: { id: verification.id },
      });

      return NextResponse.json(
        { error: "Verification code expired. Request a new code." },
        { status: 400 },
      );
    }

    if (verification.attempts >= verificationConfig.maxAttempts) {
      return NextResponse.json(
        { error: "Too many attempts. Request a new code." },
        { status: 429 },
      );
    }

    const valid = verifyVerificationCode(
      collegeEmail,
      code,
      verification.codeHash,
    );

    if (!valid) {
      await prisma.collegeEmailVerification.updateMany({
        where: {
          id: verification.id,
          attempts: { lt: verificationConfig.maxAttempts },
          verifiedAt: null,
        },
        data: {
          attempts: { increment: 1 },
        },
      });

      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 },
      );
    }

    await prisma.$transaction(async (tx) => {
      const currentVerification =
        await tx.collegeEmailVerification.findUnique({
          where: { id: verification.id },
        });

      if (
        !currentVerification ||
        currentVerification.verifiedAt ||
        currentVerification.expiresAt <= new Date() ||
        currentVerification.attempts >= verificationConfig.maxAttempts ||
        currentVerification.codeHash !== verification.codeHash
      ) {
        throw new Error("COLLEGE_VERIFICATION_NO_LONGER_VALID");
      }

      const user = await tx.user.findUnique({
        where: { id: session.user.id },
        select: {
          emailVerified: true,
          status: true,
          collegeEmail: true,
          collegeEmailVerified: true,
        },
      });

      if (
        !user ||
        !user.emailVerified ||
        user.status !== "PENDING_COLLEGE_VERIFICATION" ||
        user.collegeEmail !== collegeEmail ||
        user.collegeEmailVerified
      ) {
        throw new Error("ACCOUNT_NOT_ELIGIBLE_FOR_VERIFICATION");
      }

      await tx.collegeEmailVerification.update({
        where: { id: currentVerification.id },
        data: { verifiedAt: new Date() },
      });

      await tx.user.update({
        where: { id: session.user.id },
        data: {
          collegeEmailVerified: true,
          degreeCode: academicIdentity.degreeCode,
          degreeName: academicIdentity.degreeName,
          enrollmentYear: academicIdentity.enrollmentYear,
          academicDepartmentCode:
            academicIdentity.academicDepartmentCode,
          rollNumber: academicIdentity.rollNumber,
          expectedGraduationYear:
            academicIdentity.expectedGraduationYear,
          status: "PENDING_PROFILE_COMPLETION",
        },
      });
    });

    return NextResponse.json({
      message:
        "College email verified. Complete your alumni profile to activate your account.",
      nextStep: "PROFILE_COMPLETION",
      status: "PENDING_PROFILE_COMPLETION",
      academicIdentity,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      [
        "COLLEGE_VERIFICATION_NO_LONGER_VALID",
        "ACCOUNT_NOT_ELIGIBLE_FOR_VERIFICATION",
      ].includes(error.message)
    ) {
      return NextResponse.json(
        {
          error:
            "Verification could not be completed. Please request a new code and try again.",
        },
        { status: 409 },
      );
    }

    console.error("College email verification failed", error);

    return NextResponse.json(
      { error: "Unable to verify college email right now." },
      { status: 500 },
    );
  }
}
