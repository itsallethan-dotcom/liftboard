import { osDb } from "@/lib/os/db";
import type { AddOsRecordInput, OsRecord, RecordsDashboard, UpdateOsRecordInput } from "@/types/forgeonix-os";
import { RECORD_TYPES } from "@/types/forgeonix-os";

export async function fetchOsRecords(): Promise<OsRecord[]> {
  const { data, error } = await osDb()
    .from("os_records")
    .select("*")
    .order("record_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as OsRecord[];
}

export async function fetchRecordsDashboard(): Promise<RecordsDashboard> {
  const records = await fetchOsRecords();
  return { records };
}

export async function addOsRecord(input: AddOsRecordInput): Promise<OsRecord> {
  const title = input.title.trim();
  if (!title) throw new Error("Record title is required.");

  const recordType = input.record_type ?? "milestone";
  if (!RECORD_TYPES.includes(recordType)) {
    throw new Error(`Invalid record type. Allowed: ${RECORD_TYPES.join(", ")}`);
  }

  const { data, error } = await osDb()
    .from("os_records")
    .insert({
      title,
      description: input.description ?? null,
      record_type: recordType,
      project: input.project ?? null,
      category: input.category ?? null,
      record_date: input.record_date ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as OsRecord;
}

export async function updateOsRecord(id: string, input: UpdateOsRecordInput): Promise<OsRecord> {
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title.trim();
  if (input.description !== undefined) patch.description = input.description;
  if (input.project !== undefined) patch.project = input.project;
  if (input.category !== undefined) patch.category = input.category;
  if (input.record_date !== undefined) patch.record_date = input.record_date;
  if (input.record_type !== undefined) patch.record_type = input.record_type;

  const { data, error } = await osDb()
    .from("os_records")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as OsRecord;
}
