# UI Polish — Chunk 3: Reactor core + core↔node conduits (done)

Visual only, **CSS-only**, building on Chunks 1–2. No schema / API / auth / business-logic
changes, no new dependencies, no markup/JS changes. Independently revertible.

## Files changed (2, both CSS)
- **`app/globals.css`** — `.command-core__sphere` now has a gentle energy pulse
  (`command-core-energy`, opacity + scale) so the core reads as a living power source
  rather than a static disc. (New keyframe added; the existing Chunk‑1 reduced-motion
  block already lists `.command-core__sphere`, so it's covered.)
- **`components/command/command-interactive.css`**
  - `.command-connection__stream` — added a flowing animation (`command-stream-flow` via
    `stroke-dashoffset`) so the conduits between the core and each node look like energy
    traveling along them.
  - `.command-connection--active .command-connection__stream` — brighter + faster flow
    (`animation-duration: 0.85s`) so a selected/hovered module's conduit visibly "charges."
  - Bumped the generic active brightening (0.55→0.65 opacity, 0.18→0.22 width) so it's
    clearly visible.
  - **Removed the stale per-module-id brightening block** (it referenced removed modules
    `leads`/`ai-ops` and only covered the old 6); activation is now uniform across all 9
    modules via the generic `--active` rule.
  - Added `.command-connection__stream` to the reduced-motion guard.

## Why no component changes were needed
The "energy conduit" and "activate on hover/select" infrastructure already exists:
`ConnectionLines.tsx` draws per-module conduit `<g>`s with flowing particle circles and
applies generic `--active`/`--hovered` classes (driven by the existing
`selectedModuleId`/`hoveredModuleId` state in `CommandStage`). Module cards already have
`--selected`/`--expanded` glow states. So Chunk 3 enriched those existing systems via CSS
instead of adding redundant components. `CoreReactor`/`ReactorChamber` remain orphaned and
`CommandCenterBackground` (public site) remain untouched.

## Performance choices
- All new motion is `transform`/`opacity` (sphere) or thin-line `stroke-dashoffset`
  (conduits) — GPU/compositor friendly. No `filter: blur` added, no backdrop-filter, no
  blur stacks (the only filter is the pre-existing tiny SVG line-glow on active conduits).
- No layout-shifting animation; durations kept slow (1.6s conduits, 4.6s core).
- `prefers-reduced-motion: reduce` → core sphere pulse and conduit flow both stop (static
  layered look remains). Particle/stage-glow already guarded.
- Boot sequence untouched — not made heavier.

## Explicit confirmation
No functional logic, schema, auth, API, Supabase/database behavior, routing, data fetching,
or card click behavior was modified. Only two CSS files changed. No `.ts`/`.tsx` touched.

## Verification
- CSS-only → no type surface changed. Run `npm run lint` && `npm run build`.
- Open `/command`: the core sphere should softly pulse; conduits between the core and the
  nodes should show energy flowing; selecting/hovering a module brightens that module's
  conduit while others dim — uniformly for all 9 modules now.
- Toggle OS reduce-motion → core pulse and conduit flow stop; everything stays legible.

## Revert
Remove the `command-core-energy` animation + keyframe in `globals.css`, and in
`command-interactive.css` revert the `__stream` animation/keyframe, the `--active`
tweaks, restore (or leave removed) the per-id block, and drop `__stream` from the
reduced-motion list.
