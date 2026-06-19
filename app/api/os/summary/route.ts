import { fetchOsModuleSummary } from "@/lib/os/summary";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const modules = await fetchOsModuleSummary();
    return NextResponse.json({ modules });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load OS summary.";
    const status = message.includes("SUPABASE_SERVICE_ROLE_KEY") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
