/**
 * Forgeonix CRM — write layer (Phase 2).
 * Validates input, then delegates to the active source. Identical for demo/Supabase.
 */
import { storeFor } from "@/lib/crm/service";
import type { CreateInput, CrmEntityKey, CrmRecord } from "@/lib/crm/types";

const REQUIRED_FIELD: Record<CrmEntityKey, { field: string; label: string }> = {
  clients: { field: "name", label: "Client name" },
  leads: { field: "name", label: "Lead name" },
  tasks: { field: "title", label: "Task title" },
  followUps: { field: "title", label: "Follow-up title" },
  proposals: { field: "title", label: "Proposal title" },
  payments: { field: "label", label: "Payment label" },
  notes: { field: "body", label: "Note body" },
};

function validateCreate(key: CrmEntityKey, input: Record<string, unknown>): void {
  const req = REQUIRED_FIELD[key];
  const value = input[req.field];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${req.label} is required.`);
  }
  if (key === "payments" && typeof input.amount !== "number") {
    throw new Error("Payment amount must be a number.");
  }
}

export async function createEntity(
  key: CrmEntityKey,
  input: Record<string, unknown>,
): Promise<CrmRecord> {
  validateCreate(key, input);
  return storeFor(key).create(input as CreateInput<CrmRecord>);
}

export async function updateEntity(
  key: CrmEntityKey,
  id: string,
  patch: Record<string, unknown>,
): Promise<CrmRecord | null> {
  return storeFor(key).update(id, patch);
}

export async function deleteEntity(key: CrmEntityKey, id: string): Promise<boolean> {
  return storeFor(key).remove(id);
}
