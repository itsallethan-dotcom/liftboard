# Visual Overhaul — Phase 0: Motion & Design Foundations (done)

The invisible groundwork. Installs the motion engine, defines the shared motion
grammar and design tokens, and catalogues the existing motion to be replaced.
**No component is wired to any of this yet** — by design, the UI looks and behaves
exactly as before. This phase only adds capability.

> ⚠️ **Run `npm install` before building.** GSAP is a new dependency; the build
> will fail to resolve `gsap` / `@gsap/react` until it's installed.

## Files added / changed

- **`package.json`** — added `gsap ^3.13.0` and `@gsap/react ^2.1.2`. (As of GSAP
  3.13 all plugins — Flip, CustomEase, SplitText, ScrollTrigger — ship in the
  public `gsap` package, so no separate plugin installs are needed.)
- **`lib/motion/tokens.ts`** *(new)* — pure constants (no GSAP import, safe
  anywhere): `DURATION`, `STAGGER`, `EASE`, `DEPTH`. The shared motion vocabulary.
- **`lib/motion/forgeonix-motion.ts`** *(new)* — the central motion system:
  registers GSAP + `useGSAP`, `Flip`, `CustomEase`, `SplitText`, `ScrollTrigger`;
  creates the house CustomEases (`forge-smooth`, `forge-overshoot`); sets project
  tween defaults; exports `gsap`, the plugins, the tokens, and
  `prefersReducedMotion()`. SSR-safe (registration is a browser-only no-op on the
  server).
- **`lib/motion/index.ts`** *(new)* — entry point: `import { gsap, EASE, ... } from "@/lib/motion"`.
- **`app/globals.css`** — added one additive `:root` block of `--fx-*` design
  tokens: a fluid **type scale** + tracking/weights/voices, a **4px spatial
  system**, **depth-plane** z-index + parallax + elevation tokens, and
  **light/energy** tokens. Namespaced `--fx-*` to avoid any collision; nothing
  references them yet.

## The rule for later phases

Client components that animate must import `gsap` (and helpers) **from
`@/lib/motion`**, never from `"gsap"` directly — that guarantees plugins and the
house eases are registered before any tween runs. Use `useGSAP` for lifecycle +
automatic cleanup, scope selectors to a ref, and gate ambient/camera motion on
`prefersReducedMotion()` (or `gsap.matchMedia` with a `reduceMotion` condition).

## Motion catalogue (what later phases will replace)

The command center's motion today is **100% CSS-keyframe driven** — Framer Motion
is used only on the marketing site (Hero/About/Services/etc.), **not** in
`components/command`. So GSAP becomes the command center's motion engine from here.

- **~20 `command-*` keyframes** across `globals.css` + `command-interactive.css`
  (e.g. `command-core-pulse`, `command-reactor-breathe`, `command-core-energy`,
  `command-halo-breathe`, `command-bg-breathe`, `command-aurora-drift`,
  `command-energy-rotate`, `command-stage-glow`, `command-stream-flow`,
  `command-particle-flow`, `command-scan-drift`, `command-grid-drift`,
  `command-boot-in`, `command-panel-sweep`, `command-card-line`,
  `command-hud-blink`, `command-cursor-blink`, `command-ring-spin`, …),
  invoked ~22 times via `animation:`.
- **~31 `transition:` declarations** across the two command CSS files (hover/state).
- These are the ad-hoc, isolated loops the directive calls out. Later phases will
  progressively migrate the meaningful ones into **GSAP timelines** (choreographed,
  interruptible, reduced-motion aware) and retire the rest. Phase 0 leaves them all
  in place so nothing changes yet.

## Confirmation — nothing changed functionally or visually

No business logic, Supabase, API, route, module, or component-contract change. No
component imports the new motion system yet, and the `--fx-*` tokens are unused, so
the rendered UI is byte-for-byte the same. This phase is purely additive capability.

## Verification

1. `npm install` (required — pulls GSAP).
2. `npm run lint` && `npm run build` — should pass; the new `lib/motion` files
   typecheck against the freshly installed GSAP types.
3. Open `/command` — it should look and behave **exactly** as before (no visible
   change is the expected result of Phase 0).

## Next

Phase 1 — Typography & spatial system: apply the `--fx-*` type scale and spacing
rhythm across the command surface (highest craft-per-effort, near-zero motion risk).
