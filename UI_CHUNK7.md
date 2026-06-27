# UI Polish — Chunk 7: Performance + cleanup audit (done)

Audit and optimization of Chunks 1–6. Visual design preserved; no new features (only fixes).
No schema / API / auth / routing / data-fetching / business-logic changes, no new
dependencies. Independently revertible.

## Changes made (3 files)
1. **`components/command/CommandParticles.tsx`** — particle engine init is now **deferred
   ~1200ms** (a single setTimeout) so `loadSlim` + the canvas don't initialize during the
   boot sequence. Media-query changes after that still apply immediately. (Particles were
   already capped at 45, fps 30, desktop-only, non-interactive, reduced-motion off.)
2. **`app/globals.css`** — **removed a stale dead-CSS block**: `.command-connection__line`,
   `__pulse`, `__node`, `__core-node`, the `command-line-pulse` keyframe, the
   `.command-module__connector` hover rule, and the old per-module-id hover selectors that
   referenced **removed modules** (`leads`, `ai-ops`). Confirmed via repo-wide grep that
   none of these classes are rendered (live conduits use `__stream`/`__particle`).
3. **`components/command/command-interactive.css`** — the ambient HUD **tags now also hide
   on mobile** (≤767px), alongside the edge rails, to reduce small-screen clutter.

## Audit results (review checklist)
- **Boot lag** — Fixed: particles deferred; nothing else runs heavy work during boot. The
  boot timer (run-once) and overlay are unchanged; no audio in the boot path.
- **Particle load** — Capped (45 / fps 30 / desktop-only / non-interactive) and now lazy-init.
- **Always-running animations** — Idle screen is intentionally light: slow ambient loops only
  (aurora 26s, energy 90s, grid 60s, halo 6s, sphere 4.6s, stage glow 4s, conduit flow). Card
  scanline/power effects are hover/selected-triggered, not always-on. No counters anywhere.
- **Stacked shadows/glows** — Checked; layered shadows are static (no per-frame animation) and
  limited to the active/selected element. No change needed.
- **backdrop-filter** — The only backdrop blurs are pre-existing (nav, hud panel, and the
  module card body). Left **as-is to preserve the current glass design** (not stacked; not
  part of Chunks 1–6).
- **Mobile readability** — Particles off on mobile; HUD rails + tags now hidden on mobile;
  card text/layout unchanged.
- **prefers-reduced-motion** — Verified full coverage: background (grid/aurora/energy/radial/
  scanlines), core (halo/sphere/rings), conduits (stream/particle), stage glow, card scanline/
  power line, HUD dot blink, and panel reveal/sweep are all disabled under reduce-motion.
- **CSS duplication / stale selectors** — Removed the dead connection block (above). The
  earlier stale per-id connection block was already removed in Chunk 3.
- **Selectors referencing removed modules** — None remain (the `leads`/`ai-ops` references were
  in the removed block).
- **`:has()` safety** — All `:has()` rules are progressive enhancements (active-card dimming,
  connection emphasis). On any engine without `:has()` they simply don't apply; base styling
  and all functionality remain intact.
- **Decorative overlays** — `CommandHudOverlay` is `aria-hidden` + `pointer-events:none`;
  `CommandParticles` canvas is `pointer-events:none`; core decorative layers are `aria-hidden`.
- **Fake metrics** — None. HUD chrome is status words only (no numbers/values); real metrics
  (dock NODES, labelled SIM values) untouched.

## Performance summary
- Startup is lighter (deferred particles), idle cost reduced (less dead CSS to match), and
  mobile is cleaner. Visual feel of Chunks 1–6 is preserved.

## Explicit confirmation
No functional logic, schema, auth, API, routing, database behavior, or data fetching was
modified. The only TSX change is a render-timing `setTimeout` for a decorative particle layer;
the other two changes are CSS. Layout and behavior are unchanged.

## Verification
- Run `npm run lint` && `npm run build` (changes are CSS removal + one setTimeout + a CSS
  media-query edit — no new type surface).
- Open `/command`: boot should feel snappy; particles fade in shortly after; idle screen is
  calm; selecting a module still powers on the panel; mobile shows no HUD tag/rail clutter.
- Toggle reduce-motion → all nonessential motion stops.

## Revert
Revert the `setTimeout` defer in `CommandParticles.tsx`; restore the removed block in
`globals.css` (or leave removed); and drop `.command-hud-tag` from the mobile media query.
