import { osDb } from "@/lib/os/db";
import { fetchLeads } from "@/lib/os/leads";
import { fetchOsProjects } from "@/lib/os/projects";
import type {
  AddBusinessClientInput,
  AddBusinessCommunicationInput,
  AddBusinessContactInput,
  AddBusinessInvoiceInput,
  AddBusinessTaskInput,
  BusinessClient,
  BusinessCommunication,
  BusinessContact,
  BusinessDashboard,
  BusinessInvoice,
  BusinessRevenue,
  BusinessTask,
  ConvertLeadResult,
  Lead,
  MonthlyRevenue,
  UpdateBusinessContactInput,
  UpdateBusinessInvoiceInput,
} from "@/types/forgeonix-os";

/* ------------------------------- Dashboard -------------------------------- */

export async function fetchBusinessDashboard(): Promise<BusinessDashboard> {
  const db = osDb();
  const [clients, tasks, followUps, offers, revenue, contacts, communications, invoices, projects, leads] =
    await Promise.all([
      db.from("business_clients").select("*").order("name"),
      db.from("business_tasks").select("*").order("due_date", { ascending: true, nullsFirst: false }),
      db.from("business_follow_ups").select("*").order("due_date", { ascending: true, nullsFirst: false }),
      db.from("business_offers").select("*").order("created_at", { ascending: false }),
      db.from("business_revenue").select("*").order("recorded_date", { ascending: false, nullsFirst: false }),
      db.from("business_contacts").select("*").order("name"),
      db.from("business_communications").select("*").order("occurred_at", { ascending: false, nullsFirst: false }),
      db.from("business_invoices").select("*").order("issued_date", { ascending: false, nullsFirst: false }),
      fetchOsProjects(),
      fetchLeads(),
    ]);

  for (const result of [clients, tasks, followUps, offers, revenue, contacts, communications, invoices]) {
    if (result.error) throw new Error(result.error.message);
  }

  const revenueRows = (revenue.data ?? []) as BusinessRevenue[];

  return {
    clients: (clients.data ?? []) as BusinessClient[],
    tasks: (tasks.data ?? []) as BusinessTask[],
    followUps: followUps.data ?? [],
    offers: offers.data ?? [],
    revenue: revenueRows,
    projects,
    leads,
    contacts: (contacts.data ?? []) as BusinessContact[],
    communications: (communications.data ?? []) as BusinessCommunication[],
    invoices: (invoices.data ?? []) as BusinessInvoice[],
    monthlyRevenue: computeMonthlyRevenue(revenueRows),
  };
}

/** Group received revenue into YYYY-MM totals (most recent first). */
export function computeMonthlyRevenue(revenue: BusinessRevenue[]): MonthlyRevenue[] {
  const totals = new Map<string, number>();
  for (const r of revenue) {
    if (r.status !== "received") continue;
    const date = r.recorded_date ?? r.created_at;
    if (!date) continue;
    const month = date.slice(0, 7); // YYYY-MM
    totals.set(month, (totals.get(month) ?? 0) + Number(r.amount ?? 0));
  }
  return Array.from(totals.entries())
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => (a.month < b.month ? 1 : -1));
}

/* ----------------------- Lead → Client conversion ------------------------- */
/**
 * Core Business OS workflow. Converts a lead into an active client:
 *  - creates a business_clients row (stage = active, won),
 *  - links it back to the lead and marks the lead won,
 *  - is idempotent: if the lead was already converted, returns the existing client.
 */
export async function convertLeadToClient(leadId: string): Promise<ConvertLeadResult> {
  const db = osDb();

  const { data: leadData, error: leadError } = await db
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();
  if (leadError) throw new Error(leadError.message);
  const lead = leadData as Lead;

  // Idempotency: already converted → return the existing client.
  if (lead.converted_client_id) {
    const { data: existing, error: exErr } = await db
      .from("business_clients")
      .select("*")
      .eq("id", lead.converted_client_id)
      .single();
    if (exErr) throw new Error(exErr.message);
    return { client: existing as BusinessClient, lead };
  }

  const { data: clientData, error: clientError } = await db
    .from("business_clients")
    .insert({
      name: lead.company ?? lead.name,
      company: lead.company,
      email: lead.email,
      status: "active",
      stage: "active",
      lead_id: lead.id,
      won_at: new Date().toISOString(),
      notes: lead.notes,
    })
    .select("*")
    .single();
  if (clientError) throw new Error(clientError.message);
  const client = clientData as BusinessClient;

  const { data: updatedLead, error: updErr } = await db
    .from("leads")
    .update({ status: "won", converted_client_id: client.id })
    .eq("id", lead.id)
    .select("*")
    .single();
  if (updErr) throw new Error(updErr.message);

  return { client, lead: updatedLead as Lead };
}

/* -------------------------------- Clients --------------------------------- */

export async function addBusinessClient(input: AddBusinessClientInput): Promise<BusinessClient> {
  const name = input.name.trim();
  if (!name) throw new Error("Client name is required.");

  const { data, error } = await osDb()
    .from("business_clients")
    .insert({
      name,
      company: input.company ?? null,
      email: input.email ?? null,
      status: input.status ?? "prospect",
      notes: input.notes ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as BusinessClient;
}

export async function updateBusinessClient(
  id: string,
  patch: Partial<Pick<BusinessClient, "name" | "company" | "email" | "status" | "stage" | "notes">>,
): Promise<BusinessClient> {
  const { data, error } = await osDb()
    .from("business_clients")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as BusinessClient;
}

/* --------------------------------- Tasks ---------------------------------- */

export async function addBusinessTask(input: AddBusinessTaskInput): Promise<BusinessTask> {
  const title = input.title.trim();
  if (!title) throw new Error("Task title is required.");

  const { data, error } = await osDb()
    .from("business_tasks")
    .insert({
      title,
      client_id: input.client_id ?? null,
      status: input.status ?? "open",
      priority: input.priority ?? 0,
      due_date: input.due_date ?? null,
      notes: input.notes ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as BusinessTask;
}

export async function updateBusinessTask(
  id: string,
  patch: Partial<AddBusinessTaskInput & { status: BusinessTask["status"] }>,
): Promise<BusinessTask> {
  const { data, error } = await osDb()
    .from("business_tasks")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as BusinessTask;
}

/* ------------------------------- Contacts --------------------------------- */

export async function addBusinessContact(input: AddBusinessContactInput): Promise<BusinessContact> {
  const name = input.name.trim();
  if (!name) throw new Error("Contact name is required.");
  const { data, error } = await osDb()
    .from("business_contacts")
    .insert({
      name,
      client_id: input.client_id ?? null,
      lead_id: input.lead_id ?? null,
      role: input.role ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      notes: input.notes ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as BusinessContact;
}

export async function updateBusinessContact(
  id: string,
  input: UpdateBusinessContactInput,
): Promise<BusinessContact> {
  const { data, error } = await osDb()
    .from("business_contacts")
    .update(pickDefined(input))
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as BusinessContact;
}

export async function deleteBusinessContact(id: string): Promise<void> {
  const { error } = await osDb().from("business_contacts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ---------------------------- Communications ------------------------------ */

export async function addBusinessCommunication(
  input: AddBusinessCommunicationInput,
): Promise<BusinessCommunication> {
  const { data, error } = await osDb()
    .from("business_communications")
    .insert({
      channel: input.channel ?? "note",
      client_id: input.client_id ?? null,
      lead_id: input.lead_id ?? null,
      contact_id: input.contact_id ?? null,
      direction: input.direction ?? null,
      subject: input.subject ?? null,
      summary: input.summary ?? null,
      occurred_at: input.occurred_at ?? new Date().toISOString(),
      owner: input.owner ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as BusinessCommunication;
}

export async function deleteBusinessCommunication(id: string): Promise<void> {
  const { error } = await osDb().from("business_communications").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* -------------------------------- Invoices -------------------------------- */

export async function addBusinessInvoice(input: AddBusinessInvoiceInput): Promise<BusinessInvoice> {
  const { data, error } = await osDb()
    .from("business_invoices")
    .insert({
      client_id: input.client_id ?? null,
      project_id: input.project_id ?? null,
      invoice_number: input.invoice_number ?? null,
      amount: input.amount ?? null,
      currency: input.currency ?? "USD",
      status: input.status ?? "draft",
      issued_date: input.issued_date ?? null,
      due_date: input.due_date ?? null,
      paid_date: input.paid_date ?? null,
      notes: input.notes ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as BusinessInvoice;
}

export async function updateBusinessInvoice(
  id: string,
  input: UpdateBusinessInvoiceInput,
): Promise<BusinessInvoice> {
  const { data, error } = await osDb()
    .from("business_invoices")
    .update(pickDefined(input))
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as BusinessInvoice;
}

export async function deleteBusinessInvoice(id: string): Promise<void> {
  const { error } = await osDb().from("business_invoices").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* -------------------------------- Helpers --------------------------------- */

function pickDefined<T extends Record<string, unknown>>(input: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) out[key] = value;
  }
  return out;
}
