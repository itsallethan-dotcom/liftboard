# UI Polish — Chunk 5: Ambient HUD / telemetry chrome (done)

Visual only, decorative chrome. No schema / API / auth / routing / data-fetching /
business-logic changes, no new dependencies. Independently revertible. Boot untouched.

## Files changed (3)
- **`components/command/CommandHudOverlay.tsx`** (new) — a purely decorative,
  `aria-hidden`, `pointer-events:none` overlay: four corner frames, four ambient status
  tags (SYS ONLINE / CORE LINK ACTIVE / NODE GRID STABLE / SIGNAL ROUTING), and two edge
  rails (TELEMETRY STREAM / REACTOR OUTPUT). No props, no hooks, no data.
- **`components/command/CommandStage.tsx`** — mounts `<CommandHudOverlay />` behind the
  cards (markup only; one import + one line).
- **`components/command/command-interactive.css`** — styles for the chrome
  (`.command-hud-overlay` and children) + a slow status-dot blink + reduced-motion and
  mobile guards.

## Honoring "no fake data"
Per your earlier direction (we removed/labelled fake metrics in Phase 1), this chrome shows
**only static status words** — never numbers, percentages, counts, or anything resembling
live application data. It reads as system framing, not content. Real metrics (the dock
NODES count, the labelled SIM values) are untouched and unaffected.

## Readability + clutter control
- Chrome sits at the stage **edges/corners** at low opacity (0.3–0.55), behind the cards
  (`z-index: 1`, cards are `z-index: 4`), so card readability stays the top priority.
- Edge rails hide on mobile (`max-width: 767px`) to avoid clutter on small screens.

## Animation / performance
- The only motion is a slow opacity **blink** on the small status dots (2.6s) — opacity-only,
  a few tiny elements. No counters, no updating values, no heavy loops.
- `prefers-reduced-motion: reduce` disables the blink (chrome stays static).
- All elements are `pointer-events: none` and don't affect layout or the stage's geometry
  measuring.

## Explicit confirmation
No functional logic, schema, auth, API, routing, database behavior, or data fetching was
modified. The only TSX change is mounting a decorative, data-free overlay. Cards, panels,
core, click behavior, and data content are unchanged.

## Verification
- Run `npm run lint` && `npm run build`.
- Open `/command`: corner brackets + faint ambient status tags + vertical edge labels frame
  the bridge like a mission-control HUD, without obscuring cards.
- Toggle OS reduce-motion → status dots stop blinking; chrome stays static.
- Mobile width → edge rails hidden; corner tags/frames remain subtle.

## Revert
Delete `CommandHudOverlay.tsx`, remove its import + the `<CommandHudOverlay />` line in
`CommandStage.tsx`, and remove the "Ambient command HUD chrome (UI Chunk 5)" block in
`command-interactive.css`.
