import { osDb } from "@/lib/os/db";
import type {
  AddInfrastructureServiceInput,
  InfrastructureDashboard,
  InfrastructureService,
} from "@/types/forgeonix-os";

export async function fetchInfrastructureDashboard(): Promise<InfrastructureDashboard> {
  const db = osDb();
  const [assets, services, incidents, upgrades] = await Promise.all([
    db.from("infrastructure_assets").select("*").order("name"),
    db.from("infrastructure_services").select("*").order("name"),
    db
      .from("infrastructure_incidents")
      .select("*")
      .order("opened_at", { ascending: false, nullsFirst: false }),
    db
      .from("infrastructure_planned_upgrades")
      .select("*")
      .order("planned_date", { ascending: true, nullsFirst: false }),
  ]);

  for (const result of [assets, services, incidents, upgrades]) {
    if (result.error) throw new Error(result.error.message);
  }

  return {
    assets: assets.data ?? [],
    services: services.data ?? [],
    incidents: incidents.data ?? [],
    upgrades: upgrades.data ?? [],
  };
}

export async function addInfrastructureService(
  input: AddInfrastructureServiceInput,
): Promise<InfrastructureService> {
  const name = input.name.trim();
  if (!name) throw new Error("Service name is required.");

  const { data, error } = await osDb()
    .from("infrastructure_services")
    .insert({
      name,
      asset_id: input.asset_id ?? null,
      url: input.url ?? null,
      status: input.status ?? "online",
      notes: input.notes ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as InfrastructureService;
}

export async function updateInfrastructureServiceStatus(
  id: string,
  status: InfrastructureService["status"],
): Promise<InfrastructureService> {
  const { data, error } = await osDb()
    .from("infrastructure_services")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as InfrastructureService;
}
