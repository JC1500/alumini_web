
import "server-only";

import { getCurrentUser } from "@/lib/auth/sessions";

/**
 * Returns the current session only when the user has:
 * - Verified their personal email
 * - Verified their college email
 * - An ACTIVE account
 *
 * Returns null for logged-out, pending, or suspended users.
 */
export async function getVerifiedUser() {
  const session = await getCurrentUser();

  if (!session) {
    return null;
  }

  const { user } = session;

  if (
    !user.emailVerified ||
    !user.collegeEmailVerified ||
    user.status !== "ACTIVE"
  ) {
    return null;
  }

  return session;
}
