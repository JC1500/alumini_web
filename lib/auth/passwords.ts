import "server-only";

import argon2 from "argon2";

const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_MAX_LENGTH = 128;

export function validatePassword(password: string): boolean {
  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    password.length <= PASSWORD_MAX_LENGTH
  );
}

export async function hashPassword(
  password: string,
): Promise<string> {
  if (!validatePassword(password)) {
    throw new Error(
      "Password must be between 12 and 128 characters.",
    );
  }

  return argon2.hash(password, {
    type: argon2.argon2id,
  });
}

export async function verifyPassword(
  passwordHash: string,
  password: string,
): Promise<boolean> {
  try {
    return await argon2.verify(passwordHash, password);
  } catch {
    return false;
  }
}