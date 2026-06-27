# CRM (Forgeonix Business) — Phase 1: Data Model + Demo Data Layer (done)

Functionality work begins. Visual design is frozen at V1 — **no UI or styling was
touched this phase.** Phase 1 builds the foundation for the data-source pattern:
`UI → API routes → service/data layer → Supabase or demo-data`.

## Design decision — reuse, don't duplicate

The OS already has canonical entity types and Supabase tables for this domain
(`business_clients`, `leads`, `business_tasks`, `business_follow_ups`,
`business_offers`, `business_revenue`, `business_invoices`). Re-inventing them
would create the exact "disconnected system" you warned against. So the CRM model
**re-uses those canonical types** and adds only what's CRM-specific. The demo data
is byte-compatible with the live Supabase shapes, so the Phase-2 service layer can
swap sources with no UI awareness.

## Entity mapping (your list → canonical model)

| Requested entity | CRM type | Backing table (live mode) |
|---|---|---|
| clients | `Client` (= BusinessClient) | `business_clients` |
| leads | `Lead` | `leads` |
| tasks | `Task` (= BusinessTask) | `business_tasks` |
| follow-ups | `FollowUp` (= BusinessFollowUp) | `business_follow_ups` |
| offers/proposals | `Proposal` (= BusinessOffer) | `business_offers` |
| revenue/payments | `Payment` (= BusinessRevenue) | `business_revenue` |
| notes | `CrmNote` (new) | (maps to notes/communications in Phase 2) |

## Files added (4 new; zero existing files changed)

- **`lib/crm/types.ts`** — the CRM data model: re-exports the canonical entities
  under CRM-friendly names, plus `CrmNote`, `CrmStats`, `CrmActivity`, and
  `CrmSnapshot` (the full-dataset read the dashboard will consume).
- **`lib/crm/config.ts`** — `isDemoMode()`: the data-source switch. Explicit
  `NEXT_PUBLIC_FORGEONIX_DEMO` / `FORGEONIX_DEMO` flag wins; otherwise demo is on
  only when Supabase isn't configured (so the OS runs out of the box).
- **`lib/crm/demo-data.ts`** — realistic seed for all 7 entities (4 clients,
  5 leads across the pipeline, 4 tasks, 3 follow-ups, 3 proposals, 4 payments,
  3 notes). Dates are relative to "now" so due/overdue indicators stay meaningful.
- **`lib/crm/demo-store.ts`** — the in-memory demo data layer: a uniform CRUD
  collection per entity (`list/get/create/update/remove/reset`) over clones of the
  seed, plus `crmDemoSnapshot()` and `resetCrmDemo()`. This is the "demo" branch the
  API will call in Phase 2.

## Confirm — files changed
Only the four new files under `lib/crm/`. **No existing file was modified**, no
component, route, API, Supabase, or styling touched. Nothing imports the new module
yet, so existing modules are completely unaffected.

## Confirm — build
`npx tsc --noEmit` reports **no errors in `lib/crm/`** (the only tsc noise is a
known stale-sandbox phantom on an unrelated file; the host files are correct, and
the project build runs cleanly in Cursor). Since nothing imports `lib/crm` yet, it
cannot affect the existing build.

## What was added (summary)
A complete, type-safe CRM data model aligned to the existing OS schema, a demo-mode
flag, a realistic in-memory dataset, and a CRUD demo data layer — the foundation for
a source-agnostic CRM. No UI, no API routes yet (those are Phases 3 and 2).

## Verification you can run
1. `npm run build` (in Cursor) — should pass unchanged.
2. (Optional) confirm `isDemoMode()` returns what you expect for your `.env.local`.

---

**Stopping here for approval before Phase 2 (API routes), as requested.**
