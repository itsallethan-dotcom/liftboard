import { fetchInfrastructureDashboard } from "@/lib/os/infrastructure";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(await fetchInfrastructureDashboard());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load infrastructure.";
    return NextResponse.json({ error: message }, { status: message.includes("SUPABASE") ? 503 : 500 });
  }
}
