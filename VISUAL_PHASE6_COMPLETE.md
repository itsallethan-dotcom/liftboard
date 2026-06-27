# Visual Overhaul — Phase 6: Boot Sequence as Title Sequence (done)

Turns the boot screen into a cinematic hand-off: the console **assembles** on mount,
and as boot completes a light **ignition** blooms — the room powering on — while the
overlay dissolves into the bridge. Crucially, the proven run-once completion timer is
**untouched**; GSAP is layered purely on top as visuals.

## What changed & why

**Console assembly (entrance).** On mount, a GSAP timeline brings the boot panel up
from slight depth (autoAlpha + y + a hair of scale), then the version line and the
progress bar settle in, on the house `forge-smooth` ease — the console *assembling*
rather than just appearing.

**Ignition hand-off (exit).** When boot finishes (or Skip is pressed), a screen-blended
light bloom flares from the centre and fades as the overlay dissolves — reading as the
reactor igniting and the room powering on, right before the bridge is revealed (which
then runs its existing staggered entrance). The bloom is timed (~0.22s up, ~0.32s down)
to land within the existing 480ms exit window.

## The safety guarantee

The boot's completion is driven by a delicate, intentionally run-once timer
(`finishedRef` + empty-deps effect + `onCompleteRef`) that previously caused an
infinite-loop bug. **None of that was touched.** The new code is:
- a `useGSAP` entrance (its own scope/lifecycle, reverts on unmount), and
- a separate `useEffect` keyed on the existing `exiting` flag that fires a
  fire-and-forget bloom on a new decorative element.

Both are additive and visual; the timer, `finish()`, `onComplete` hand-off, line
interval, and progress rAF are byte-for-byte unchanged.

## Files changed

- **`components/command/BootOverlay.tsx`** — added `rootRef`/`ignitionRef`, the GSAP
  entrance timeline, the exit ignition effect, and the ignition `<div>`. Completion
  logic unchanged.
- **`components/command/command-interactive.css`** — added `.command-boot-overlay__ignition`
  (hidden by default; screen-blended radial bloom).

## Performance & accessibility

- **Transform/opacity only.** Entrance is one short timeline; ignition is one element's
  bloom. No layout, no blur stacks, no particles.
- **Reduced motion:** the entrance is inside `gsap.matchMedia` (skipped → console just
  shows), and the ignition effect early-returns on `prefersReducedMotion()` (no bloom).
  The overlay still fades via its existing CSS transition, and boot still completes on
  the same timer. The ignition element is hidden by default, so reduced-motion / pre-JS
  show nothing extra.
- **60fps:** negligible cost.

## Confirmation — nothing functional changed

No business logic, Supabase, API, route, module, or component-contract change. Boot
timing, the Skip button, progress %, line reveal, and the hand-off to the bridge all
behave exactly as before — only the boot's *look* is now cinematic.

## Verification

- `npm install` (GSAP) if needed, then `npm run lint` && `npm run build`.
- Reload `/command`: the boot console should assemble in, and on completion a light
  bloom should flash as it dissolves into the bridge. Press **Skip Boot** mid-sequence
  → same ignition hand-off, and `onComplete` still fires (no loop, no hang). With
  reduce-motion on, boot shows and completes with no entrance/bloom.

## Next

Phase 7 — Microinteraction & polish + performance/accessibility hardening: rewards on
the remaining controls, final motion-hierarchy tuning, deletion of any motion failing
the five-purpose test, and a full 60fps / reduced-motion / no-layout-thrash audit.
