# UI — Chunk 8B: Engineered Micro-Detail Pass (done)

Builds on 8A. Visual-only. Restrained engineered details that imply the system is
manufactured, mounted, contained, connected, calibrated, and maintained. **No** global
noise / grain / texture overlays / drafting layers (reserved). No functionality, schema,
API, auth, routing, database, or business-logic changes; no new dependencies.

## Files changed (3)
- **`app/globals.css`** — clamp brackets + header LEDs.
- **`components/command/command-interactive.css`** — mounting rail + subsystem ID, connector
  nubs, containment bracket ring, stage IDs/ticks/caution styling, mobile-hide update.
- **`components/command/CommandHudOverlay.tsx`** — added decorative (aria-hidden) stage
  subsystem IDs, corner calibration ticks, and one caution strip.

## Detail categories added
- **Corner brackets / retention clamps:** restyled the existing HudPanel corner spans
  (`.command-hud-corner`) from thin cyan into **steel clamp brackets** — so every panel reads
  as bolted-in. (Reuses existing DOM; also removes cyan from chrome → supports hierarchy.)
- **Tiny static power LEDs:** a small **green** dot before each console header
  (`.command-hud-panel__label::before`) — implies each panel is powered. Static (no blink),
  so no motion/perf cost.
- **Mounting rail + subsystem ID:** the expanded panel **housing** gets a left **mounting
  rail** with tick marks (`::before`) and a static **`PANEL-LINK`** subsystem ID (`::after`).
- **Connector nubs:** the module→core link points (`.command-module__node`) now have a dark
  socket + steel collar, reading as physical connectors where conduits meet nodes.
- **Reactor containment:** a segmented **steel bracket ring** around the containment ring
  (`.command-stage__spokes::after`) — clamps holding the core chamber.
- **Stage calibration + IDs (decorative overlay):** corner **calibration tick rulers**,
  subsystem IDs **`MOD-RING`** (top) and **`CORE-01`** (bottom), and a single restrained
  **amber caution strip** on the bottom edge — attached to structure, not floating randomly.

## Restraint / honesty
- Details are **steel / amber / low-opacity**; **cyan stays reserved for active/powered**
  states (clamps and IDs are neutral steel; LEDs are green; caution is amber).
- **No fake metrics or live-looking numbers** — only static subsystem IDs (CORE-01, MOD-RING,
  PANEL-LINK) and a caution stripe. Nothing implies live data.
- Quantity kept low and attached to structures (corners, headers, rails, ring, edges); the
  new stage chrome is hidden on mobile to avoid clutter.

## Performance
- All additions are **static** (borders, box-shadows, gradients, a couple of pseudo-elements
  and small decorative spans). **No animations added**, no `backdrop-filter`/blur, no
  particles. Negligible cost; nothing needs a reduced-motion guard (LEDs are static).

## Confirmation — no functionality changed
No schema, API, auth, routing, database, or business-logic changes; no new dependencies. The
only `.tsx` change is decorative `aria-hidden` chrome added to the existing `CommandHudOverlay`
(no props, no logic). All clicks, selection, expansion, panels, nav, and data behavior are
unchanged; actual content remains readable.

## Verification
- Run `npm run lint` && `npm run build` (CSS + one decorative component; no type/logic surface).
- Open `/command`: panels show steel clamp corners + a small power LED; the open console shows
  a left mounting rail + `PANEL-LINK`; node link points read as connectors; the reactor sits
  in a steel containment + bracket ring; the stage carries faint calibration ticks, `MOD-RING`
  / `CORE-01` IDs, and one amber caution strip. Cyan still only marks active/powered states.

## Revert
Remove the Chunk-8B blocks: `.command-hud-corner` color/size + `.command-hud-panel__label::before`
in `globals.css`; the housing `::before/::after`, `.command-module__node` collar, the
`.command-stage__spokes::after` ring, and the `.command-hud-id/tick/caution` blocks (+ the
mobile-hide additions) in `command-interactive.css`; and the added spans in `CommandHudOverlay.tsx`.
