import { osDb } from "@/lib/os/db";
import type {
  AddInfrastructureAssetInput,
  AddInfrastructureBackupInput,
  AddInfrastructureContainerInput,
  AddInfrastructureDependencyInput,
  AddInfrastructureIncidentInput,
  AddInfrastructureServiceInput,
  AddInfrastructureUpgradeInput,
  InfrastructureAsset,
  InfrastructureBackup,
  InfrastructureContainer,
  InfrastructureDashboard,
  InfrastructureDependency,
  InfrastructureService,
  UpdateInfrastructureAssetInput,
  UpdateInfrastructureBackupInput,
  UpdateInfrastructureContainerInput,
  UpdateInfrastructureServiceInput,
  UpdateInfrastructureUpgradeInput,
} from "@/types/forgeonix-os";

/* ------------------------------- Dashboard -------------------------------- */

export async function fetchInfrastructureDashboard(): Promise<InfrastructureDashboard> {
  const db = osDb();
  const [assets, services, containers, dependencies, backups, incidents, upgrades, statusEvents] =
    await Promise.all([
      db.from("infrastructure_assets").select("*").order("name"),
      db.from("infrastructure_services").select("*").order("name"),
      db.from("infrastructure_containers").select("*").order("name"),
      db.from("infrastructure_dependencies").select("*"),
      db.from("infrastructure_backups").select("*").order("name"),
      db
        .from("infrastructure_incidents")
        .select("*")
        .order("opened_at", { ascending: false, nullsFirst: false }),
      db
        .from("infrastructure_planned_upgrades")
        .select("*")
        .order("planned_date", { ascending: true, nullsFirst: false }),
      db
        .from("infrastructure_status_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

  for (const result of [
    assets,
    services,
    containers,
    dependencies,
    backups,
    incidents,
    upgrades,
    statusEvents,
  ]) {
    if (result.error) throw new Error(result.error.message);
  }

  return {
    assets: assets.data ?? [],
    services: services.data ?? [],
    containers: containers.data ?? [],
    dependencies: dependencies.data ?? [],
    backups: backups.data ?? [],
    incidents: incidents.data ?? [],
    upgrades: upgrades.data ?? [],
    statusEvents: statusEvents.data ?? [],
  };
}

// buildTopology lives in lib/os/topology.ts (pure, client-safe); re-exported for servers.
export { buildTopology } from "@/lib/os/topology";

/* -------------------------------- Assets ---------------------------------- */

export async function addInfrastructureAsset(
  input: AddInfrastructureAssetInput,
): Promise<InfrastructureAsset> {
  const name = input.name.trim();
  if (!name) throw new Error("Asset name is required.");
  const { data, error } = await osDb()
    .from("infrastructure_assets")
    .insert({
      name,
      kind: input.kind ?? "other",
      parent_id: input.parent_id ?? null,
      asset_type: input.asset_type ?? null,
      status: input.status ?? "online",
      ip_address: input.ip_address ?? null,
      mac_address: input.mac_address ?? null,
      os: input.os ?? null,
      node_role: input.node_role ?? null,
      cpu_cores: input.cpu_cores ?? null,
      ram_mb: input.ram_mb ?? null,
      disk_gb: input.disk_gb ?? null,
      notes: input.notes ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as InfrastructureAsset;
}

export async function updateInfrastructureAsset(
  id: string,
  input: UpdateInfrastructureAssetInput,
): Promise<InfrastructureAsset> {
  const patch = pickDefined(input);
  const { data, error } = await osDb()
    .from("infrastructure_assets")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  if (patch.status) await appendStatusEvent("asset", id, String(patch.status));
  return data as InfrastructureAsset;
}

export async function deleteInfrastructureAsset(id: string): Promise<void> {
  const { error } = await osDb().from("infrastructure_assets").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* -------------------------------- Services -------------------------------- */

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
      ip_address: input.ip_address ?? null,
      port: input.port ?? null,
      internal_url: input.internal_url ?? null,
      container_id: input.container_id ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as InfrastructureService;
}

export async function updateInfrastructureService(
  id: string,
  input: UpdateInfrastructureServiceInput,
): Promise<InfrastructureService> {
  const patch = pickDefined(input);
  const { data, error } = await osDb()
    .from("infrastructure_services")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  if (patch.status) await appendStatusEvent("service", id, String(patch.status));
  return data as InfrastructureService;
}

export async function updateInfrastructureServiceStatus(
  id: string,
  status: InfrastructureService["status"],
): Promise<InfrastructureService> {
  return updateInfrastructureService(id, { status });
}

export async function deleteInfrastructureService(id: string): Promise<void> {
  const { error } = await osDb().from("infrastructure_services").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ------------------------------- Containers ------------------------------- */

export async function addInfrastructureContainer(
  input: AddInfrastructureContainerInput,
): Promise<InfrastructureContainer> {
  const name = input.name.trim();
  if (!name) throw new Error("Container name is required.");
  const { data, error } = await osDb()
    .from("infrastructure_containers")
    .insert({
      name,
      asset_id: input.asset_id ?? null,
      image: input.image ?? null,
      status: input.status ?? "running",
      ports: input.ports ?? null,
      volumes: input.volumes ?? null,
      compose_stack: input.compose_stack ?? null,
      ip_address: input.ip_address ?? null,
      restart_policy: input.restart_policy ?? null,
      notes: input.notes ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as InfrastructureContainer;
}

export async function updateInfrastructureContainer(
  id: string,
  input: UpdateInfrastructureContainerInput,
): Promise<InfrastructureContainer> {
  const patch = pickDefined(input);
  const { data, error } = await osDb()
    .from("infrastructure_containers")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  if (patch.status) await appendStatusEvent("container", id, String(patch.status));
  return data as InfrastructureContainer;
}

export async function deleteInfrastructureContainer(id: string): Promise<void> {
  const { error } = await osDb().from("infrastructure_containers").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ------------------------------ Dependencies ------------------------------ */

export async function addInfrastructureDependency(
  input: AddInfrastructureDependencyInput,
): Promise<InfrastructureDependency> {
  if (!input.from_id || !input.to_id) throw new Error("from_id and to_id are required.");
  const { data, error } = await osDb()
    .from("infrastructure_dependencies")
    .insert({
      from_type: input.from_type,
      from_id: input.from_id,
      to_type: input.to_type,
      to_id: input.to_id,
      dependency_type: input.dependency_type ?? "depends_on",
      notes: input.notes ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as InfrastructureDependency;
}

export async function deleteInfrastructureDependency(id: string): Promise<void> {
  const { error } = await osDb().from("infrastructure_dependencies").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* --------------------------------- Backups -------------------------------- */

export async function addInfrastructureBackup(
  input: AddInfrastructureBackupInput,
): Promise<InfrastructureBackup> {
  const name = input.name.trim();
  if (!name) throw new Error("Backup name is required.");
  const { data, error } = await osDb()
    .from("infrastructure_backups")
    .insert({
      name,
      target_type: input.target_type ?? null,
      target_id: input.target_id ?? null,
      method: input.method ?? null,
      schedule: input.schedule ?? null,
      location: input.location ?? null,
      retention: input.retention ?? null,
      last_run_at: input.last_run_at ?? null,
      health: input.health ?? "none",
      notes: input.notes ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as InfrastructureBackup;
}

export async function updateInfrastructureBackup(
  id: string,
  input: UpdateInfrastructureBackupInput,
): Promise<InfrastructureBackup> {
  const patch = pickDefined(input);
  const { data, error } = await osDb()
    .from("infrastructure_backups")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as InfrastructureBackup;
}

export async function deleteInfrastructureBackup(id: string): Promise<void> {
  const { error } = await osDb().from("infrastructure_backups").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* -------------------------------- Incidents ------------------------------- */

export async function addInfrastructureIncident(input: AddInfrastructureIncidentInput) {
  const title = input.title.trim();
  if (!title) throw new Error("Incident title is required.");
  const { data, error } = await osDb()
    .from("infrastructure_incidents")
    .insert({
      title,
      service_id: input.service_id ?? null,
      severity: input.severity ?? "low",
      status: input.status ?? "open",
      opened_at: new Date().toISOString(),
      notes: input.notes ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function resolveInfrastructureIncident(id: string) {
  const { data, error } = await osDb()
    .from("infrastructure_incidents")
    .update({ status: "resolved", resolved_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/* -------------------------------- Upgrades -------------------------------- */

export async function addInfrastructureUpgrade(input: AddInfrastructureUpgradeInput) {
  const title = input.title.trim();
  if (!title) throw new Error("Upgrade title is required.");
  const { data, error } = await osDb()
    .from("infrastructure_planned_upgrades")
    .insert({
      title,
      target_asset_id: input.target_asset_id ?? null,
      priority: input.priority ?? 0,
      status: input.status ?? "planned",
      planned_date: input.planned_date ?? null,
      notes: input.notes ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateInfrastructureUpgrade(
  id: string,
  input: UpdateInfrastructureUpgradeInput,
) {
  const patch = pickDefined(input);
  const { data, error } = await osDb()
    .from("infrastructure_planned_upgrades")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteInfrastructureUpgrade(id: string): Promise<void> {
  const { error } = await osDb().from("infrastructure_planned_upgrades").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ------------------------------ Status events ----------------------------- */

export async function appendStatusEvent(
  targetType: string,
  targetId: string,
  status: string,
  note?: string,
): Promise<void> {
  const { error } = await osDb()
    .from("infrastructure_status_events")
    .insert({ target_type: targetType, target_id: targetId, status, note: note ?? null });
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
