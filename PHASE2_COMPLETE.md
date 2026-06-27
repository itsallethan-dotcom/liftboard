# Forgeonix OS — Phase 2 Complete (AI Memory)

Structured second-brain for Forgeonix OS. AI Memory is now the primary knowledge
system; Notes and Records remain as secondary legacy sections. No embeddings, AI
summaries, agents, Jarvis, n8n, or Obsidian were built (deferred).

## ⚠️ Apply the migration first

Run `supabase/migrations/20260621120000_ai_memory.sql` in the Supabase SQL editor
(or `supabase db push`). It creates `memory_categories`, `memory_items`,
`memory_relationships`, seeds the category tree, and adds 7 starter memories.

## What was built

**Migration** `20260621120000_ai_memory.sql`
- Enums `memory_type`, `memory_status`; 3 tables; FTS + tag GIN indexes; updated_at
  triggers; RLS service-role-only. `importance`/`confidence` are smallint 1–5 with CHECK.
- Seeds: Infrastructure/Business/Career/Fitness/Personal category trees + 7 starter
  memories (Solea Nails → `module_key = business` per your tweak).

**Types** `types/memory.ts` — items, categories, relationships, enums, I/O types.

**Data layer** `lib/os/memory.ts` — categories, item CRUD (soft-delete = archive,
`hard=true` to purge), search (ilike over title/content), relationships, dashboard + stats.

**API routes** (all owner-gated):
- `GET|POST /api/os/memory` (GET with no filters returns the dashboard; supports
  `?category=&module=&q=&status=`)
- `PATCH|DELETE /api/os/memory/[id]` (DELETE archives; `?hard=true` purges)
- `GET|POST /api/os/memory/categories`
- `GET ?itemId= | POST | DELETE ?id= /api/os/memory/relationships`

**AI Memory panel** `components/command/panels/AiMemoryPanel.tsx`
- Search + category filter, item list with type/category/module/importance·confidence
  badges and tags, pin toggle, add/edit/delete (archive) forms with all fields
  (title, content, category, linked module, type, source, importance 1–5, confidence
  1–5, tags, pinned). Notes & Records dropped to "Legacy" sections.

**Summary + search wiring**
- `lib/os/summary.ts` — `ai-memory` module detail now shows Memories / High Importance /
  Categories (plus Notes/Records counts).
- `lib/os/command-core.ts` — global search now includes `memory_items` (type `memory`),
  and `GlobalSearch` labels them "Memory".

## Verification checklist (run in Cursor — I can't build in my sandbox)

```bash
npm run lint
npm run build
```

Then, signed in as the owner, open AI Memory on `/command`:

1. The 7 starter memories load; Overview shows counts.
2. Add a memory (set category, module, importance/confidence) → it appears.
3. Edit it (✎) → change persists. Pin it (☆/★) → sorts to top.
4. Filter by category and type in the search box → list narrows.
5. Archive one (✕) → it disappears from the active list.
6. Global search (header) for a memory term → result tagged "Memory".
7. Delete-as-archive is default; confirm it didn't hard-delete (row still in DB with
   status `archived`).

API auth spot-check: `curl -i .../api/os/memory` while logged out → `401`.

## Notes / decisions

- `memory_relationships` table + API are in place for item↔item links; the panel UI
  currently focuses on the module-link field you prioritized. Wiring relationship UI
  into the panel is a small follow-up if you want it.
- Deferred (commented in the migration): pgvector embeddings, agent writes, AI summaries.
