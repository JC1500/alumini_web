
import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "alumini_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const tokenHash = hashSessionToken(token);

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!session || session.expiresAt <= new Date()) {
    await prisma.session.deleteMany({
      where: { tokenHash },
    });

    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  if (session.user.status !== "ACTIVE") {
    await prisma.session.deleteMany({
      where: { id: session.id },
    });

    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  const { user, ...sessionInfo } = session;

  return {
    sessionId: sessionInfo.id,
    user: {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      status: user.status,
      profile: user.profile
        ? {
            id: user.profile.id,
            username: user.profile.username,
            fullName: user.profile.fullName,
          }
        : null,
    },
  };
}

export async function destroyCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: { tokenHash: hashSessionToken(token) },
    });
  }

  cookieStore.delete(SESSION_COOKIE);
}
