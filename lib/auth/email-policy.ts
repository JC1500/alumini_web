import "server-only";

import { normalizeEmail } from "./email";

const BLOCKED_EMAIL_DOMAINS = new Set([
  "nituk.ac.in",
  "nituk.ac",
]);

export function isPersonalEmailAllowed(email: string): boolean {
  const normalized = normalizeEmail(email);
  const separatorIndex = normalized.lastIndexOf("@");

  if (separatorIndex <= 0) {
    return false;
  }

  const domain = normalized.slice(separatorIndex + 1);

  if (!domain || domain.endsWith(".")) {
    return false;
  }

  if (BLOCKED_EMAIL_DOMAINS.has(domain)) {
    return false;
  }

  return true;
}