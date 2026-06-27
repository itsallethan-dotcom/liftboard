# Visual Overhaul — Phase 4: Cards → Instrument Bays (done)

Makes the nine module cards read as distinct **instrument bays** with spatial
hierarchy and a physical activation feel — without disturbing the stage geometry
that the connection lines depend on. Transform/opacity (+ a couple of state
colours) only, reduced-motion aware, no data/layout/behavior change.

## The constraint that shaped this phase

The orbiting cards are not free-floating decoration: the connection lines are
measured from each card's bounding box, and the **selected** card already uses a
`transform` on its body (`translateY(-2px)`). So a GSAP body-lift would (a) shift
the connection anchors and (b) collide with the selected-state transform. The
phase is designed around that: hierarchy/identity are done in CSS (no transforms
that move anything), and the GSAP "weight" is applied to a **conflict-free** target.

## What changed & why

**Spatial hierarchy (CSS).** When a bay is selected, the resting bays now recede
into the chamber (`opacity 0.6`, slight desaturate/dim) unless hovered or focused.
Importance becomes spatial — the active bay stands forward, the rest step back —
which is exactly the "kill the nine identical democratic cards" fix.

**Per-status identity (CSS).** Each resting bay gets a status-coloured top edge so
the nine are no longer identical *and* their state reads at a glance: online =
cyan, standby = steel, dev = amber, offline = grey (and offline sits slightly
dimmer). The selected bay keeps its full cyan frame. This differentiation is
data-driven (reads the existing status class via `:has()`), so it also communicates
state — two of the five animation purposes at once.

**Activation feel (GSAP).** A new delegated driver, **`CommandCardMotion`**, gives
each bay physical weight through its icon badge (`.command-module__icon-wrap`):
hover = a weighted scale-up with overshoot; press = a quick anticipation dip;
release = an overshoot settle. The icon badge has **no CSS transform state**, so
this never collides with the card's selected/expanded transforms and never touches
the connection geometry. Event delegation on the stage means it survives re-renders
with zero per-card listeners.

## Files changed

- **`components/command/CommandCardMotion.tsx`** *(new)* — the GSAP activation
  driver. `gsap.matchMedia`-gated to `(pointer: fine) and (prefers-reduced-motion:
  no-preference)`; cleans up listeners and clears the icon transform on revert.
- **`components/command/CommandShell.tsx`** — mounts `<CommandCardMotion />`. Mount
  only; no logic, props, or data flow touched.
- **`components/command/command-interactive.css`** — one Phase 4 block: resting-bay
  recession (geometry-safe opacity/filter), per-status top-edge identity (scoped to
  non-selected bays), and a reduced-motion guard for the new transitions.

## Honesty / scope

I deliberately did **not** lift or scale the card body, to protect the connection
geometry and the selected-state transform. The "weight" lives on the icon badge —
satisfying and conflict-free. Fuller per-module art (bespoke bay treatments beyond
status colour) is a natural later refinement once we can verify in the browser; this
phase delivers the hierarchy + identity + activation that the reality-check flagged
as the priority, safely.

## Performance & accessibility

- **Transform/opacity only.** Icon scale is a tiny GPU transform; recession is
  opacity/filter; identity is border colour. No layout, no new blur/particles.
- **Reduced motion:** the GSAP driver is inside `matchMedia` (skipped entirely), and
  the new CSS transitions are disabled under `prefers-reduced-motion`. Static result
  is still differentiated and correctly recessed.
- **Touch:** excluded via `pointer: fine`, so no lingering tap-scale on mobile. Cards
  remain fully functional everywhere.

## Confirmation — nothing functional changed

No business logic, Supabase, API, route, module, or component-contract change.
Selection, hover expansion, connection lines, panels, nav, and dock behave and
align exactly as before; the card root and its connection node are never transformed
by this phase.

## Verification

- `npm install` (GSAP) if needed, then `npm run lint` && `npm run build`.
- Open `/command`: bays show status-coloured top edges; selecting one recesses the
  rest; hovering/pressing a bay gives its icon a weighted, overshooting pop. Toggle
  reduce-motion → static, still differentiated. Connections stay aligned on hover/select.

## Next

Phase 5 — Navigation as camera: convert view changes into camera moves + room
responses (master GSAP timelines; Flip for shared-element continuity).
