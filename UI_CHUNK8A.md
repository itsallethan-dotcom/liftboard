# UI — Chunk 8A: Materiality & Physical Construction (done)

Goal: make the Command Center feel **manufactured** — housings, console framing, inset
displays, structural depth, reactor containment. **CSS-only.** No texture/noise/grain/labels
(reserved for later chunks), no new functionality, dependencies, schema, API, auth, routing,
or business logic. No markup/`.tsx` changes — purely the framing around existing content.

## Files changed (2)
**`app/globals.css`**
1. `.command-hud-panel` (every panel surface) — added a **bevel + cast shadow** (inset top
   light, inset bottom dark, neutral drop shadow) so panels read as physical units with edge
   thickness, not flat cards.
2. `.command-hud-panel:hover` — combined the bevel with the existing glow so hover keeps the
   physical edge.

**`components/command/command-interactive.css`**
3. `.command-hub-panel` / `.command-career-panel` (the aside) — now a **matte machined
   housing**: dark steel gradient, neutral steel border, deep drop shadow, and 5px padding so
   the screen sits **inset inside the housing**.
4. `.command-hub-panel__inner` / `__inner` (the screen) — reads as **recessed into the
   housing** (dark top inset shadow) with a thin cyan **screen bezel**; keeps its glow.
5. `.command-hub-panel__header` — a **console header rail** (bottom structural divider)
   separating the label band from the screen body.
6. `.command-module__body` (cards) — **mounted-chip** treatment: neutral steel frame + bevel
   + a neutral cast shadow (depth via construction, not glow). Active/selected still go cyan.
7. `.command-stage__spokes` — the reactor ring is now a **matte steel containment ring**
   (was a faint cyan dashed circle).
8. `.command-stage__anchor::before/::after` — **diagonal mounting struts** (a steel
   cross-brace) seating the core in its chamber.

## Visual reasoning
- **Housing vs screen separation:** the expanded panel is now clearly "a machine (dark steel
   housing) with a display mounted inside it (recessed glass screen)" — the core ask. Neutral
   steel is used for *structure*, cyan reserved for the *screen/active state*, which also
   sharpens hierarchy.
- **Edge thickness & depth:** layered inset highlights/shadows + neutral drop shadows make
   every surface sit *above* the scene and read as fabricated, achieving depth through
   construction rather than glow/blur/particles (per the brief).
- **Console framing:** the header rail + housing frame turn "expanded card" into "console
   station" without changing any content.
- **Reactor containment:** the steel ring + diagonal struts make the core feel *installed*
   in a support structure — no reactor redesign, no added effects.
- **Cards as mounted units:** steel frame + cast shadow makes each module read as a physical
   chip on the bridge; cyan returns only when active (hover/selected), reinforcing hierarchy.

## Performance impact
- **Negligible.** All additions are **static** box-shadows, borders, and gradients (composited
   once); **no new animations**, no `backdrop-filter` added, no blur stacks, no particles. Two
   static pseudo-elements (struts) were added. No layout-shifting changes (padding on the
   housing only insets the existing screen; panel footprint unchanged).
- No `prefers-reduced-motion` work needed — nothing here animates.

## Confirmation — no functionality modified
No schema, API, auth, routing, database, or business-logic changes. No new dependencies, no
three.js. No component/markup changes (only two CSS files). All clicks, selection, expansion,
panels, nav, and data behavior are exactly as before — only the framing/material around content
changed.

## Verification
- Run `npm run lint` && `npm run build` (CSS-only; no type surface changed).
- Open `/command`: panels/cards should read as beveled physical units; opening a module shows
   a dark steel **console housing** with a recessed glass **screen** and a header rail; the
   reactor sits inside a steel **containment ring** with mounting struts.

## Revert
Remove the Chunk-8A box-shadow/border additions on `.command-hud-panel`(+hover) in
`globals.css`, and in `command-interactive.css` the housing block on `.command-hub-panel`,
the `__inner` recess insets, the header-rail border, the `.command-module__body` bevel/border,
the `.command-stage__anchor` strut pseudos, and the `.command-stage__spokes` steel change.
