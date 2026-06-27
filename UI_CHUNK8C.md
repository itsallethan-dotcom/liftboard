# UI — Chunk 8C: Restrained Texture & Surface Treatment (done)

Builds on 8A/8B. Visual-only. Two very subtle, **static** techniques so surfaces feel like
hardware/screens — premium and manufactured, not dirty. No global noise stacks, no animation,
no new blur, no new dependencies, no functionality/schema/API/auth/routing/database/logic.

## Files changed (2, CSS only)
- **`components/command/command-interactive.css`**
  - `.command-stage::before` — **one** ultra-faint static grain layer (SVG `feTurbulence`
    data-URI, `opacity: 0.05`, `mix-blend-mode: overlay`, `pointer-events:none`) over the
    stage → covers the **command stage + reactor chamber background**. The only global overlay.
  - `.command-hub-panel__inner` / `__inner` — the recessed **screen** background now layers a
    faint **scanline + glass sheen + corner darkening** under its color.
  - `.command-module__body::before` — the card **screen** scanline is now faintly **always-on**
    (opacity 0 → 0.1); it still intensifies on hover/selected (from 8B/Chunk 4).
  - `.command-hub-panel` / `.command-career-panel` — the **housing** gradient gains a faint
    top-left **metal sheen** band.
- **`app/globals.css`**
  - `.command-hud-panel` — every **screen surface** (rail / core / stage-HUD panels) gets the
    same faint **scanline + sheen + corner-darkening** as a background layer.

## Where texture was added & why
- **Screens (panel inner, cards, HUD panels):** a barely-there **scanline** + **glass sheen**
  reads as a real display rather than flat fill; **corner darkening** deepens each screen.
- **Housings:** a faint **metal sheen** so the matte casing reads as brushed/anodized metal.
- **Stage + reactor chamber:** a single, extremely low-opacity **grain** removes the "perfectly
  smooth render" feel — surface variation that's *felt, not seen*.
- Nothing was applied to text; textures sit on backgrounds/behind content, so text stays crisp.

## Restraint / honesty
- Two techniques only (grain + screen/surface treatment). All opacities are tiny
  (grain 0.05; scanline/sheen ~0.02; card scanline gradient 0.05 × 0.1). No grunge, no
  scratches, no dirt, no labels, no fake data.
- Cyan still reserved for active/powered states (textures are neutral white/black/overlay).

## Performance
- **Static only:** one small tiled grain image + static CSS gradients. No animation, **no new
  `backdrop-filter`/blur**, no extra particle systems, and **only one** global overlay (the
  stage grain). Negligible cost. Nothing animates, so reduced-motion is unaffected (and the
  pre-existing card-scanline transition is already disabled under reduced-motion).

## Confirmation — no functionality changed
No schema, API, auth, routing, database, or business-logic changes; no new dependencies; no
`.tsx` changes this chunk (only two CSS files). All clicks, selection, expansion, panels, nav,
data behavior, and content readability are unchanged.

## Verification
- Run `npm run lint` && `npm run build`.
- Open `/command`: screens should show a faint scanline + subtle glass sheen with slightly
  darker corners; housings have a soft metal highlight; the stage/reactor area has a barely-
  perceptible grain. Text remains crisp; cyan still marks only active states.

## Revert
Remove the `.command-stage::before` grain, the `background-image` block on `.command-hud-panel`
(`globals.css`), the layered `background` on `.command-hub-panel__inner`, the housing sheen layer,
and restore `.command-module__body::before` opacity to 0.
