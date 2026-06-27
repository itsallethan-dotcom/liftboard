# Phase 4 — Business OS v2, Chunk 2 (API + panel + summary)

Builds on Chunk 1 (migration + types + data layer). This chunk adds the owner-gated
API, the lead→client convert endpoint, the rebuilt Business panel, and summary wiring.
No Jarvis / agents / n8n / exports / Obsidian; testimonials & deliverables still deferred.

## What changed

**API routes (all owner-gated, under `/api/os/business/*` = proxy-gated)**
- `POST /api/os/business/convert` — `{ leadId }` → `convertLeadToClient` (the core workflow).
- `clients` — POST (create), PATCH (edit + stage move).
- `tasks` — POST, PATCH.
- `contacts` — POST, PATCH, DELETE.
- `communications` — POST, DELETE.
- `invoices` — POST, PATCH, DELETE.
- `leads` — added **PATCH** (status/stage moves) to the existing GET/POST route.
- `GET /api/os/business` already returns the v2 dashboard (unchanged route, richer data).

**Business panel** (`components/command/panels/BusinessPanel.tsx`, rebuilt, tabbed):
- **Dashboard** — open leads, clients, open tasks, follow-ups due, revenue this month, outstanding invoices + upcoming follow-ups.
- **Pipeline** — board across the 8 stages (Lead → Contacted → Proposal → Client → Project Work → Revenue → Review → Archived); lead cards have **Convert →**, client cards have a stage selector.
- **Clients** — list + add; client detail shows **contacts** (add/delete) and **communication history** (log note/call/email).
- **Tasks** — list + add (priority level, due date) + done toggle.
- **Invoices** — list + add + status select (auto-sets paid date) + delete.
- **Revenue** — received/pending totals, **monthly totals**, revenue history (read-only).

**Summary wiring** (`lib/os/summary.ts`):
- `business` card → Clients, Leads, Follow-ups Due, Open Tasks, Revenue (mo), Next Action.
- `finance` card → Revenue (mo), Outstanding Invoices, Pending Revenue, Revenue Entries.

## Verification checklist (run in Cursor)

```bash
npm run lint
npm run build
```

Signed in as owner, open Business on `/command`:
1. **Pipeline / convert (core):** create a lead → it shows in the Lead/Contacted/Proposal column → click **Convert →** → it disappears from leads and appears as a **client** in the Client column; the lead row is now `won` with `converted_client_id` set. Convert is idempotent (re-running returns the same client).
2. Move a client via the stage selector → it shifts columns (Client → Project Work → Revenue → Review → Archived).
3. Open a client → add a contact and log a communication → both appear in the client detail.
4. Add a task (priority/due) → toggle done.
5. Add an invoice → set status to **paid** (paid date auto-set) → delete one.
6. Revenue tab shows monthly totals; Dashboard shows correct counts.
7. Auth: `curl -i .../api/os/business/convert -X POST` logged out → 401; non-owner → 403.

## Scope notes / deferred (by request)
- **Offers/proposals, follow-ups, revenue entry** are shown read-only (follow-ups in Dashboard; revenue in Revenue tab). Their create/edit UI + routes are a small later addition — the tables and types already exist.
- **Testimonials & deliverables** remain deferred (schema documented in the Chunk 1 migration).
- No Jarvis, agents, n8n, exports, or Obsidian.

## Files added/changed this chunk
- Added: `app/api/os/business/{convert,clients,tasks,contacts,communications,invoices}/route.ts`
- Changed: `app/api/os/leads/route.ts` (added PATCH), `components/command/panels/BusinessPanel.tsx` (rebuild), `lib/os/summary.ts` (business/finance wiring)
