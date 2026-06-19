import { osDb } from "@/lib/os/db";
import type {
  AddBusinessClientInput,
  AddBusinessTaskInput,
  BusinessClient,
  BusinessDashboard,
  BusinessTask,
} from "@/types/forgeonix-os";
import { fetchOsProjects } from "@/lib/os/projects";

export async function fetchBusinessDashboard(): Promise<BusinessDashboard> {
  const db = osDb();
  const [clients, tasks, followUps, offers, revenue, projects] = await Promise.all([
    db.from("business_clients").select("*").order("name"),
    db
      .from("business_tasks")
      .select("*")
      .order("due_date", { ascending: true, nullsFirst: false }),
    db
      .from("business_follow_ups")
      .select("*")
      .order("due_date", { ascending: true, nullsFirst: false }),
    db.from("business_offers").select("*").order("created_at", { ascending: false }),
    db
      .from("business_revenue")
      .select("*")
      .order("recorded_date", { ascending: false, nullsFirst: false }),
    fetchOsProjects(),
  ]);

  for (const result of [clients, tasks, followUps, offers, revenue]) {
    if (result.error) throw new Error(result.error.message);
  }

  return {
    clients: clients.data ?? [],
    tasks: tasks.data ?? [],
    followUps: followUps.data ?? [],
    offers: offers.data ?? [],
    revenue: revenue.data ?? [],
    projects,
  };
}

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
