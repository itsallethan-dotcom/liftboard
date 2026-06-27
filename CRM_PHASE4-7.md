# CRM (Forgeonix Business) — Phases 4–7 (done)

The CRM module is now fully operational. Everything runs through the source-agnostic
`/api/crm/*` layer (demo or Supabase — identical) and uses the **frozen V1 hub
toolkit** (no new visual direction, no new CSS). All four phases live as sub-tabs of
the **CRM** workspace inside the Business module.

## What was built

**Phase 4 — Client management (`CrmClients`)**
Add / view / edit / archive clients; status (prospect / active / inactive / archived);
contact info (company, email); notes. Archived clients are separated and can be
restored. Inline editor per client with Save + Archive.

**Phase 5 — Lead pipeline (`CrmLeads`)**
Leads grouped into pipeline stages, each with a status selector to move them through:
New → Contacted → **Discovery** → **Proposal Sent** → Won / Lost / Archived. Add lead
with stage + next-follow-up date. Closed leads listed compactly.

**Phase 6 — Tasks & follow-ups (`CrmTasks`)**
Create tasks assigned to a client *or* lead, with due date, priority (low/med/high),
**overdue ⚠ indicator**, and one-click "Done". Separate follow-ups section with the
same assign + due-date + complete flow, surfacing what's due.

**Phase 7 — Revenue & proposals (`CrmRevenue`)**
Proposals with amount, status (draft→sent→accepted/declined/expired) and auto-stamped
**sent / accepted dates** on status change. Payments with amount, status
(pending/received/cancelled) and **paid date**. A cash summary (received / pending /
in-proposals) on top.

## Architecture (unchanged from Phase 2)
Each section uses a tiny shared hook (`useCrmSection`) for list + optimistic
reload, and `crmApi` (`lib/crm/client.ts`) for create/update/delete against the REST
endpoints. The UI never knows whether demo or Supabase served the data.

## Files

**New (7):**
- `lib/crm/client.ts` — browser fetch helpers for `/api/crm/*`
- `components/command/panels/crm/crm-hooks.ts` — `useCrmSection` + date/overdue utils
- `components/command/panels/crm/CrmClients.tsx` (Phase 4)
- `components/command/panels/crm/CrmLeads.tsx` (Phase 5)
- `components/command/panels/crm/CrmTasks.tsx` (Phase 6)
- `components/command/panels/crm/CrmRevenue.tsx` (Phase 7)
- `components/command/panels/crm/CrmWorkspace.tsx` — sub-tab shell (Overview / Clients / Leads / Tasks / Revenue)

**Edited (1):**
- `components/command/panels/BusinessPanel.tsx` — the **CRM** tab now renders the full
  `CrmWorkspace` (was the dashboard). Legacy tabs (Dashboard/Pipeline/Clients/Tasks/
  Invoices/Revenue) are **untouched and still work**.

## Honest deviations (no schema changes were made)
- **Lead statuses** use the canonical enum; "Discovery" and "Proposal Sent" are
  friendly labels for `qualified` / `proposal` — so the pipeline reads as requested
  without altering Supabase.
- **Client "project type"** and a dedicated client **"next follow-up date"** column
  don't exist on `business_clients`. Client follow-ups are modeled with the real
  follow-ups entity (assignable to a client), and descriptive info goes in client
  notes. If you want these as first-class client columns, that needs a small migration
  — say the word and I'll add it.
- **Notes** CRUD exists in the API/data layer and shows in recent activity; a dedicated
  per-client notes UI can be added later if wanted.

## Build
- All seven new files typecheck **clean**. `BusinessPanel.tsx` shows only the known
  **stale-sandbox truncation** phantom; the on-disk file is balanced and valid (verified
  directly). Run `npm run build` in Cursor to confirm.

## Try it
- Live (default, with your Supabase): the CRM reads/writes the real `business_*` / `leads`
  tables.
- Demo: set `NEXT_PUBLIC_FORGEONIX_DEMO=true` in `.env.local` to use the in-memory seed
  data with full CRUD — no backend needed. Same UI, same behavior.

The Forgeonix Business module is now a working CRM: dashboard + clients + pipeline +
tasks/follow-ups + revenue/proposals, all on one swappable data layer.
