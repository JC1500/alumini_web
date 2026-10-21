import type { TokenRequest } from "ably";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { userChannel } from "@/lib/ably/channels";
import { getCurrentProfile } from "@/lib/chat/get-current-profile";
import { getAblyRestClient } from "@/lib/ably/server";

export const dynamic = "force-dynamic";

function jsonResponse(
  body: { error: string } | TokenRequest,
  status = 200,
) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return jsonResponse({ error: "You must be signed in." }, 401);
    }

    const result = await getCurrentProfile();

    if (result.status === "profile_missing") {
      return jsonResponse(
        { error: "Complete your alumni profile to use messaging." },
        403,
      );
    }

    if (result.status === "unauthenticated") {
      return jsonResponse({ error: "You must be signed in." }, 401);
    }

    const tokenRequest = await getAblyRestClient().auth.createTokenRequest({
      clientId: result.profile.id,
      capability: { [userChannel(result.profile.id)]: ["subscribe"] },
      ttl: 60 * 60 * 1000,
    });

    return jsonResponse(tokenRequest);
  } catch (error) {
    console.error("Ably token request creation failed:", error);
    return jsonResponse(
      { error: "Unable to authorize real-time messaging." },
      500,
    );
  }
}
