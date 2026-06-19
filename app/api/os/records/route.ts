import { addOsRecord, fetchRecordsDashboard } from "@/lib/os/records";
import type { AddOsRecordInput, RecordType } from "@/types/forgeonix-os";
import { RECORD_TYPES } from "@/types/forgeonix-os";
import { NextResponse } from "next/server";

function parseRecord(body: unknown): AddOsRecordInput {
  const raw = body as Record<string, unknown>;
  const recordType = raw.record_type as RecordType | undefined;
  if (recordType && !RECORD_TYPES.includes(recordType)) {
    throw new Error(`Invalid record type. Allowed: ${RECORD_TYPES.join(", ")}`);
  }
  return {
    title: String(raw.title ?? ""),
    description: raw.description != null ? String(raw.description) : null,
    record_type: recordType,
    project: raw.project != null ? String(raw.project) : null,
    category: raw.category != null ? String(raw.category) : null,
    record_date: raw.record_date != null ? String(raw.record_date) : null,
  };
}

export async function GET() {
  try {
    return NextResponse.json(await fetchRecordsDashboard());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load records.";
    return NextResponse.json({ error: message }, { status: message.includes("SUPABASE") ? 503 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    const record = await addOsRecord(parseRecord(await request.json()));
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add record.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
