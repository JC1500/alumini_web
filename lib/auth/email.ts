import "server-only";

import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email()
  .max(254);

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}