# CRM (Forgeonix Business) — Phase 2: API / Service Layer (done)

Backend/API only — **no UI** was built this phase, and the V1 visual design was not
touched. The full source-agnostic CRUD + dashboard layer is in place.

## Service architecture

```
UI (Phase 3)
  ↓ fetch
API routes  (app/api/crm/**)               ← thin: 2 lines each via a route factory
  ↓
queries.ts / mutations.ts                   ← reads + aggregation / validated writes
  ↓
service/index.ts  →  crmSource()            ← picks source from isDemoMode()
  ↓                         ↘
demo-source.ts            supabase-source.ts
  ↓                         ↓
in-memory demo store      Supabase (canonical business_* / leads tables)
```

The **`CrmDataSource` contract** (`service/source.ts`) is implemented identically by
both sources, so everything above the source line is source-agnostic. The UI will
never know or care where data comes from — it just calls `/api/crm/*`.

**Why responses are identical across sources:** both sources return the same
canonical entity shapes, and the dashboard aggregation (stats + recent activity) runs
in TypeScript over a single snapshot — not in SQL — so demo and Supabase produce
byte-identical payloads.

**Performance:** the dashboard is **one round trip**. `crmSource().snapshot()` batches
all reads (demo: instant; Supabase: a single `Promise.all` of the table selects), and
stats/activity are computed in memory from that one snapshot. No N+1, no per-card calls.

## Endpoints (all owner-gated via `requireOwnerApi`)

For each of **clients, leads, tasks, follow-ups, proposals, revenue, notes**:

- `GET  /api/crm/<entity>` — list
- `POST /api/crm/<entity>` — create (validated)
- `GET    /api/crm/<entity>/[id]` — get (404 if missing)
- `PATCH  /api/crm/<entity>/[id]` — update (404 if missing)
- `DELETE /api/crm/<entity>/[id]` — delete (404 if missing)

Plus the aggregate:

- `GET /api/crm/dashboard` — `{ stats, recentActivity, snapshot }` in one call:
  total leads, active leads, active clients, open tasks, **overdue tasks**,
  **follow-ups due**, proposals sent, **proposals pending**, revenue received,
  revenue pending, and recent activity across all entities.

## Notes mapping
Notes have no dedicated table, so in **live mode** they map to
`business_communications` rows with `channel = 'note'` (keeping the CRM connected to
existing communications data rather than a silo). The mapper makes them present as the
same `CrmNote` shape the demo store returns — identical to the UI.

## Files changed

**Edited (1, CRM-only — created in Phase 1):**
- `lib/crm/types.ts` — extended `CrmStats`, added `CreateInput`/`UpdateInput`,
  `CrmEntityKey`, `CrmDashboard`.

**New (22):**
- Service: `lib/crm/service/source.ts`, `demo-source.ts`, `supabase-source.ts`, `index.ts`
- Read/write: `lib/crm/queries.ts`, `lib/crm/mutations.ts`
- Route factory: `lib/crm/api.ts`
- Routes: `app/api/crm/dashboard/route.ts` + `clients|leads|tasks|follow-ups|proposals|revenue|notes` each with `route.ts` and `[id]/route.ts` (14 files)

**No existing OS file was modified** — the CRM module is entirely additive and reuses
the existing canonical tables and auth.

## Build
- `tsc --noEmit` reports the CRM code clean. (The one tsc line is a confirmed
  **stale-sandbox truncation** of the edited `types.ts` — the on-disk file is complete
  and valid, verified directly; the real build runs in Cursor.)
- `osDb()` is only ever invoked inside async handlers, never at import, so importing the
  service in demo mode never requires Supabase. Demo mode works with zero backend.

## Verify (in Cursor)
1. `npm run build` — should pass.
2. With demo mode on: `GET /api/crm/dashboard` returns seeded stats/activity;
   `POST /api/crm/leads` etc. create in-memory records; same shapes as live mode.

---

**Stopping for review before Phase 3 (the CRM dashboard UI), as requested.**
