# Visual Overhaul — Phase 5: Navigation as Camera (done)

Switching views stops being "page disappears / page appears" and becomes a **camera
move**: opening a view pulls the camera back from the bridge while the new console
arrives from depth; closing returns the camera to the bridge. Transform/opacity
only, reduced-motion aware, no data/route/behavior change.

## How it reads

- **Open a view** (Modules / Telemetry / Logs / Network / Terminal / Config): the
  whole bridge — reactor, bays, rail, quick-launch — recedes together (scale 0.96,
  dim) as if the camera dollies back, and the view **arrives from slight depth**
  (scales in from 1.04 with a fade, eased on the house `forge-smooth` curve).
- **Return to bridge:** the view clears and the bridge scales back up into place —
  the camera settling back onto the command floor.
- **Switch sub-view to sub-view** (e.g. Modules → Logs): the arrival replays, so each
  navigation tells the same small story instead of a hard cut.

## Why it's geometry-safe

The recede is a **uniform transform on the whole bridge layers** (`.command-workspace`
+ `.command-stage-hud`). `.command-workspace` is already `position: relative` (the
stage's containing block), so the transform changes nothing about layout — it just
scales the bridge as one unit. The stage isn't interactive while the view overlays
it, and a CSS transform doesn't trigger the stage's ResizeObserver, so no
connection-line re-measurement happens; on return, the bridge is back at scale 1 and
any later interaction measures normally. Connections stay aligned throughout.

## Files changed

- **`components/command/CommandView.tsx`** — added a class/ref handle (`command-view`)
  and a GSAP entrance (`gsap.from` autoAlpha + scale), gated by `gsap.matchMedia` and
  replayed per view via the dependency array. Hooks placed before the early bridge
  return so hook order stays valid. No content or props changed.
- **`components/command/CommandShell.tsx`** — adds `command-main--viewing` to the main
  element when `view !== "bridge"`. One conditional class; no logic touched.
- **`components/command/command-interactive.css`** — Phase 5 block: the bridge-layer
  recede (transform/opacity/filter with a `forge-smooth` cubic-bezier transition) and
  a reduced-motion guard (dim only, no scale, no transition).

## Performance & accessibility

- **Transform/opacity/filter only.** The recede is one composited transform per layer;
  the arrival is a single GSAP tween. No layout, no new blur stacks, no particles.
- **Reduced motion:** the GSAP arrival is skipped (instant view), and the recede drops
  to a static dim (no scale, no transition) — a clear, motion-free state change.
- **60fps:** trivial cost (a couple of transforms).

## Confirmation — nothing functional changed

No business logic, Supabase, API, route, module, or component-contract change. The
nav buttons, dock, quick-launch, view contents, module selection, and the close
("← Bridge") all behave exactly as before — only the *transition* between bridge and
views is now cinematic.

## Scope note

This phase animates the **view** navigation (the heart of "navigation as camera").
The module-card → expanded-panel **Flip** shared-element transition is intentionally
deferred to a later pass: doing it across the stage/workspace boundary is the
highest-risk Flip in the app, and is best done with browser verification rather than
blind. The view camera move delivers the Phase 5 intent safely now.

## Verification

- `npm install` (GSAP) if needed, then `npm run lint` && `npm run build`.
- Open `/command`, click a top-nav/dock item (e.g. Modules): the bridge should dolly
  back and the view should arrive from depth; "← Bridge" should return the camera to
  the bridge. Switching between sub-views replays the arrival. With reduce-motion on,
  views swap instantly with a static dim. Selecting modules still snaps connections.

## Next

Phase 6 — Boot sequence as title sequence: rebuild boot into a cinematic GSAP master
timeline (the room waking up), per the production bible's first-ten-seconds.
