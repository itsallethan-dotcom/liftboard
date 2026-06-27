import { requireOwnerApi } from "@/lib/auth/owner";
import { fetchInfrastructureDashboard } from "@/lib/os/infrastructure";
import { NextResponse } from "next/server";

export async function GET() {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    return NextResponse.json(await fetchInfrastructureDashboard());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load infrastructure.";
    return NextResponse.json({ error: message }, { status: message.includes("SUPABASE") ? 503 : 500 });
  }
}
