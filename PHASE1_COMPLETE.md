# Forgeonix OS — Phase 1 Complete (Command Center Foundation)

This documents the Phase 1 build: the security fix plus the full command-center
foundation. Agents, Jarvis, Obsidian, and n8n were intentionally **not** built —
only placeholder hooks where the 9-card structure required them.

## ⚠️ You must do two things for this to work

1. **Apply the new database migration** (creates the 4 foundation tables):
   - Open Supabase → SQL Editor, and run the contents of
     `supabase/migrations/20260620120000_command_core.sql`
     (or `supabase db push` if you use the CLI).
2. **Set your owner password** by signing up once at `/signup` with
   `itsallethan@gmail.com`. The password is stored/hashed by Supabase Auth — it is
   **not** in the code or env. The gate only checks your email
   (`FORGEONIX_OWNER_EMAIL` in `.env.local`).

---

## 1. Security fix (the critical one)

Before: `/command` and every `/api/os/*`, `/api/career/*`, `/api/ai/chat` route were
fully public. The OS APIs use the Supabase **service role** (bypasses RLS), so your
leads, revenue, clients, and infra were readable by anyone — and Liftboard has public
signup, so "logged in" was never enough.

Now: **owner-only**, enforced in three layers.

- `lib/auth/owner.ts` — `requireOwnerPage()` (redirect) and `requireOwnerApi()` (401/403).
- `proxy.ts` — Next 16's renamed middleware (was `middleware.ts`); optimistic gate.
- `lib/supabase/client.ts` — switched to cookie-based `createBrowserClient` so the
  server/proxy can actually see your session. **You'll need to log in once more.**
- Every protected route handler now rejects non-owners before touching data.

## 2. New database tables (`module_status`, `notifications`, `command_logs`, `command_tasks`)

Migration `20260620120000_command_core.sql`. RLS on, service-role only. Seeds the 9
modules + starter notifications/logs.

## 3. New data layer + API routes (all owner-gated)

- `lib/os/command-core.ts`, `types/command-core.ts`
- `GET /api/os/modules`, `GET|PATCH /api/os/notifications`, `GET|POST /api/os/logs`,
  `GET|POST|PATCH /api/os/tasks`, `GET /api/os/search`

## 4. Phase 1 UI

- `components/command/NotificationCenter.tsx` — bell + unread badge + feed (header).
- `components/command/GlobalSearch.tsx` — cross-module search (header).
- `components/command/QuickActionsPanel.tsx` — add task/lead/note + open task list (rail).

## 5. 9-card structure (was 6)

Cards are now read from `module_status` (no hardcoded list). Leads folded into
**Forgeonix Business**. The 9: Infrastructure, Forgeonix Business, Liftboard, Career,
Projects, AI Memory, Automations, Finance, Health & Fitness.

- Geometry generalized to 9 evenly-spaced ring slots (`hubGeometry.ts`, `types/command.ts`).
- New panels: `ProjectsPanel`, `FinancePanel`, `AiMemoryPanel` (real); `AutomationsPanel`,
  `HealthPanel` (placeholder hooks — Phase 9 / future).
- `summary.ts`, `modulePanelRegistry.ts`, `ModuleIcon.tsx` updated to the 9 keys.

## 6. Fake HUD data replaced or labelled

- **Real now:** terminal feed (reads `command_logs`), the bridge clock (live UTC),
  the NODES count (online/total from `module_status`).
- **Labelled "(sim)" / "· SIM":** core uptime/load, CPU/MEM/NET, the Health/Resources/
  Telemetry bridge panels.
- **Removed:** fabricated per-module load % and sparklines (`moduleMeta.ts` emptied;
  reappears automatically when real telemetry exists).

---

## Verification checklist (run in Cursor — I couldn't build in my sandbox)

```bash
npm run lint
npm run build
```

Then, with the dev server running:

1. **Logged out** → visit `/command` → should redirect to `/login`.
2. **Logged out** → `curl -i http://localhost:3000/api/os/summary` → `401`.
3. **A non-owner Liftboard account** → `/command` → redirect to `/`; `/api/os/summary` → `403`.
4. **As `itsallethan@gmail.com`** → `/command` loads, 9 cards render, notifications/search/
   quick-actions work, terminal shows DB logs.

If the build flags anything, paste it back and I'll fix immediately.

## Not built on purpose (later phases)

Agents (7), Obsidian (8), n8n automation engine (9), Jarvis (10). The Automations and
Health cards are placeholders only. The AI chat remains answer-only (no tool-calling).
