# Phase 3 — Infrastructure Module v2 (implementation plan, no code)

Goal: turn Infrastructure into a real homelab **source of truth** — explicit
host → VM → container/service topology, with IPs/ports/URLs, VM specs, Docker
containers, dependencies, backups, planned upgrades, and incident/status history.

Out of scope (not in this phase): Jarvis, agents, n8n workflows, Obsidian sync,
AI Memory exports.

> **Security callout (load-bearing):** `/infrastructure` today is a **public**
> marketing/case-study page. All v2 detail (IPs, ports, internal URLs, specs) is
> sensitive and must stay **owner-gated**. New detail pages go under `/command/...`
> (already behind the proxy owner gate), and the public `/infrastructure` page +
> `HomelabTopology` stay generic/sanitized. No internal addressing in public APIs.

---

## 1. What already exists

**Tables** (`20260609150000_forgeonix_os_memory.sql`):
- `infrastructure_assets` — `name, asset_type, host, status(asset_status), notes`
- `infrastructure_services` — `asset_id, name, url, status(service_status), notes`
- `infrastructure_incidents` — `service_id, title, severity, status, opened_at, resolved_at, notes`
- `infrastructure_planned_upgrades` — `title, target_asset_id, priority, status, planned_date, notes`

**Code:**
- `lib/os/infrastructure.ts` — `fetchInfrastructureDashboard()`, `addInfrastructureService()`, `updateInfrastructureServiceStatus()`.
- `app/api/os/infrastructure/route.ts` — **GET only** (owner-gated). Add/update helpers exist in the lib but aren't exposed.
- `components/command/panels/InfrastructurePanel.tsx` — read-only: services, upgrades, assets. Has an unused `expanded` state.
- `app/infrastructure/page.tsx` — **public** case study + `components/HomelabTopology.tsx` (static visual).
- Types in `types/forgeonix-os.ts`.

**Limitations:** IPs/ports/specs/containers/backups are all crammed into freeform
`notes`. No host→VM→container hierarchy (assets is flat; `host` is just text). No
dependencies, no backup model, no status history beyond incidents. Panel is read-only.

## 2. What needs to change (summary)

- Model the **hierarchy** explicitly (host → VM/LXC → container/service) via a
  self-referencing parent on assets + a containers table + service linkage.
- Promote crammed `notes` data into **real columns**: IP, MAC, ports, URLs, VM specs.
- Add **containers**, **dependencies**, **backups**, and **status-event history** as
  first-class data.
- Expose full **owner-gated CRUD** (today it's GET-only).
- Rebuild the **panel** into a topology + tabbed operational view with editing.
- Add optional owner-gated **/command/infrastructure** sub-pages.

## 3. Database changes — new migration `20260621140000_infrastructure_v2.sql`

Idempotent (`add column if not exists`, `create table if not exists`, guarded seeds),
RLS service-role-only, `set_os_updated_at()` triggers — same conventions as Phases 1–2.

**New enums:** `asset_kind` (host, vm, lxc, network_device, storage, other),
`container_status` (running, stopped, paused, restarting, exited),
`backup_health` (ok, stale, failing, none).

**ALTER `infrastructure_assets`** (becomes the host/VM node):
- `parent_id uuid null → infrastructure_assets(id)` (VM's parent = host)
- `kind asset_kind not null default 'other'`
- `ip_address text`, `mac_address text`, `os text`, `node_role text`
- VM specs: `cpu_cores int`, `ram_mb int`, `disk_gb int`
- (keep `host`/`asset_type` for back-compat; `kind`+`parent_id` supersede them)

**ALTER `infrastructure_services`:**
- `ip_address text`, `port int`, `internal_url text` (keep `url` as primary/public-safe)
- `container_id uuid null → infrastructure_containers(id)`
- (keep `asset_id` so a service can attach to a host/VM directly)

**NEW `infrastructure_containers`:**
`id, asset_id (→assets, the VM/host running Docker), name, image, status(container_status),
ports text, volumes text, compose_stack text, ip_address text, restart_policy text,
notes, timestamps`.

**NEW `infrastructure_dependencies`** (generic edges):
`id, from_type text, from_id uuid, to_type text, to_id uuid,
dependency_type text default 'depends_on', notes, created_at`,
unique(from_type, from_id, to_type, to_id, dependency_type).
(`*_type` ∈ asset|vm|container|service — lets Homepage→AdGuard, service→VM, etc.)

**NEW `infrastructure_backups`:**
`id, target_type text, target_id uuid null, name, method text (PBS/restic/snapshot…),
schedule text, location text, retention text, last_run_at timestamptz,
health backup_health default 'none', notes, timestamps`.

**NEW `infrastructure_status_events`** (append-only history):
`id, target_type text, target_id uuid, status text, note text, created_at`.
Lightweight status timeline for assets/services/containers (incidents table stays for
formal incidents). Future automations can append here; manual for now.

**Indexes:** parents, fks, `status_events(target_type,target_id,created_at desc)`.

**Seed (guarded):** the known homelab so it's a real source of truth on day one —
Proxmox host → Docker VM → containers/services (Home Assistant, n8n, AdGuard,
Homepage, Uptime Kuma), plus a couple of dependencies and a backup row. Mirrors the
AI Memory "Homelab stack" starter.

## 4. Types — `types/infrastructure.ts` (new) or extend `types/forgeonix-os.ts`

- Extend `InfrastructureAsset` (parent_id, kind, ip/mac/os/role, cpu/ram/disk).
- Extend `InfrastructureService` (ip_address, port, internal_url, container_id).
- New: `InfrastructureContainer`, `InfrastructureDependency`, `InfrastructureBackup`,
  `InfrastructureStatusEvent`; enum const arrays; `Add*/Update*` inputs.
- `InfrastructureDashboardV2` = assets, services, containers, dependencies, backups,
  incidents, upgrades, recentStatusEvents.
- A derived `TopologyNode` type (host → children) for the tree view.

## 5. Data layer — `lib/os/infrastructure.ts` (expanded)

- `fetchInfrastructureDashboard()` → v2 shape (parallel fetch of all tables).
- `buildTopology(dashboard)` → nests host → VM → containers/services using `parent_id`,
  `asset_id`, `container_id` (pure function; powers the map + `/assets` page).
- CRUD: assets, services, containers, dependencies, backups (add/update/delete);
  incidents (open/resolve); upgrades (add/update/delete); `appendStatusEvent()`.
- Validation: enum checks, required names, numeric spec clamping.

## 6. Owner-gated API routes (all use `requireOwnerApi()`; all under `/api/os/*` = proxy-gated)

- `GET /api/os/infrastructure` — dashboard v2.
- `assets/route.ts` (GET, POST) + `assets/[id]/route.ts` (PATCH, DELETE)
- `services/route.ts` (GET, POST) + `services/[id]/route.ts` (PATCH, DELETE)
- `containers/route.ts` (GET, POST) + `containers/[id]/route.ts` (PATCH, DELETE)
- `dependencies/route.ts` (GET, POST, DELETE)
- `backups/route.ts` (GET, POST) + `backups/[id]/route.ts` (PATCH, DELETE)
- `incidents/route.ts` (GET, POST) + `incidents/[id]/route.ts` (PATCH → resolve)
- `upgrades/route.ts` (GET, POST) + `upgrades/[id]/route.ts` (PATCH, DELETE)

(Could be consolidated into fewer routes with a `?type=` switch; resource routes are
clearer and match the Phase 2 pattern.)

## 7. Infrastructure panel UI — `components/command/panels/InfrastructurePanel.tsx` (rebuild)

Tabbed operational hub (reusing `ModuleHubShell` primitives):
- **Topology** — host → VM → container/service tree from `buildTopology()`, with
  status dots; the "Proxmox host → VM → container/service" relationship map.
- **Services** — name, IP:port, URL, status, host/container it runs on; status toggle; CRUD.
- **Containers** — image, ports, status, compose stack; CRUD.
- **Backups** — method, schedule, last run, health badge; CRUD.
- **Incidents** — open/resolve + recent **status history** timeline (`status_events`).
- **Roadmap** — planned upgrades, priority/date; CRUD.
- Dependencies shown inline per node ("depends on…").

## 8. Optional owner-gated pages — `/command/infrastructure/*`

Placed under `/command` so the existing proxy + `requireOwnerPage()` gate them
automatically (do **not** add these to the public `/infrastructure`):
- `/command/infrastructure/assets` — full inventory table (hosts/VMs/containers/services
  with IP/port/specs), filter/sort.
- `/command/infrastructure/roadmap` — upgrades timeline + roadmap, DB-driven.
- `/command/infrastructure/docs` — reuse `os_notes` (`note_type='documentation'`, tagged/
  module `infrastructure`) rather than a new table; render + add.

(If you specifically want the `/infrastructure/assets` URL shape, we'd extend the proxy
matcher and add `requireOwnerPage()` to those routes — but `/command/infrastructure/*`
is lower-risk and reuses what's built.)

## 9. Migration / rollout order

1. Run `20260621140000_infrastructure_v2.sql` in Supabase.
2. Types → data layer → API routes → panel → optional pages.
3. `npm run build` + lint in Cursor (sandbox can't build here).

## 10. Verification checklist (for build time)

- Create a host, a VM (parent=host), a container (asset=VM), a service (on container) →
  topology nests correctly.
- Set IP/port/URL/specs → they render and persist.
- Add a dependency (Homepage → AdGuard) → shown on both nodes.
- Add a backup with schedule + health → badge renders.
- Open then resolve an incident → status history timeline updates.
- Confirm none of this appears on the **public** `/infrastructure` page or in any
  unauthenticated API response (`curl -i` logged out → 401).

## 11. Open choices (my defaults in **bold**)

- Detail pages location: **`/command/infrastructure/*`** vs `/infrastructure/*` (public route, gated).
- Edges: **generic `infrastructure_dependencies`** vs per-table FKs.
- Docs storage: **reuse `os_notes`** vs a new `infrastructure_docs` table.
- `ip_address`: **`text`** (simple) vs Postgres `inet` (stricter).
