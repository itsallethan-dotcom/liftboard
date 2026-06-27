# UI Polish — Chunk 4: Module card "live panel" polish (done)

Visual only, **CSS-only**, single file. No schema / API / auth / routing / data-fetching /
business-logic changes, no new dependencies, no markup/JS changes. Independently revertible.

## File changed (1)
- **`components/command/command-interactive.css`** — one clearly-marked block:
  - **Static screen depth** at rest: a faint inset top edge-light on `.command-module__body`
    (no animation when idle).
  - **Inner scanline** (`.command-module__body::before`): hidden at rest, fades in on
    hover/focus/selected only (opacity transition — triggered, not always running).
  - **Hover/focus**: edge-lighting via an inset top highlight + outer glow; icon chip brightens.
  - **Selected ("powered by the core")**: richer static glow + a thin top **power line**
    (`::after`) that gently pulses via opacity only.
  - `prefers-reduced-motion: reduce`: scanline transition and the power-line pulse are disabled.

## Performance choices (per your requirements)
- **No always-running loops across all cards.** At rest, cards are static. The scanline is an
  opacity *transition* (only animates during hover in/out). The only continuous animation is
  the selected card's power line — a single 1px element, **opacity-only** (GPU-composited).
- No new `backdrop-filter`/blur stacks added (the pre-existing 6px body blur is unchanged; not
  stacked).
- No layout-shifting animation — card size/position unchanged; the hover lift (`translateY(-2px)`)
  already existed and is untouched. New effects are box-shadow/opacity only.
- `will-change` intentionally not added (effects are light enough not to need it).
- Readable on desktop and mobile; effects are subtle by design (low opacities).

## Explicit confirmation
No functional logic, schema, auth, API, routing, database behavior, or data fetching was
modified. Card size, position, click behavior, expansion logic, and data content are unchanged.
Only `command-interactive.css` was edited; no `.ts`/`.tsx` files touched. Boot sequence untouched.

## Verification
- CSS-only → no type surface changed. Run `npm run lint` && `npm run build`.
- Open `/command`: cards have subtle screen depth at rest; hovering shows edge-lighting + a
  faint scanline + the existing lift; selecting a card gives a stronger "powered" glow and a
  pulsing top power line. All 9 modules behave identically.
- Toggle OS reduce-motion → scanline/power-line animation stop; static styling remains clean.

## Revert
Delete the "Module card live system panel polish (UI Chunk 4)" block in
`components/command/command-interactive.css`. Nothing else depends on it.
