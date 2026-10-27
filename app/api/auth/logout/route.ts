
import { NextResponse } from "next/server";
import { destroyCurrentSession } from "@/lib/auth/sessions";

export const runtime = "nodejs";

export async function POST() {
  await destroyCurrentSession();

  return new NextResponse(null, { status: 204 });
}
