import { requireOwnerApi } from "@/lib/auth/owner";
import { fetchBusinessDashboard } from "@/lib/os/business";
import { NextResponse } from "next/server";

export async function GET() {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    return NextResponse.json(await fetchBusinessDashboard());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load business data.";
    return NextResponse.json({ error: message }, { status: message.includes("SUPABASE") ? 503 : 500 });
  }
}
