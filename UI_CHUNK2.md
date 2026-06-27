# UI Polish — Chunk 2: Command atmosphere depth (done)

Visual only, **CSS-only**, building on Chunk 1. No schema / API / auth / business-logic
changes, no new dependencies, no new modules, no markup/JS changes. Independently
revertible (delete the added CSS block + one animation line).

## File changed
- **`app/globals.css`** (command section only):
  - `.command-bg__grid` — added a slow `command-grid-drift` (60s) so the grid feels alive
    (parallax-style depth via background-position; no layout change).
  - `.command-bg::before` — **aurora**: two large, low-opacity cyan/purple radial glows that
    gently drift (`command-aurora-drift`, transform + opacity).
  - `.command-bg::after` — **energy sweep**: a very faint conic gradient masked to a centered
    fade, slowly rotating (`command-energy-rotate`, transform only).
  - New keyframes for the three effects.
  - `prefers-reduced-motion: reduce` block disables all three (the layered glows remain as a
    clean static look).

## Why CSS-only / why not the listed components
The command-center background is the `.command-bg` layer rendered by `CommandShell` +
styled in `globals.css`. The files listed for inspection are not the command-center
background: `CommandCenterBackground.tsx` is the **public marketing site** background
(SiteLayout/HeroSection), and `CoreReactor`/`ReactorChamber` are orphaned (the live core is
`CoreNode`, already enhanced in Chunk 1). Touching those would either change the public site
or duplicate the core — so this chunk added depth purely through `.command-bg` pseudo-layers,
leaving all components untouched.

## Performance choices
- All new motion uses **transform/opacity** (aurora, energy) or a single slow
  `background-position` shift (grid) — no `filter: blur`, no backdrop-filter, no blur stacks.
- Long durations (26s / 60s / 90s) → near-idle CPU/GPU; faint opacities to avoid overdraw.
- Three new full-bleed layers total, all `pointer-events: none`, all behind content (z 0).
- Existing Chunk-1 particle field is unchanged (still capped, desktop-only, reduced-motion off).
- Reduced-motion = static layered glow (still looks good, no animation).
- Boot sequence untouched — not made heavier.

## Verification
- CSS-only, so no TypeScript surface changed. Run `npm run lint` && `npm run build` to confirm.
- Open `/command`: background should feel deeper — drifting grid, soft drifting aurora glow,
  a slow ambient energy sweep around the core. Core (Chunk 1) and all panels/cards unchanged.
- Toggle OS reduce-motion → animations stop; layered glow remains static and clean.
- Confirm no functional logic changed (no TS/TSX files touched this chunk).

## Revert
Remove the `command-grid-drift` line on `.command-bg__grid` and the
"Command atmosphere depth (UI Chunk 2)" block. Nothing else depends on it.
