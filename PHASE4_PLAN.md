# Phase 4 — Business OS v2 (implementation plan, no code)

Goal: turn Forgeonix Business from a simple client tracker into a real operational
CRM + revenue tracker, driving the full lifecycle:

```
Lead → Contacted → Proposal Sent → Client → Project Work → Revenue → Review/Testimonial → Archived
```

Out of scope (not this phase): Jarvis, agents, n8n workflows, AI exports, Obsidian sync.

---

## 1. Current state

**Tables (from `20260609150000_forgeonix_os_memory.sql`):**
- `leads` — name, company, email, phone, source, `status` (lead_status: new/contacted/qualified/proposal/won/lost/archived), notes, follow_up_date, priority, timestamps.
- `business_clients` — name, company, email, `status` (client_status: active/prospect/inactive/archived), notes.
- `business_tasks` — client_id, title, `status` (task_status: open/in_progress/done/cancelled), priority (int), due_date, notes.
- `business_follow_ups` — client_id, lead_id, title, due_date, `status` (follow_up_status: pending/done/skipped), notes.
- `business_offers` — client_id, title, amount, currency, `status` (offer_status: draft/sent/accepted/declined/expired), valid_until, notes.
- `business_revenue` — client_id, label, amount, currency, `status` (revenue_status: pending/received/cancelled), recorded_date, notes.
- `os_projects` — name, slug, description, status, stack, url, client_id, display_order.

**Code:** `lib/os/business.ts` (`fetchBusinessDashboard` → clients/tasks/followUps/offers/revenue/projects), `lib/os/leads.ts`; `GET /api/os/business`, `GET|POST /api/os/leads`; `BusinessPanel` (overview + leads + clients + projects + tasks + records).

**Limitations:** no contact records or communication history; no quote→invoice→payment chain (only flat offers + revenue); no project deliverables; no testimonials/reviews; no unified pipeline board; no monthly revenue rollups; tasks lack ownership and lead linkage; lead→client conversion is manual/implicit.

## 2. Desired state

A true operational hub: a **pipeline board** spanning lead → client → archived; **contact records + communication history**; **clients** with lifecycle stage, projects, deliverables, revenue, and testimonials; **tasks** with owner/priority/due dates linked to leads or clients; **follow-ups** with channel; **proposals (quotes) → invoices → revenue** chain with **monthly totals** and **project value**; **testimonials/reviews**; and a dashboard surfacing leads, clients, revenue, open tasks, follow-ups, and upcoming actions.

## 3. How existing tables are reused vs upgraded

| Table | Action | Changes |
|---|---|---|
| `leads` | **Reuse + upgrade** | add `owner`, `converted_client_id` (set on win), `last_contacted_at`, `estimated_value`. `lead_status` already models new→…→won/lost/archived — keep as the pre-client funnel. |
| `business_clients` | **Reuse + upgrade** | add `stage` (new `client_stage` enum: active, project_work, revenue, review, archived) for the post-win pipeline, `lead_id` (origin), `won_at`. Keep `status` for health (active/inactive/archived). |
| `business_tasks` | **Reuse + upgrade** | add `lead_id` (tasks on leads too), `owner`, `priority_level` (new enum low/medium/high; keep int `priority` for ordering). |
| `business_follow_ups` | **Reuse + upgrade** | add `owner`, `channel` (communication_channel enum). Otherwise as-is. |
| `business_offers` | **Reuse as Quotes/Proposals** | add `lead_id`, `project_id`, `sent_at`, `accepted_at`. Existing amount/currency/status/valid_until cover quotes. |
| `business_revenue` | **Reuse as received income** | add `invoice_id` link, `received_date` already ≈ recorded_date. Stays the record of actual money in. |
| `os_projects` | **Reuse + upgrade** | add `value` (numeric project value), `start_date`, `completed_at`. Deliverables via new table. |

## 4. Database changes — new migration `20260621160000_business_os_v2.sql`

Idempotent, RLS service-role-only, `set_os_updated_at()` triggers — same conventions as prior phases.

**New enums:** `client_stage` (active, project_work, revenue, review, archived), `priority_level` (low, medium, high), `communication_channel` (email, call, meeting, message, note, other), `communication_direction` (inbound, outbound), `invoice_status` (draft, sent, paid, overdue, void), `testimonial_status` (requested, received, published), `deliverable_status` (planned, in_progress, delivered, accepted).

**ALTERs:** the seven existing tables per the table above (`add column if not exists`).

**New tables:**
- `business_contacts` — id, client_id, lead_id, name, role, email, phone, notes, timestamps. (People behind a lead/client.)
- `business_communications` — id, client_id, lead_id, contact_id, channel, direction, subject, summary, occurred_at, owner, created_at. (Communication history log.)
- `business_invoices` — id, client_id, project_id, invoice_number, amount, currency, status (invoice_status), issued_date, due_date, paid_date, notes, timestamps. (AR / billing.)
- `business_testimonials` — id, client_id, project_id, author, role, quote, rating (1–5 check), status (testimonial_status), received_at, is_public, timestamps.
- `business_deliverables` — id, project_id, client_id, title, description, status (deliverable_status), due_date, delivered_at, notes, timestamps.

Indexes on all foreign keys + status columns. Seed: optionally link the existing Blackgate/Solea clients and projects, and backfill `clients.stage` from `status` (active→active, archived→archived).

## 5. Types — `types/forgeonix-os.ts` (extend) or new `types/business.ts`
Extend `Lead`, `BusinessClient`, `BusinessTask`, `BusinessFollowUp`, `BusinessOffer`, `OsProject` with the new fields; add `BusinessContact`, `BusinessCommunication`, `BusinessInvoice`, `BusinessTestimonial`, `BusinessDeliverable`; new enum const arrays; `Add*/Update*` inputs; a `BusinessDashboardV2` shape; and a `PipelineColumn`/`PipelineCard` type for the board.

## 6. Data layer — `lib/os/business.ts` (expand) + reuse `lib/os/leads.ts`
- `fetchBusinessDashboard()` → v2 (clients, leads, contacts, communications, tasks, followUps, offers, invoices, revenue, projects, deliverables, testimonials) + computed `pipeline`, `monthlyRevenue`, and `upcomingActions`.
- `buildPipeline()` — pure helper mapping leads (new→Lead, contacted/qualified→Contacted, proposal→Proposal Sent, lost/archived→out) and clients (stage → Client/Project Work/Revenue/Review/Archived) into the 8 ordered columns. (Pure module like `topology.ts` so the panel can reuse it client-side.)
- `convertLeadToClient(leadId)` — creates a `business_clients` row (stage=active), sets `leads.converted_client_id` + `won_at`, status→won.
- `monthlyRevenueTotals()` — group received revenue by month.
- CRUD for: clients, contacts, communications, tasks, follow-ups, offers, invoices, revenue, deliverables, testimonials, projects.

## 7. Owner-gated API routes (all `requireOwnerApi()`, under `/api/os/business/*` = proxy-gated)
- `GET /api/os/business` — dashboard v2 (incl. pipeline + monthly totals).
- `clients` (POST/PATCH/DELETE) + `clients/convert` (POST leadId → client).
- `contacts`, `communications`, `tasks`, `follow-ups`, `offers`, `invoices`, `revenue`, `deliverables`, `testimonials` — POST/PATCH/DELETE (PATCH/DELETE take id in body/query, matching the Phase 3 pattern).
- Leads stay on `/api/os/leads` (add `PATCH` for status/stage moves).

## 8. Business panel UI — `components/command/panels/BusinessPanel.tsx` (rebuild, tabbed)
- **Dashboard** — operational overview: leads, clients, revenue (received + pending + this month), open tasks, follow-ups due, upcoming actions.
- **Pipeline** — kanban board across the 8 stages; cards are leads (pre-win) and clients (post-win); move a card to advance stage; "Convert to client" on win.
- **Clients** — list + detail: contacts, communication history, projects, deliverables, revenue, testimonials.
- **Tasks** — owner, priority level, due date; filter by open/overdue.
- **Follow-ups** — due list with channel; mark done.
- **Proposals** — quotes (offers): amount, status, valid-until; mark sent/accepted.
- **Invoices** — issue/track: status, due/paid dates, overdue flag.
- **Revenue** — history + **monthly totals**; project value rollups.
- **Testimonials** — request/record/publish reviews.
(Reuses `ModuleHubShell` primitives; CRUD + status moves, consistent with the Infrastructure panel.)

Optional owner-gated pages (`/command/business/*`, like Phase 3): `/pipeline` (full board) and `/revenue` (monthly report). Default: build pipeline + revenue inside the panel first; add pages only if you want the larger views.

## 9. Summary wiring
`lib/os/summary.ts` — `business` module detail upgraded to: leads (open), clients (active), pipeline value, revenue this month, open tasks, follow-ups due. `finance` module can pull invoices/received totals.

## 10. Verification checklist (for build time)
- `npm run lint` + `npm run build`.
- Create a lead → move it through Contacted → Proposal Sent → Convert to Client → it appears under Clients with stage=active and a `converted_client_id` link.
- Add a contact + log a communication on a client → shows in client detail history.
- Create a quote (offer) → convert/issue an invoice → mark paid → a revenue record reflects it; monthly totals update.
- Add a project with `value`, add deliverables, mark delivered/accepted.
- Request and publish a testimonial.
- Dashboard shows correct counts; follow-ups due and upcoming actions populate.
- Auth: `curl -i .../api/os/business` logged out → 401; non-owner → 403.

## 11. Open choices (my defaults in **bold**)
- Pipeline model: **reuse leads + client `stage`** (one board, less disruptive) vs a single unified `deals` table.
- Billing: **quotes = `business_offers`, new `business_invoices`, `business_revenue` = received income** vs folding all into one table with a `type`.
- Detail pages: **panel-first**, optional `/command/business/{pipeline,revenue}` later.
- Task ownership: **text `owner` field** (single-owner OS today; future-proofs for collaborators).
