# UI — Chunk 8D: Cinematic Composition Pass (done)

A deliberate break from the subtle 8C texture work. This is a **first-glance** change:
darker room, dominant reactor light, recessed chrome, and a real cinematic frame around
the stage — so `/command` reads as a *dark command bridge powered by a reactor core*
rather than a neon dashboard. Visual-only, **static** (no new animation), CSS only.

## Files changed (2, CSS only)

- **`app/globals.css`** — darkened the environment and pulled back competing glow:
  - `.command-bg__vignette` — much deeper room vignette (`transparent 24% → rgba(0,0,0,0.86)`,
    tightened ellipse) so the bridge falls into darkness at the edges.
  - `.command-bg__radial` — center backdrop glow roughly halved (cyan `0.1→0.05`,
    purple `0.05→0.025`) so the **reactor**, not the backdrop, owns the center light.
  - `.command-bg::before` (aurora) opacity `0.85 → 0.40`.
  - `.command-bg::after` (energy conic) opacity `0.60 → 0.32`.
  - `.command-bg__scanlines` opacity `0.40 → 0.25` (less competing busyness).
- **`components/command/command-interactive.css`**:
  - `.command-stage__glow` — the reactor's light **bloom enlarged + intensified**
    (`min(360px,52vw) → min(660px,82vw)`; hotter inner, brighter falloff) so the core reads
    as the light source spilling into the dark room.
  - **New `.command-main::after`** — a cinematic scene frame over the stage area only:
    an edge **chamber vignette** (clear center, dark periphery) plus **top/bottom letterbox
    shadow bands**. `pointer-events:none`, transparent center → content stays readable and
    fully interactive. (Top nav + dock are siblings of `.command-main`, so they keep full
    brightness.)
  - **Chrome recession** — rail consoles (`.command-workspace__rail .command-hud-panel`) and
    stage-HUD sim panels (`.command-stage-hud__panel`) are dimmed + desaturated at rest
    (`saturate(0.72) brightness(0.85)`) and wake to full on hover/focus. Reduced-motion drops
    the wake transition.

## Before → after (the visual shift)

- **Before:** evenly-lit panels, cyan glow spread roughly equally across the whole canvas,
  a bright-ish backdrop — a polished but flat *dashboard*.
- **After:**
  - The **background is dark** and the edges fall away into the chamber.
  - The **reactor is clearly the brightest thing** and visibly lights its surroundings.
  - **Foreground / midground / background separate:** cinematic frame (front) → recessed
    rail + sim panels (mid) → dark chamber (back).
  - **Cyan is no longer everywhere** — secondary chrome desaturates and recedes; cyan is
    reserved for the reactor and whatever the operator is hovering/using.
  - **Letterbox bands + corner darkening** give scene framing and a larger sense of space,
    pulling the eye to the core as the focal point.

## Readable / not messy / not noisy

- The vignette is **edge-only** with a generous clear center; horizontal reach is wide
  (96%) so the side rails dim but stay legible, and they restore fully on hover/focus.
- **No new noise/grain overlays** (the single faint 8C grain is unchanged), **no new
  micro-labels**, no fake data, no new particles.

## Performance

- Entirely **static** — gradients, one extra pseudo-element (`.command-main::after`), and a
  static `filter` on a handful of chrome panels. **No new animation**, no new
  `backdrop-filter`/blur, no extra particle systems. Reduced-motion users get no transitions.

## Confirmation — no functionality changed

No schema, API, auth, routing, database, or business-logic changes; no new dependencies; **no
`.tsx` changes** this chunk (two CSS files only). All clicks, selection, expansion, panels,
nav, dock, and data behavior are unchanged; the cinematic frame is `pointer-events:none`.

## Verification

- Run `npm run lint` && `npm run build`.
- Open `/command`: it should immediately feel **darker, deeper, and reactor-driven** — the
  core glowing into a dark chamber, rail/sim panels sitting back in shadow until touched, and
  a letterboxed cinematic frame around the stage. Center content stays crisp and clickable.

## Revert

`globals.css`: restore the four opacity values + the two radial gradients. `command-interactive.css`:
restore `.command-stage__glow` size/colors and delete the `Chunk 8D` block
(`.command-main::after`, the chrome-recession rules, and their reduced-motion guard).
