import { requireOwnerApi } from "@/lib/auth/owner";
import { convertLeadToClient } from "@/lib/os/business";
import { NextResponse } from "next/server";

// Core Business OS workflow: convert a lead into an active client.
export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const body = (await request.json()) as { leadId?: string };
    if (!body.leadId) throw new Error("leadId is required.");
    const result = await convertLeadToClient(String(body.leadId));
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to convert lead.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
