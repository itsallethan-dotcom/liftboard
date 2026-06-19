import { osDb } from "@/lib/os/db";
import type { AddLeadInput, Lead, LeadsDashboard, LeadStatus, UpdateLeadInput } from "@/types/forgeonix-os";
import { LEAD_STATUSES } from "@/types/forgeonix-os";

function computeLeadStats(leads: Lead[]) {
  const now = new Date();
  const followUpsDue = leads.filter((l) => {
    if (!l.follow_up_date || l.status === "won" || l.status === "lost" || l.status === "archived") {
      return false;
    }
    return new Date(l.follow_up_date) <= now;
  }).length;

  const qualified = leads.filter((l) =>
    ["qualified", "proposal"].includes(l.status),
  ).length;

  const active = leads.filter((l) => !["won", "lost", "archived"].includes(l.status)).length;

  return { total: active, followUpsDue, qualified };
}

export async function fetchLeads(): Promise<Lead[]> {
  const { data, error } = await osDb()
    .from("leads")
    .select("*")
    .order("follow_up_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Lead[];
}

export async function fetchLeadsDashboard(): Promise<LeadsDashboard> {
  const leads = await fetchLeads();
  return { leads, stats: computeLeadStats(leads) };
}

export async function addLead(input: AddLeadInput): Promise<Lead> {
  const name = input.name.trim();
  if (!name) throw new Error("Lead name is required.");

  const status = input.status ?? "new";
  if (!LEAD_STATUSES.includes(status)) {
    throw new Error(`Invalid status. Allowed: ${LEAD_STATUSES.join(", ")}`);
  }

  const { data, error } = await osDb()
    .from("leads")
    .insert({
      name,
      company: input.company ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      source: input.source ?? "manual",
      status,
      notes: input.notes ?? null,
      follow_up_date: input.follow_up_date ?? null,
      priority: input.priority ?? 0,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Lead;
}

export async function updateLead(id: string, input: UpdateLeadInput): Promise<Lead> {
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name.trim();
  if (input.company !== undefined) patch.company = input.company;
  if (input.email !== undefined) patch.email = input.email;
  if (input.phone !== undefined) patch.phone = input.phone;
  if (input.source !== undefined) patch.source = input.source;
  if (input.notes !== undefined) patch.notes = input.notes;
  if (input.follow_up_date !== undefined) patch.follow_up_date = input.follow_up_date;
  if (input.priority !== undefined) patch.priority = input.priority;
  if (input.status !== undefined) {
    if (!LEAD_STATUSES.includes(input.status)) {
      throw new Error(`Invalid status. Allowed: ${LEAD_STATUSES.join(", ")}`);
    }
    patch.status = input.status;
  }

  const { data, error } = await osDb().from("leads").update(patch).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return data as Lead;
}

export async function findLeadByCompany(company: string): Promise<Lead | null> {
  const { data, error } = await osDb()
    .from("leads")
    .select("*")
    .ilike("company", company.trim())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Lead | null;
}
