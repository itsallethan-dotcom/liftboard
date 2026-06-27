# Visual Overhaul — Phase 7: Microinteraction & Hardening (done)

The final phase: a conflict-free press microinteraction on the primary controls, a
consistent keyboard focus ring, dead-motion cleanup, and a full performance /
accessibility audit of the whole overhaul. This closes the planned 8-phase program
(Phases 0–7).

## What changed

**Press feedback (GSAP).** A new delegated driver, **`CommandPressFX`**, gives the
primary controls physical weight — a quick scale-dip on press, an overshoot settle on
release. The safelist is restricted to controls **confirmed to have no transform
state** (top-nav links `.command-nav__link`, quick-launch tiles
`.command-stage-hud__launch-btn`), so the scale never collides with an existing
hover/active transform. Delegated on the root, so it survives re-renders.

**Keyboard focus ring (accessibility).** A single consistent `:focus-visible` outline
in the energy colour across all command controls (links, buttons, inputs, selects,
textareas) — visible only for keyboard users, improving navigability without changing
the mouse experience.

**Dead-motion cleanup (five-purpose test).** Removed the two keyframes that Phase 3
migrated to the reactor heartbeat variable and left orphaned (`command-stage-glow`,
`command-halo-breathe`). Motion that served nothing is gone.

**Perf hint.** Promoted the travelling light band (`.command-bg__sweep`) to its own
compositor layer on desktop so its transform animation stays off the main thread.

## Files changed

- **`components/command/CommandPressFX.tsx`** *(new)* — the delegated press driver
  (matchMedia-gated, auto-cleaned).
- **`components/command/CommandShell.tsx`** — mounts `<CommandPressFX />` (mount only).
- **`components/command/command-interactive.css`** — focus-visible ring, sweep
  `will-change`, and removal of the dead `command-stage-glow` keyframe.
- **`app/globals.css`** — removal of the dead `command-halo-breathe` keyframe.

## Full overhaul audit (Phases 0–7)

**Motion drivers, all reduced-motion gated:**

| Driver | Effect | Gate |
|---|---|---|
| CommandParallax | bg/stage cursor parallax | matchMedia: desktop + fine pointer + no-preference |
| CommandReactor | heartbeat var + light sweep | matchMedia: reduce → static var, no sweep |
| CommandCardMotion | bay icon hover/press | matchMedia: fine pointer + no-preference |
| CommandView | view "arrival" | matchMedia: no-preference |
| BootOverlay | assemble + ignition | matchMedia + `prefersReducedMotion()` |
| CommandPressFX | control press feedback | matchMedia: no-preference |
| Bridge recede (CSS) | camera pull-back | reduced-motion: dim only, no transform/transition |

**Performance compliance:**
- Every driver animates **transform / opacity / a single numeric variable** only — no
  width/height/top/left, no layout thrash.
- GPU layers promoted intentionally (`will-change: transform`) only on the moving
  planes (bg, stage, sweep), desktop only.
- `quickTo` reuses one tween per axis (parallax); the reactor is one number tween + one
  transform tween; no per-frame tween creation anywhere.
- **No backdrop-filter stacks added**, no new particle systems, exactly one global
  grain overlay (pre-existing) and one travelling sweep — within the limitation-audit
  budget.
- Connection-line geometry is never disturbed: nothing transforms the module card root
  or its connection node; the stage is moved only as a uniform whole.

**Accessibility compliance:**
- All decorative motion is removed/neutralised under `prefers-reduced-motion`; reduced-
  motion users get a calm, correctly-lit, fully-legible static scene.
- Decorative layers are `aria-hidden` / `pointer-events: none`.
- New keyboard focus ring across all controls.

**Five-purpose test:** every animation guides attention (camera moves, recession),
explains hierarchy (bay recession, status identity), communicates state (status colours,
reactor pulse), increases immersion (parallax, light, boot), or rewards interaction
(card/press feedback). Orphaned motion was deleted.

## Confirmation — nothing functional changed across the whole overhaul

No business logic, Supabase, API, route, module, or component-contract change in any
phase. Every change is visual/interaction layering; all clicks, selection, expansion,
navigation, panels, data, and the boot hand-off behave exactly as before.

## Verification

- `npm install` (GSAP) then `npm run lint` && `npm run build`.
- Open `/command`: press a nav link / quick-launch tile for the weighted feedback; tab
  through controls to see the focus ring; confirm everything from Phases 1–6 still reads
  (type system, depth parallax, breathing reactor + light, instrument bays, camera nav,
  cinematic boot). Toggle reduce-motion → calm static scene, all functionality intact.

## Program complete + optional follow-ups

Phases 0–7 of the Visual Overhaul are done. Two items were intentionally deferred as
they need in-browser verification rather than blind implementation:
1. **Module-card → expanded-panel Flip** (shared-element continuity across the
   stage/workspace boundary — the highest-risk Flip in the app).
2. **Fuller per-module bay art** (bespoke treatments beyond the status-colour identity).

Both are safe to tackle next once you can review the current build live.
