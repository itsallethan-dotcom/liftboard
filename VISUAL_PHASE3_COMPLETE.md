# Visual Overhaul — Phase 3: Living Reactor + Environment Light (done)

The "wow" phase. The reactor stops being a centerpiece widget and becomes the
**light source for the room**: one GSAP heartbeat drives the chamber's brightness,
so the core and its surroundings breathe as a single living system. Opacity/
transform only, fully reduced-motion aware, no data/layout/behavior change.

## The core idea — one heartbeat, one source of truth

A single GSAP tween animates the root CSS variable **`--fx-reactor-pulse`** (0.6 → 1,
~2.1s, `sine.inOut`, yoyo). It's the facility's heartbeat. Two surfaces read that
variable directly in CSS, so they rise and fall **in perfect sync** with the core:

- **Reactor spill** (`.command-stage__glow`) — opacity and scale now follow the
  pulse (was its own `command-stage-glow` keyframe). This is the core's light
  flooding the chamber.
- **Core halo** (`.command-core__halo`) — opacity and scale now follow the same
  pulse (was its own `command-halo-breathe` keyframe). The core's own glow and the
  room light are now the *same* breath, which is what sells "the core lights the room."

Because both consume one variable, there's no phase drift — the chamber visibly
pulses with the reactor instead of several loops running independently.

## Travelling light

A soft, blurred, screen-blended band (`.command-bg__sweep`) drifts slowly across
the chamber (GSAP `xPercent`, ~17s loop) — "light travelling across the walls." It
lives in the background plane, so it also parallaxes (Phase 2) and is darkened at
the edges by the vignette. Hidden by default; only revealed when motion is allowed.

## Files changed

- **`components/command/CommandReactor.tsx`** *(new)* — the GSAP heartbeat + sweep
  driver. `gsap.matchMedia` splits behavior: full motion gets the breathing pulse +
  travelling light; **reduced motion** holds a calm static `--fx-reactor-pulse: 0.82`
  and no sweep. Writes the variable via `onUpdate` (unitless, no CSS-var unit
  pitfalls); auto-reverts on unmount.
- **`components/command/CommandShell.tsx`** — added the `.command-bg__sweep` layer to
  the background and mounted `<CommandReactor />`. Markup + mount only; no logic.
- **`app/globals.css`** — added the `--fx-reactor-pulse` default (0.78, so the scene
  is correctly lit pre-JS / under reduced motion); migrated `.command-core__halo` to
  the pulse variable; added `.command-bg__sweep` styles (hidden by default).
- **`components/command/command-interactive.css`** — migrated `.command-stage__glow`
  to the pulse variable.

## Honesty / restraint (per the limitation audit)

Light is **implied**, not simulated: no real volumetric lighting, no geometry-aware
shadows. The heartbeat animates *intensity* (opacity) and a hair of *scale* — never
geometry. The sweep is a single blurred layer (not a stack), so it stays cheap.
The core's intrinsic rings/sphere keep their own subtle motion for organic life.

## Performance & accessibility

- **Opacity/transform only.** The pulse drives CSS `calc()` on two existing
  decorative layers; the sweep is one GPU-composited, transform-animated layer.
- **No new particles, no blur stacks, no backdrop-filter added.**
- **Reduced motion:** everything animated is inside `gsap.matchMedia`; those users
  get a still, correctly-lit chamber (static pulse, hidden sweep). The two migrated
  layers no longer use CSS keyframes, so they're inherently static without JS.
- **60fps:** one number tween + one transform tween; negligible cost.

## Confirmation — nothing functional changed

No business logic, Supabase, API, route, module, or component-contract change. The
reactor, module nodes, connection lines, panels, nav, and dock behave and align
exactly as before. Everything added is decorative lighting.

## Verification

- `npm install` (GSAP) if needed, then `npm run lint` && `npm run build`.
- Open `/command`: the reactor and the chamber light should breathe together (the
  whole room gently pulsing with the core), and a faint light band should drift
  across the chamber. With reduced motion on, the scene is calm and static but still
  correctly lit.

## Next

Phase 4 — Cards → instrument bays: rebuild the module cards as differentiated,
depth-layered instrument panels with GSAP hover/press microinteractions (weight,
anticipation, overshoot) and spatial hierarchy.
