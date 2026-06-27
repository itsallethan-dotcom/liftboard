# UI Polish — Chunk 1: Atmosphere + Reactor Core (done)

Visual-only. No schema / API / auth / business-logic changes, no new dependencies,
no three.js. Reused the already-installed `@tsparticles/slim`.

## Files changed
- **`components/command/CommandParticles.tsx`** (new) — command-scoped ambient particle
  field. Non-interactive, capped, desktop-only, disabled under reduced-motion.
- **`components/command/CommandStage.tsx`** — mount `<CommandParticles />` as the first
  (back) child of the stage (markup only).
- **`components/command/CoreNode.tsx`** — added three decorative, `aria-hidden` layers
  behind the core panel: halo, sphere, and a dashed accent orbital ring. No text/data/
  functional changes; the connection `link-node` is preserved.
- **`app/globals.css`** (command section) — breathing background radial; brighter core
  ring arcs; new `.command-core__halo` / `.command-core__sphere` / `.command-core__ring--accent`
  / `.command-particles`; new keyframes `command-halo-breathe`, `command-bg-breathe`; a
  reduced-motion block disabling the new animations.

## Intentional deviation from the plan's file list
The plan listed `CoreReactor.tsx`, `ReactorChamber.tsx`, `ParticleBackground.tsx`, and
`CommandCenterBackground.tsx`. On inspection:
- `CoreReactor` / `ReactorChamber` are **orphaned** (not used anywhere); `/command`
  renders the functional `CoreNode`. Wiring them would have duplicated the core HUD and
  risked a regression, so I enhanced `CoreNode` instead and left them untouched.
- `ParticleBackground` / `CommandCenterBackground` are used by the **public marketing
  site** (`HeroSection` / `SiteLayout`). Editing them would have changed the public site,
  so I added a dedicated `CommandParticles` component instead.

Net: fewer files touched, lower risk, public site untouched.

## Performance choices
- Particles: `fpsLimit: 30`, 45 particles, **desktop-only** (`min-width: 768px`),
  **no links**, **no hover/click interactivity**, `detectRetina`. Rendered behind content,
  `pointer-events: none`, and it returns `null` entirely under `prefers-reduced-motion`.
- All animations use **transform/opacity only** (GPU-friendly), with long durations
  (6–48s) so CPU stays near idle.
- Decorative layers are `aria-hidden` and don't participate in the stage's layout
  measuring (the module/connection geometry is unchanged).
- `prefers-reduced-motion: reduce` disables the halo/ring/radial/scanline animations and
  the particle field.

## Testing steps
1. `npm run lint` && `npm run build`.
2. Open `/command` (as owner): boot still completes once, then the bridge shows a deeper
   background, a faint drifting particle field, and a livelier reactor core (breathing
   halo, glowing rotating ring arcs, dashed accent orbit).
3. Confirm the 9 module nodes still sit in their ring positions and connection lines
   still render (geometry unchanged).
4. Open each module panel — all still open/work (no functional change).
5. Toggle OS "reduce motion" (Windows: Settings → Accessibility → Visual effects →
   Animation effects off; or browser emulation) → particles disappear and the core/bg
   animations stop (static), everything still legible.
6. Mobile width (<768px) → particle field is off (perf), layout intact.

## Not done (awaiting approval)
Chunks 2–5 (module nodes + connection pulses, panel/table polish, boot + transitions,
optional sound) are untouched.
