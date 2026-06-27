# Visual Overhaul — Phase 2: Depth & Parallax Environment (done)

The first phase with GSAP-driven motion. Introduces a subtle two-plane cursor
parallax so the command center reads as a **window onto a chamber** instead of a
flat poster — the start of "sense of place." Transform-only, desktop + motion-
allowed only, no data/layout/behavior change.

## How it works

A new decorative driver, **`CommandParallax`**, listens to pointer movement and
drives two depth planes with GSAP `quickTo` (smooth, interruptible, GPU-friendly):

- **Background plane** — `.command-bg` drifts slowly (±6px) with a slight overscan
  (`scale 1.06`) so the drift never reveals an edge.
- **Midground plane** — the whole `.command-stage` drifts faster (±14px).

Because the background trails the midground, the eye reads depth. The two
amplitudes are deliberately small — a depth cue, never seasick.

**Why move the entire stage (not just the reactor):** the stage measures its own
geometry and the connection lines are computed *relative to the stage*. Moving the
core, module nodes, and connections together as one uniform transform keeps them
perfectly aligned at every frame — the parallax offset cancels out of the anchor
math, so nothing drifts or misaligns.

## Files changed

- **`components/command/CommandParallax.tsx`** *(new)* — the GSAP parallax driver.
  Gated by `gsap.matchMedia` to `(min-width: 1024px) and (pointer: fine) and
  (prefers-reduced-motion: no-preference)` — so touch devices and reduced-motion
  users get a completely static scene. Auto-reverts on unmount (clears all inline
  transforms) and removes its pointer listener.
- **`components/command/CommandShell.tsx`** — mounts `<CommandParallax />` (a
  non-layout `display:contents` node) just after the background layer. One import +
  one element; no logic, props, or data flow touched.
- **`components/command/command-interactive.css`** — a small Phase 2 block adding
  `will-change: transform` to the two planes **only** on desktop + fine pointer, so
  they get their own compositor layers and the drift stays at 60fps.

## Performance & accessibility

- **Transform-only** (`x`, `y`, `scale`) → GPU-composited, no layout, no repaint of
  content. `quickTo` reuses a single tween per axis (no per-frame tween creation).
- **60fps:** two promoted layers, tiny amplitudes, eased smoothing.
- **Reduced motion:** the entire effect is inside a `matchMedia` query that requires
  `prefers-reduced-motion: no-preference`; those users never get the listener and
  the scene stays still.
- **Mobile/touch:** excluded by the `pointer: fine` + `min-width` query.

## Confirmation — nothing functional changed

No business logic, Supabase, API, route, module, or component-contract change. The
parallax is purely decorative and pointer-driven; the reactor, nodes, connection
lines, panels, nav, and dock all behave and align exactly as before. The only new
runtime behavior is a cosmetic transform on two existing containers.

## Verification

- `npm install` (GSAP) if not already done, then `npm run lint` && `npm run build`.
- On a desktop with a mouse, open `/command` and move the cursor: the chamber should
  drift gently in two layers — backdrop slow, reactor/stage a touch faster — giving
  real depth. Selecting/hovering modules still snaps connections correctly.
- With OS "reduce motion" on (or on a touch device), the scene is static — confirming
  the gate.

## Next

Phase 3 — Reactor as living heart + environment lighting: rebuild the core as the
dominant, breathing focal object with pulse-driven ambient light and travelling
light sweeps (migrating the relevant `command-*` keyframes into GSAP timelines).
