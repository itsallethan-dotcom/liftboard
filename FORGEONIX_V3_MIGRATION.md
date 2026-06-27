# FORGEONIX OS — V3
### Inheriting the prototype's cinematic DNA (analysis → comparison → migration)
*The HTML is the trailer. The OS becomes the operational film. Translate the language, don't copy the layout. Functionality, data, APIs, routes, Supabase, auth — frozen.*

---

## PART 1 — WHY THE PROTOTYPE FEELS CINEMATIC (reverse-engineered)

It isn't the visuals — it's the **system** underneath. Twelve mechanisms, pulled from the code:

1. **One persistent world.** `#world` (fixed, z0) holds *everything* atmospheric — aurora, a particle canvas, the reactor SVG, vignette, grain — as a single stage. All content (`#scroll`, z10), HUD (z30), nav (z40), cursor (z60) float above it. Sections are not pages; they are **camera positions inside one continuous environment**. Nothing ever "leaves."

2. **The reactor is the camera's subject, not a widget.** A dedicated `camera()` module scroll-scrubs the reactor across the journey — it dollies sideways (`xPercent`), pushes in/out (`scale`), dims, and recenters at the finale. The reactor itself is **calm**: five rings rotating at wildly different periods (90s / 60s / 140s / 24s / 30s), a core breathing on a 1.8s sine, an edge that pulses outward. The drama is the **camera moving relative to a still, authoritative object** — exactly the "reactor calm, room reacts" principle, executed.

3. **A scroll-driven scene-temperature grade.** `--hue` is mapped from scroll progress (cyan → violet → gold) and applied as `filter:hue-rotate` **on the world layer only**. The entire environment's color temperature shifts as you move. This single device makes the whole thing feel *graded* like film, and ties every section into one continuous mood.

4. **Two-voice typography with extreme contrast.** Sora (weights 200–800) for display, IBM Plex Mono for technical text. Headlines are **huge and thin** (`clamp(44px,8.5vw,118px)`, weight 200 with bold accents, negative tracking); labels are **tiny and wide** (mono, `letter-spacing:.18–.34em`, uppercase). The gulf between giant-thin and tiny-wide is the premium signature.

5. **Enormous breathing room.** Sections pad at `46vh / 40vh / 24vh`. Whitespace is the confidence. Nothing is crammed.

6. **Choreographed pacing.** Boot (3.2s) → aperture iris-open → hero char-split (`stagger .028`) → blur-in reveals → telemetry count-ups → scroll cue, all sequenced with overlapping offsets. The manifesto **scrubs** word-by-word (opacity .08→1 + blur + y, tied to scroll). Reveals are never all-at-once.

7. **Bespoke eases = physical weight.** Four `CustomEase`s — `forge` (expo-out), `cinema` (smooth in-out), `antic` (anticipation **+ overshoot**), `glass` (soft settle) — and `gsap.defaults({ease:"cinema"})` so *everything* inherits weight. Hovers use `antic` (lift with overshoot). This is the difference between "animated" and "alive."

8. **Layered parallax depth.** A 150-particle field with per-particle depth (`0.3 + z*1.7`), eased pointer parallax, and scroll parallax; glass panels reveal from `z:-200` with `transformPerspective` and tilt to the pointer (`rotateX/Y`); cards reveal with `rotateX:8` + blur; aurora parallaxes. Real Z, everywhere.

9. **Instrument HUD framing.** Fixed L-corner brackets, rotated edge readouts, a **live latency flicker** (`setInterval` rewriting a value), and a right-edge **section timeline** (Ignition/Doctrine/Core/…) that activates per section. It frames the viewport like a running instrument.

10. **A custom two-speed magnetic cursor.** Native cursor hidden (`cursor:none`); a reticle ring (slowly rotating) + a fast dot. Dot tracks at `.12s`, ring lags at `.5s` (depth). Interactive elements trigger brackets + `scale 1.7` (antic) and **magnetically pull** toward the pointer (`quickTo`, strength .35–.5).

11. **Environmental atmosphere.** Aurora (blurred multi-radial color fields), grain (`feTurbulence`, opacity .05, `mix-blend:overlay`), vignette, starfield. Static + animated, always present.

12. **Iris/aperture transitions.** Boot ends by **opening an aperture** (an expanding transparent radius) into the live world. Entrances are camera events, not fades.

**The essence:** one graded, atmospheric world; a calm authoritative reactor as the subject of a moving camera; thin-display × mono-tracking typography; huge breathing room; GSAP master timelines on bespoke overshoot eases; layered parallax; a live instrument HUD; a magnetic reticle cursor.

---

## PART 2 — WHY FORGEONIX OS STILL FEELS LIKE A DASHBOARD (brutal)

Even after V1 polish and V2's constructed environment:

- **It's dense and chrome-heavy; the prototype breathes.** The OS packs nav + side console + instrument desk + dock edge-to-edge. The prototype lives on `vh`-scale whitespace. Density is the loudest "app, not film" tell.
- **The reactor competes; it doesn't reign.** It's centered but surrounded by equally-weighted consoles. In the prototype the reactor is *the subject* and everything else is sparse and subordinate.
- **No camera.** V2 added parallax and recede/arrive transitions, but there's no continuous camera moving relative to the reactor through one world. State changes still feel like swapping panels, not moving through a place.
- **Typography is tasteful, not dramatic.** Phase 1 gave a clean scale, but headings aren't huge-and-thin and the tracking contrast is mild. It reads "good app UI," not "film title."
- **Monochrome cyan, no grade.** The OS is cyan-on-dark throughout. The prototype's cyan/violet/gold + scroll-hue grade gives mood progression and cohesion the OS lacks.
- **Motion is mostly micro.** GSAP is in, but as hovers/heartbeat/parallax — no master timelines choreographing sequences, and the bespoke eases aren't applied broadly. Nothing inherits weight by default.
- **Default cursor.** The single biggest cheap-to-fix "this is a browser" signal is still there.
- **HUD is decorative, not live.** V2's etched markings are static. The prototype's HUD *runs* (live readouts, section timeline) — and the OS actually has **real data** to make that honest.

---

## PART 3 — THE TRANSLATION PRINCIPLE (not imitation)

The prototype is a **linear scroll film**. The OS is a **non-linear interactive facility**. The trap is scroll-ifying the OS. Instead:

> The prototype's *sections* become the OS's *rooms*. Scroll-progress choreography becomes **state/navigation choreography**. The same persistent world sits behind every room; moving between modules/views is a **camera move within that world**, graded by a per-room scene temperature. You never leave; you go deeper.

We inherit the **language** — world, reactor-as-subject, grade, typography, eases, depth, HUD, cursor — and drive it with the OS's interactions instead of scroll.

---

## PART 4 — THE DNA TO EXTRACT (mapped to the OS)

| Prototype DNA | How it lands in the OS |
|---|---|
| One persistent world | A single cinematic stage behind *all* command-center states (deepen V2): aurora + particle depth + reactor + vignette + grain, never torn down on navigation. |
| Reactor as moving-camera subject | Elevate the reactor's fidelity; make view/module changes a camera timeline that re-frames the reactor (not a recede/swap). |
| Scene-temperature grade | A per-view/per-module **world hue** (cyan default; reuse existing ops-red / diagnostics-amber / executive-silver themes) so each room is lit differently — applied to the world layer only. |
| Thin-display × mono typography | Adopt **Sora + IBM Plex Mono** (via next/font, no external runtime dep) mapped to the existing `--fx-font-*`; push display headings huge & thin, labels tiny & wide. |
| Bespoke eases + defaults | Register `forge / cinema / antic / glass` into `lib/motion`, set `gsap.defaults`, and apply broadly so all motion gains weight. |
| Layered parallax depth | Upgrade the particle field to depth-parallax quality; pointer-tilt on glass surfaces. |
| Instrument HUD (live) | Make the HUD readouts **live from real data** (node counts, latency, sector) + a zone/room indicator replacing the static markings. |
| Magnetic reticle cursor | A custom two-speed cursor with magnetic targets — desktop + motion-allowed only, and careful around text inputs. |
| Iris/aperture transitions | Use the aperture as the boot→bridge and major-transition device. |
| Breathing room | More negative space + larger thin headers in expanded panels and view overlays where density allows. |

---

## PART 5 — V3 MIGRATION PHASES (no code until approved)

Each phase is shippable, reversible, behaviour-neutral, and builds on the V2 architecture.

- **V3-1 — Motion + type foundation.** Register `forge/cinema/antic/glass` eases + `gsap.defaults` in `lib/motion`; load Sora + IBM Plex Mono via next/font and wire them to `--fx-font-display`/`--fx-font-mono`. (Foundation; near-invisible until used.)
- **V3-2 — The persistent World.** Consolidate the background into one cinematic stage (aurora + upgraded particle depth + vignette + grain) that lives behind every command-center state and is never re-mounted on navigation.
- **V3-3 — Reactor presentation.** Elevate the core to prototype fidelity — differential multi-ring rotation, orbit nodes, scan sweep, core breathe + edge-pulse bloom, layered glow — calm and authoritative.
- **V3-4 — Scene temperature + palette.** Introduce violet/gold alongside cyan; drive a world hue per active view/module (reusing the existing theme tokens) so each room is graded.
- **V3-5 — Magnetic reticle cursor.** Two-speed cursor + magnetic targets, desktop/motion-allowed, input-safe.
- **V3-6 — Live instrument HUD.** Real-data readouts + a zone/room indicator; keep it sparse and structural.
- **V3-7 — Camera between rooms.** Master GSAP timelines for view/module transitions that move the camera within the world and re-frame the reactor (supersedes the V2 recede with a true camera).
- **V3-8 — Typography/spacing/breathing pass + hardening.** Apply thin-display × mono-tracking and more negative space across panels/overlays; final 60fps / reduced-motion / a11y sweep.

---

## PART 6 — GUARDRAILS (unchanged)

No business logic, Supabase, API, route, module, auth, schema, or data-flow change. Refactors allowed only if functionally identical (component reorganization, shared motion system, perf). Transform/opacity-first, 60fps, full `prefers-reduced-motion`, keyboard a11y preserved. New fonts load via next/font (no runtime third-party dependency); GSAP stays the only animation dep.

---

## THE BAR
Leaving the trailer and entering the OS should feel like **walking deeper into the same film** — same world, same grade, same reactor, same weight of motion — only now it's interactive. If the command center still reads as a dense cyan dashboard, the translation failed.
