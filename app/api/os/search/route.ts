import { requireOwnerApi } from "@/lib/auth/owner";
import { searchOs } from "@/lib/os/command-core";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    const results = await searchOs(q);
    return NextResponse.json({ query: q, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed.";
    return NextResponse.json({ error: message }, { status: message.includes("SUPABASE") ? 503 : 500 });
  }
}
