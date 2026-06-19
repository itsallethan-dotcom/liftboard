import { osDb } from "@/lib/os/db";
import type {
  AddOsProjectInput,
  OsProject,
  ProjectStatus,
  UpdateOsProjectInput,
} from "@/types/forgeonix-os";
import { PROJECT_STATUSES } from "@/types/forgeonix-os";

export async function fetchOsProjects(): Promise<OsProject[]> {
  const { data, error } = await osDb()
    .from("os_projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as OsProject[];
}

export async function addOsProject(input: AddOsProjectInput): Promise<OsProject> {
  const name = input.name.trim();
  if (!name) throw new Error("Project name is required.");

  const status = input.status ?? "in_development";
  if (!PROJECT_STATUSES.includes(status)) {
    throw new Error(`Invalid status. Allowed: ${PROJECT_STATUSES.join(", ")}`);
  }

  const { data, error } = await osDb()
    .from("os_projects")
    .insert({
      name,
      slug: input.slug ?? null,
      description: input.description ?? null,
      status,
      stack: input.stack ?? null,
      url: input.url ?? null,
      client_id: input.client_id ?? null,
      display_order: input.display_order ?? 999,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as OsProject;
}

export async function updateOsProject(id: string, input: UpdateOsProjectInput): Promise<OsProject> {
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name.trim();
  if (input.slug !== undefined) patch.slug = input.slug;
  if (input.description !== undefined) patch.description = input.description;
  if (input.stack !== undefined) patch.stack = input.stack;
  if (input.url !== undefined) patch.url = input.url;
  if (input.client_id !== undefined) patch.client_id = input.client_id;
  if (input.display_order !== undefined) patch.display_order = input.display_order;
  if (input.status !== undefined) {
    if (!PROJECT_STATUSES.includes(input.status as ProjectStatus)) {
      throw new Error(`Invalid status. Allowed: ${PROJECT_STATUSES.join(", ")}`);
    }
    patch.status = input.status;
  }

  const { data, error } = await osDb()
    .from("os_projects")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as OsProject;
}
