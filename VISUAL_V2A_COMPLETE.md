# Forgeonix V2 — Chunk A: Calm Reactor, Reactive Room (done)

The first step of treating Forgeonix as a **place**: establish the environment by
making the reactor a still, heavy object while the *room* responds to the operator.
Transform/opacity only, reduced-motion aware, no data/layout/behavior change.

## What changed & why

**The reactor is calm.** The old behavior translated the entire stage (reactor +
bays) with the cursor — effectively a "magnetic" core that chased the pointer. That
is removed. The reactor and its bays no longer move with the cursor at all; the core
only *breathes* (the Phase-3 heartbeat). A massive object should barely acknowledge
you — and now it doesn't.

**The room reacts instead.** Two environmental responses replace the magnetic core:
- **Atmospheric drift** — the chamber backdrop drifts gently (±10px, eased) behind
  the still reactor, so depth reads as the room shifting around a fixed mass.
- **Carried light** — a soft specular highlight glides across the chamber toward the
  cursor with a slight lag, as if the operator carries a light through the room. It
  sits *behind* the reactor (z below the content), lighting the chamber surfaces, not
  the core's face. Subtle (screen-blended, low opacity), atmospheric rather than a
  flashlight.

The felt result: a calm, enormous reactor in a room that quietly acknowledges you —
which is exactly how mass reads on screen (the contrast between the still object and
the reacting environment).

## Files changed

- **`components/command/CommandParallax.tsx`** — reworked into the "calm reactor /
  reactive room" model: removed the stage (reactor) parallax entirely; kept a gentle
  backdrop drift; added the cursor-tracked carried-light driver. Still
  `gsap.matchMedia`-gated to desktop + fine pointer + no-preference; auto-cleaned.
- **`components/command/CommandShell.tsx`** — added the `.command-bg__specular` layer
  (a sibling of the backdrop, behind the content). Markup only.
- **`app/globals.css`** — `.command-bg__specular` styles (hidden by default;
  screen-blended radial; revealed only by the driver when motion is allowed).
- **`components/command/command-interactive.css`** — updated the desktop `will-change`
  hint: only the room layers (`.command-bg`, `.command-bg__specular`) are promoted now
  — the stage no longer transforms, so it's removed from the hint.

## Why it's safe

The **stage is never transformed** anymore — the reactor, bays, and connection lines
keep their exact measured geometry at all times (this actually de-risks things versus
before). The new light is a separate fixed layer behind the content; it can't affect
layout or interaction.

## Performance & accessibility

- **Transform/opacity only**; `quickTo` reuses one tween per axis; one extra
  composited layer (the light). No layout, no new blur stacks, no particles.
- **Reduced motion / touch:** the whole driver is inside `matchMedia`; those users get
  a completely still room and the carried light stays hidden (default opacity 0).
- **60fps:** trivial cost.

## Confirmation — nothing functional changed

No business logic, Supabase, API, route, module, or component-contract change. The
reactor, bays, connections, panels, nav, dock, and all data behave exactly as before —
only the *environmental motion model* changed (calm core, reactive room).

## Verification

- `npm install` (GSAP) if needed, then `npm run lint` && `npm run build`.
- Open `/command` on a desktop and move the cursor: the reactor should hold still and
  heavy while the chamber drifts gently and a soft light glides across it toward your
  cursor. With reduce-motion on, the room is completely still and correctly lit.

## Next (per the approved V2 plan)

- **V2-B** — merge the four right-rail cards into one continuous installed side console
  (instrument surfaces, not floating boxes).
- **V2-C** — merge the bottom HUD row into one installed instrument desk.
- **V2-D** — subtle rake + "surface presents itself when operated."
- **V2-E** — navigation reimagined as part of the environment (dissolve the top bar).
- **V2-F** — hierarchy, lighting, and hardening pass.

(Per your direction: subtle rake only, and navigation reimagined as part of the
environment — both are folded into the plan above.)
