import { addLead, fetchLeadsDashboard } from "@/lib/os/leads";
import type { AddLeadInput, LeadStatus } from "@/types/forgeonix-os";
import { LEAD_STATUSES } from "@/types/forgeonix-os";
import { NextResponse } from "next/server";

function parseLead(body: unknown): AddLeadInput {
  const raw = body as Record<string, unknown>;
  const status = raw.status as LeadStatus | undefined;
  if (status && !LEAD_STATUSES.includes(status)) {
    throw new Error(`Invalid status. Allowed: ${LEAD_STATUSES.join(", ")}`);
  }
  return {
    name: String(raw.name ?? ""),
    company: raw.company != null ? String(raw.company) : null,
    email: raw.email != null ? String(raw.email) : null,
    phone: raw.phone != null ? String(raw.phone) : null,
    source: raw.source != null ? String(raw.source) : "manual",
    status,
    notes: raw.notes != null ? String(raw.notes) : null,
    follow_up_date: raw.follow_up_date != null ? String(raw.follow_up_date) : null,
    priority: typeof raw.priority === "number" ? raw.priority : 0,
  };
}

export async function GET() {
  try {
    return NextResponse.json(await fetchLeadsDashboard());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load leads.";
    return NextResponse.json({ error: message }, { status: message.includes("SUPABASE") ? 503 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    const lead = await addLead(parseLead(await request.json()));
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add lead.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
