# AI Memory — Export Architecture (Supabase as source of truth)

Status: **design / recommendation only — not built.** Obsidian integration is paused.

## Core principle: one source of truth, one-way exports

Forgeonix OS + Supabase is the **canonical, authoritative store**. Everything
else — Obsidian, Markdown files, JSON dumps, zip snapshots — is a **derived
projection** generated *from* Supabase. Data flows one direction only:

```
Supabase (canonical) ──exports──▶ Markdown / JSON / Snapshot ──▶ Obsidian (optional reader)
```

We deliberately do **not** build a two-way sync. Bidirectional sync forces you to
solve merge conflicts, last-writer-wins, and "which copy is right?" — exactly the
problems that make Obsidian-as-companion fragile. By making export one-directional,
Obsidian becomes a disposable, regenerable view: if it drifts, you re-export and
overwrite. Nothing is lost because the DB is always right.

Obsidian's role drops from "required companion system" to "optional offline/visual
reader and backup destination." You can delete the vault and lose nothing.

## The three export artifacts

### 1. Markdown bundle (human-readable, Obsidian-friendly)
- One `.md` file per `memory_item`, named `{slug-of-title}--{short-id}.md` (id suffix
  prevents collisions and gives a stable handle).
- Folder layout mirrors the category tree: `Infrastructure/Homelab/...md`. Uncategorized
  items go under `_Inbox/`.
- Each file carries **YAML frontmatter** for the structured fields, with the prose
  `content` as the body. Relationships render as an Obsidian `## Related` section using
  `[[wikilinks]]` plus a machine-readable `related:` block in frontmatter.
- Plus generated index/MOC files: a top-level `README.md`, and one index per category.

```markdown
---
id: 7f3a...           # canonical Supabase id (stable handle)
title: Homelab stack
type: reference
category: Infrastructure/Homelab
module: infrastructure
importance: 4
confidence: 5
source: manual
tags: [homelab, proxmox]
status: active
created_at: 2026-06-21T...
updated_at: 2026-06-21T...
related:
  - to: 9b1c...
    type: depends_on
---

Homelab runs Proxmox, a Docker VM, Home Assistant, n8n, AdGuard, Homepage,
and Uptime Kuma.

## Related
- [[n8n-intentionally-delayed--9b1c]] (depends_on)
```

This is what an Obsidian vault would consume. It's lossy by design (see the table
below) — it's a *reading view*, not a backup.

### 2. JSON export (lossless, machine-portable)
- Full-fidelity dump of `memory_items`, `memory_categories`, `memory_relationships`
  — every column, every id, every edge — plus a `schema_version` and `exported_at`.
- This is the **real backup**: it can rebuild the relational state exactly (a future
  import route would upsert by `id`). Markdown cannot do this faithfully because graph
  edges and numeric signals degrade into text.

```json
{
  "schema_version": "ai_memory.v1",
  "exported_at": "2026-06-21T...",
  "categories": [ ... ],
  "items": [ ... ],
  "relationships": [ ... ]
}
```

### 3. Backup snapshot (point-in-time archive)
- A timestamped `.zip` containing **both** the JSON export (for restore) and the
  Markdown bundle (for human browsing), plus a `manifest.json` (counts, checksum,
  schema version).
- Naming: `forgeonix-memory-snapshot-YYYYMMDD-HHmm.zip`.
- This is what you'd download periodically or schedule. JSON = recoverability,
  Markdown = readability, manifest = integrity check.

## Recommendation: relational in Supabase vs. exportable to Markdown

The rule of thumb: **anything you query, filter, join, or aggregate stays relational;
anything you read as prose gets projected to Markdown as a copy.**

| Data | Canonical home | In Markdown? | Why |
|---|---|---|---|
| Memory prose (`title`, `content`) | Supabase | ✅ as the body | The one thing Markdown is genuinely good at |
| `type`, `source` | Supabase | ✅ frontmatter (copy) | Queried for filtering; mirrored as metadata |
| `importance`, `confidence` (1–5) | Supabase | ✅ frontmatter (copy) | Live ranking signals — must stay numeric/queryable |
| `category` (tree) | Supabase | ✅ folders + frontmatter | Hierarchy/joins live in DB; folders are a view |
| `module_key` links | Supabase | ✅ frontmatter (copy) | Cross-module joins must be relational |
| `tags` | Supabase (`text[]`) | ✅ frontmatter array | Queryable in DB; convenient in Obsidian |
| `status` (active/archived) | Supabase | ⚠️ frontmatter only | Archival logic is relational; MD just records it |
| **`memory_relationships` (graph edges)** | **Supabase** | ⚠️ wikilinks (lossy copy) | A typed, directional graph — degrades badly in flat files; keep authoritative in DB |
| ids / timestamps / FKs | Supabase | ✅ frontmatter (read-only) | Identity & integrity are relational concerns |
| Dashboard reads, search, counts | Supabase | ❌ never | These need SQL, not files |

**What should never become Markdown-primary:** the relationship graph, the
importance/confidence signals as live values, status/archival, and anything the
`/command` dashboard reads. Those are relational by nature; Markdown copies of them
are read-only conveniences that get regenerated on every export.

**What is genuinely well-suited to Markdown:** the human-written `content` of each
memory, browsable by category folders, with related links — i.e. a knowledge-vault
*view* you can read offline or in Obsidian.

## Proposed implementation outline (when you're ready — not built)

- `lib/os/memory-export.ts` — `buildJsonExport()`, `buildMarkdownBundle()` (returns a
  map of path→contents), `buildSnapshotZip()`. Pure functions over the data layer.
- `GET /api/os/memory/export?format=json|md|zip` — owner-gated; streams a downloadable
  file (`Content-Disposition: attachment`). `md`/`zip` assembled server-side.
- AI Memory panel — an "Export ▾" control (JSON / Markdown / Snapshot) that hits the route.
- Optional: a scheduled task that writes a snapshot on a cadence (weekly), using the
  existing scheduler — purely additive, still one-directional.
- Future (separate, explicitly deferred): a JSON **import/restore** route that upserts
  by `id` — this is the only thing that would ever write back, and it's a restore, not a sync.

## Why this satisfies the goal

- Supabase stays canonical; nothing depends on Obsidian.
- Obsidian becomes optional: a vault you can generate, regenerate, or discard.
- You get real backups (JSON + snapshot) independent of any third-party app.
- No conflict-resolution complexity, because exports never flow back as live sync.

## Open choices (my defaults in **bold**)
- Markdown granularity: **one file per memory** vs one file per category. (Per-memory
  gives clean Obsidian wikilinks.)
- Snapshot delivery: **on-demand download** now; scheduled write later.
- Restore: **deferred** until you actually need it.
