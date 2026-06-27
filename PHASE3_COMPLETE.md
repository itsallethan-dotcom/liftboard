# Forgeonix OS — Phase 3 Complete (Infrastructure Module v2)

Infrastructure is now a real homelab source of truth: explicit host → VM →
container/service topology, IPs/ports/URLs, VM specs, Docker containers,
dependencies, backups, and incident/status history. All sensitive data stays
owner-gated. The public `/infrastructure` page was **not** touched (no IPs, ports,
internal URLs, specs, or private topology there).

Not built (still deferred): Jarvis, agents, n8n workflows, Obsidian sync, AI Memory exports.

## ⚠️ Apply the migration first

Run `supabase/migrations/20260621140000_infrastructure_v2.sql` in the Supabase SQL
editor (or `supabase db push`). It's upgrade-friendly: it resolves your existing
Proxmox Host / Docker VM rows, links the VM under the host, and seeds the container
stack (Home Assistant, n8n, AdGuard, Homepage, Uptime Kuma) + a backup row. Guarded
on the new `infrastructure_containers` table being empty, so it runs once.

## What was built

**Migration** `20260621140000_infrastructure_v2.sql`
- Enums `asset_kind`, `container_status`, `backup_health`.
- ALTER `infrastructure_assets`: `parent_id` (self-ref), `kind`, `ip_address`,
  `mac_address`, `os`, `node_role`, `cpu_cores`, `ram_mb`, `disk_gb`.
- ALTER `infrastructure_services`: `ip_address`, `port`, `internal_url`, `container_id`.
- New tables: `infrastructure_containers`, `infrastructure_dependencies`,
  `infrastructure_backups`, `infrastructure_status_events`. Indexes, triggers, RLS
  service-role-only. Backfill + idempotent topology seed.

**Types** — extended `InfrastructureAsset`/`InfrastructureService`; added
`InfrastructureContainer`/`Dependency`/`Backup`/`StatusEvent`, enums, `TopologyNode`,
dashboard v2, and Add/Update inputs (in `types/forgeonix-os.ts`).

**Data layer** `lib/os/infrastructure.ts` — v2 dashboard fetch (8 sources), full CRUD
for assets/services/containers/dependencies/backups/incidents/upgrades, `appendStatusEvent`
(auto-logged on status changes). `buildTopology` moved to `lib/os/topology.ts` (pure,
client-safe) and re-exported.

**API routes** (all owner-gated, under `/api/os/infrastructure/*`):
- `GET /api/os/infrastructure` — v2 dashboard.
- `assets`, `services`, `containers`, `backups`, `upgrades` — POST / PATCH / DELETE.
- `dependencies` — POST / DELETE. `incidents` — POST / PATCH (resolve).
  (PATCH/DELETE take `id` in body / `?id=`.)

**Panel** `components/command/panels/InfrastructurePanel.tsx` — rebuilt as a tabbed
hub: **Topology** (host→VM→container/service tree + add host/VM), **Services**
(IP/port/URL + status + CRUD), **Containers** (image/ports/status + CRUD), **Backups**
(method/schedule/health + CRUD), **Incidents** (log/resolve + status-history timeline),
**Roadmap** (planned upgrades + CRUD). Quick links to the detail pages.

**Owner-gated pages** under `/command/infrastructure/` (gated by proxy + `requireOwnerPage`):
- `/assets` — full inventory tables (hosts/VMs with specs, containers, services with IP/port).
- `/roadmap` — upgrades grouped by status.
- `/docs` — reuses `os_notes` (documentation type, tagged `infra`).

## Verification checklist (run in Cursor — sandbox can't build here)

```bash
npm run lint
npm run build
```

Signed in as owner, open Infrastructure on `/command`:
1. Topology shows Proxmox Host → Docker VM → the 5 containers.
2. Add a host/VM, then a service on it with IP/port → appears in Topology + Services.
3. Toggle a container/service status → status-history timeline (Incidents tab) records it.
4. Add a backup with schedule/health → badge renders.
5. Log an incident, then resolve it.
6. Visit `/command/infrastructure/assets`, `/roadmap`, `/docs` → load with data.

Security checks (critical):
- `curl -i .../api/os/infrastructure` logged out → `401`.
- `/command/infrastructure/assets` logged out → redirect to `/login`.
- Open the **public** `/infrastructure` page → confirm NO IPs/ports/specs/internal
  URLs appear (it's unchanged marketing content).

## Notes / decisions
- Dependencies API + table are in place; the panel surfaces topology but a dedicated
  dependency-editor UI is a small follow-up.
- Asset delete is available via API; the panel currently exposes create + status; full
  per-field asset edit can be added if you want it.
