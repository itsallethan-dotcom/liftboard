import { requireOwnerApi } from "@/lib/auth/owner";
import { appendCommandLog, fetchCommandLogs } from "@/lib/os/command-core";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 20;
    const logs = await fetchCommandLogs(limit);
    return NextResponse.json({ logs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load logs.";
    return NextResponse.json({ error: message }, { status: message.includes("SUPABASE") ? 503 : 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const body = (await request.json()) as { message?: string; level?: string; module_key?: string };
    const log = await appendCommandLog({
      message: String(body.message ?? ""),
      level: body.level as never,
      module_key: body.module_key ?? null,
    });
    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to append log.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
