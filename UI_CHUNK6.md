# UI Polish — Chunk 6: Panel "power on" + active/inactive depth (done)

Visual only, **CSS-only**, single file. No schema / API / auth / routing / data-fetching /
business-logic changes, no new dependencies, no markup/JS changes. Independently revertible.
Boot untouched.

## File changed (1)
- **`components/command/command-interactive.css`** — one marked block targeting the
  expanded console panel (`.command-hub-panel__inner` / `.command-career-panel__inner`,
  which React mounts on selection — so these effects play **once** as it "comes online"):
  - **Powered edge:** stronger cyan border + outer glow so the open panel reads as the
    active console.
  - **Powered top line:** a thin glowing accent line at the panel's top edge (`::before`).
  - **Activation sweep:** a one-shot diagonal light sweep across the panel on mount
    (`::after`, `transform: translateX`, finite `forwards`), clipped by the panel's existing
    `overflow: hidden`.
  - **Depth separation:** while a module is selected, the other (non-selected) cards gently
    dim to ~0.62 opacity so the active console stands out. Cards remain fully clickable.

## Why CSS-only / no TSX
The class hooks already exist: the panel reveal animation (`command-boot-in`) is on
`.command-hub-panel`, and `.command-hub-panel__inner` is a positioned, `overflow:hidden`
box (it carries the `command-hud-panel` base). So the edge/sweep pseudo-elements and the
`:has()`-based dimming attach to existing structure — no component or class changes needed.

## Animation / performance
- Effects are **one-shot on mount** (sweep) or **static** (edge/glow) — nothing animates
  continuously, and no per-card loops. The inactive-dim is a single opacity transition.
- `transform`/`opacity` only; no layout shift; no new blur/backdrop-filter stacks.
- `prefers-reduced-motion: reduce`: the panel reveal and the sweep are disabled (panel
  appears instantly with the static powered edge); dimming still applies (static).
- No counters, no fake data, no real metrics touched.

## Explicit confirmation
No functional logic, schema, auth, API, routing, database behavior, or data fetching was
modified. `selectedModuleId` logic, click handlers, expansion logic, card content, and data
sources are unchanged. Only `command-interactive.css` was edited; no `.ts`/`.tsx` touched.

## Verification
- Run `npm run lint` && `npm run build`.
- Open `/command` and select a module: the console panel should appear with a glowing
  powered edge and a quick one-shot light sweep ("powering on"), while the other cards dim
  slightly to focus attention. Closing it restores the cards.
- Toggle OS reduce-motion → panel appears instantly (no sweep), still with the static
  powered edge; dimming remains.

## Revert
Delete the "Module panel power on + active/inactive depth (UI Chunk 6)" block in
`components/command/command-interactive.css`.
