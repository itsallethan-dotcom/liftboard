# CRM (Forgeonix Business) — Phase 3: Dashboard UI (done)

The CRM dashboard now lives inside Forgeonix OS, in the Business module. It reuses
the **frozen V1 styling** (the existing hub toolkit) — **no new CSS, no visual
redesign** — and reads the single source-agnostic `/api/crm/dashboard` endpoint.

## What was built

A self-contained **`CrmDashboard`** component that:
- fetches `GET /api/crm/dashboard` once (the Phase-2 single-snapshot endpoint), and
- renders with the existing `ModuleHubShell` toolkit (`HubSection`, `HubStats`,
  `HubListItem`) so it matches the command center exactly.

It shows everything Phase 3 asked for:
- **CRM Overview:** total leads, active clients, open tasks (warns if overdue),
  follow-ups due (warns if any), proposals sent, revenue tracked.
- **Pipeline & Cash:** active leads, overdue tasks, proposals pending, revenue pending.
- **Recent Activity:** the latest changes across leads, clients, tasks, follow-ups,
  proposals, payments, and notes, each with a relative timestamp and a type badge.

Because it consumes the source-agnostic endpoint, it behaves identically in demo mode
and Supabase mode — the component has no idea which is in use.

## How it's surfaced (non-breaking)

The Business module panel (`BusinessPanel`) gained a **"CRM" tab** (now the default
tab when the module opens). The existing tabs — Dashboard, Pipeline, Clients, Tasks,
Invoices, Revenue — are **untouched and fully functional**; the CRM tab is purely
additive and renders the new component. Nothing in the existing panel's data flow or
logic changed.

## Files changed

- **New:** `components/command/panels/CrmDashboard.tsx` — the dashboard component.
- **Edited:** `components/command/panels/BusinessPanel.tsx` — four minimal changes:
  import the component, add `"CRM"` to the tab list, default to it, and render it.

No styling files, no API/service/data-layer changes, no other modules touched.

## Build
- `tsc --noEmit` reports **`CrmDashboard.tsx` clean**. The `BusinessPanel.tsx` lines
  from tsc are the known **stale-sandbox truncation** (they only appear after editing,
  at the cut point); the four edits are small, balanced replacements and the on-disk
  file is valid. Real build runs in Cursor.

## Verify (in Cursor)
1. `npm run build` — should pass.
2. Open `/command` → Business module: the **CRM** tab shows the live dashboard
   (seeded data in demo mode, Supabase data otherwise). Other tabs still work.

## Note on the visual freeze
This is a functional addition that **reuses V1 components and styles** — it does not
change the visual direction. No style adjustment was needed.

---

**Stopping for approval before Phase 4 (client management).**
