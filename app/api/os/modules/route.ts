import { requireOwnerApi } from "@/lib/auth/owner";
import { fetchModuleStatus } from "@/lib/os/command-core";
import { NextResponse } from "next/server";

export async function GET() {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const modules = await fetchModuleStatus();
    return NextResponse.json({ modules });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load modules.";
    return NextResponse.json({ error: message }, { status: message.includes("SUPABASE") ? 503 : 500 });
  }
}
