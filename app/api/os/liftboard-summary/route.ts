import { requireOwnerApi } from "@/lib/auth/owner";
import { fetchLiftboardSummary } from "@/lib/os/liftboard";
import { NextResponse } from "next/server";

export async function GET() {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const summary = await fetchLiftboardSummary();
    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load Liftboard summary.";
    const status = message.includes("SUPABASE_SERVICE_ROLE_KEY") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
