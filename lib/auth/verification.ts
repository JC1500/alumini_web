import "server-only";

import {
  createHmac,
  randomInt,
  timingSafeEqual,
} from "node:crypto";

const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const secret = process.env.OTP_HASH_SECRET;

if (!secret || secret.length < 32) {
  throw new Error("OTP_HASH_SECRET must be configured securely");
}

export function generateVerificationCode(): string {
  return randomInt(0, 1_000_000)
    .toString()
    .padStart(OTP_LENGTH, "0");
}

export function hashVerificationCode(
  email: string,
  code: string,
): string {
  return createHmac("sha256", secret!)
    .update(`${email.trim().toLowerCase()}:${code}`)
    .digest("hex");
}

export function verifyVerificationCode(
  email: string,
  submittedCode: string,
  storedHash: string,
): boolean {
  if (!/^\d{6}$/.test(submittedCode)) {
    return false;
  }

  const expected = Buffer.from(
    hashVerificationCode(email, submittedCode),
    "hex",
  );

  const actual = Buffer.from(storedHash, "hex");

  return (
    expected.length === actual.length &&
    timingSafeEqual(expected, actual)
  );
}

export const verificationConfig = {
  expiresInMs: OTP_TTL_MS,
  maxAttempts: MAX_ATTEMPTS,
  resendCooldownMs: 60_000,
};