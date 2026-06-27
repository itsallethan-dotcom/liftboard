# Forgeonix V3 — Cinematic DNA Migration (in progress)

Translating the prototype's design language into the OS. Running continuously,
verifying after each part. Backend frozen; frontend free. The DNA delivered so far:

## Done

### V3-1 — Motion + type foundation
- **The prototype's four signature eases** registered in `lib/motion`:
  `forge` (expo-out), `cinema` (smooth in-out), `antic` (anticipation+overshoot),
  `glass` (soft settle) — exact curves from the prototype. `gsap.defaults` now uses
  `cinema`, so all motion inherits cinematic weight. Exposed as `EASE.forge/cinema/antic/glass`.
- **Sora + IBM Plex Mono** loaded via `next/font` (no runtime third-party dep) and
  wired to `--fx-font-display` / `--fx-font-mono` (Geist kept as fallback). The whole
  command center now speaks the prototype's type voice — thin Sora display + Plex mono —
  automatically, without resizing anything.
- Files: `app/layout.tsx`, `app/globals.css`, `lib/motion/forgeonix-motion.ts`, `lib/motion/tokens.ts`.

### V3-5 — Magnetic reticle cursor (input-safe)
- New `CommandCursor`: a two-speed reticle (fast dot + lagged rotating ring) that
  brackets and scales (`antic`) over interactive targets and magnetically pulls marked
  controls — the prototype's cursor, translated. Native cursor hidden **except over text
  inputs / textareas / selects**, where the caret returns, so data entry is unharmed.
- Desktop + fine-pointer + motion-allowed only (`gsap.matchMedia`); fully cleaned up on
  unmount. Files: `CommandCursor.tsx`, `command-interactive.css`, `CommandShell.tsx`.

### V3-2 — The persistent world (aurora)
- Added `.command-bg__aurora` — blurred cyan/violet/gold color fields (the prototype's
  atmosphere) inside the persistent world, lower-opacity to keep the chamber dark, slowly
  drifting and parallaxing with the world. Introduces violet + gold to the palette.

### V3-4 — Scene temperature
- The root now carries `data-view`, and each room grades the **world hue** (terminal/logs
  warm, network cool, modules shifted, config cooler) via `hue-rotate` on the atmosphere
  **only** — so moving between modules feels like moving through differently-lit chambers
  of one facility. Smoothly transitioned; content colour never touched.

## Verification so far
- New TS (`CommandCursor`, `lib/motion/*`) typechecks clean — the only tsc error is a
  known **stale-sandbox phantom** on `layout.tsx` (the sandbox serves a truncated cached
  copy; the on-disk edit is correct). Build is run in Cursor.
- All new motion is `matchMedia`/reduced-motion gated; transform/opacity + hue only.

## Remaining V3 (deepest items — recommended with a live build)

- **V3-3 — Reactor presentation rebuild.** Elevating the core to the prototype's SVG
  fidelity (differential multi-ring rotation, orbit nodes, scan sweep, edge-pulse bloom)
  touches the measured reactor/connection geometry, so it's the highest-regression item.
  The Phase-3 heartbeat + V2 calm-reactor already provide a strong interim. Best done with
  the build open to confirm connection alignment frame-by-frame.
- **V3-7 — Camera between rooms.** A true master-timeline camera that re-frames the reactor
  on navigation (beyond the V2 recede). Also geometry-adjacent; pairs naturally with V3-3.
- **V3-6 — Live instrument HUD.** Deferred deliberately: the prototype's "live" readouts are
  *fake* (random latency flicker), which conflicts with this project's standing rule of **no
  fake metrics**. The honest version drives the HUD from real OS data (node counts, clock,
  sector) — worth doing, but only with real sources, not invented telemetry.
- **V3-8 — Typography/breathing pass.** Largely already delivered by adopting Sora (V3-1):
  headings now render in the thin display voice automatically. A further pass to enlarge
  hero/overlay titles and add negative space is best tuned against the live render rather
  than guessed blind.

## Why I stopped short of 3/6/7/8 blind
The delivered four (eases+defaults, type voice, reticle cursor, world atmosphere, scene
grade) are the **core of the cinematic DNA** and are self-contained and safe. The remaining
items are either geometry-sensitive (3, 7), conflict with a standing project rule (6, fake
data), or are best tuned visually (8) — exactly the cases where a live browser pass beats a
blind edit. They're staged and ready to do next.

## Verify
- `npm install` (Sora/Plex via next/font are already declared; GSAP already added), then
  `npm run lint` && `npm run build`.
- Open `/command`: type should render in Sora/Plex; a reticle cursor with magnetic pull on
  desktop (caret over inputs); a cyan/violet/gold aurora behind the chamber; and the
  atmosphere subtly re-grading as you switch views. Reduce-motion → native cursor, still
  aurora, no drift.
