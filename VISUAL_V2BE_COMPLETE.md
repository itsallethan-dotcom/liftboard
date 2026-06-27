# Forgeonix V2 — Chunks B–E: The Constructed Environment (done)

Turns the floating rectangles into **installed console structures**. The four rail
cards and the bottom HUD row stop being separate boxes on a background and become
continuous equipment built into the chamber; the side console is installed at a
subtle angle and straightens when you operate it; and the browser-style header bar
dissolves into an etched seam in the chamber frame. CSS only — every panel keeps its
component, props, data, and behavior. Nothing was re-wired, only re-housed.

> ⚠️ This is the most visually structural change yet and was authored without a live
> browser. Please review `/command` after building — it's all in one reversible CSS
> block plus the V2-A changes.

## V2-B — Side console (the rail)
The right rail's four panels (Terminal, Quick Actions, AI Chat, Network) were four
bordered, blurred, floating cards. They're now **one installed equipment stack**: the
rail container is a single metal housing (steel border, bevel, deep cast shadow, dark
recessed interior), and each panel becomes a **flush zone** inside it — individual
borders, backgrounds, blur, and corner-clamps removed, zones separated by etched
divider lines. Removing four `backdrop-filter` blurs is also a perf win.

## V2-C — Lower instrument desk (the HUD row)
Health / Resources / Quick Launch were three more floating cards. The HUD container is
now a single **installed desk** (full steel frame, bevel, recessed interior) with the
three panels as flush, divider-separated zones — same treatment as the side console.

## V2-D — Subtle rake, presents-when-operated
Per your "subtle rake only" choice: the side console is **installed at a gentle angle**
(`rotateY(-5°)` in perspective) so it reads as a physical surface in the room, not a
flat rectangle facing the camera — and it **straightens to face you** (rotateY → 0) on
hover/focus, i.e. it presents itself when you operate it. Desktop + motion-allowed only;
reduced-motion and touch get the flat installed console. (The lower desk is left flat
because its container runs the boot-in entrance animation, which would override a CSS
rake; raking it reliably is deferred to a GSAP pass rather than risking a conflict.)

## V2-E — Navigation as architecture
The top **navigation bar no longer reads as a browser header**: its solid background
and bottom border are gone, replaced by a soft gradient that fades into the chamber and
a thin **etched seam** cut across the frame. The brand, destinations, search,
notifications, and clock are all unchanged and in place — the chrome simply belongs to
the environment now instead of sitting on top of it like a website header. (Removing the
bar's `backdrop-filter` is another perf win.)

## Files changed

- **`components/command/command-interactive.css`** — one marked "FORGEONIX V2 —
  CONSTRUCTED ENVIRONMENT (B–E)" block: side-console housing + flush zones, instrument-
  desk housing + flush zones, the rail rake (desktop/motion-gated), and the nav re-housing.
- *(No `.tsx` changes — every component renders exactly as before; only its CSS housing changed.)*

## Performance & accessibility

- **CSS only**, transform-only for the rake. **Net fewer blur layers** (removed
  `backdrop-filter` from the rail/desk zones and the nav) — a perf improvement.
- **Reduced motion / touch:** no rake (flat installed consoles); everything legible and static.
- **Geometry untouched:** the stage, reactor, bays, and connection lines are not affected
  by any of these rules.

## Confirmation — nothing functional changed

No business logic, Supabase, API, route, module, or component-contract change. Terminal,
Quick Actions, AI Chat, Network, Health, Resources, Quick Launch, nav, search, and
notifications all behave and contain exactly what they did — they're re-housed, not re-wired.

## Verification

- `npm install` (GSAP) if needed, then `npm run lint` && `npm run build`.
- Open `/command`: the right side should read as one installed equipment stack (slightly
  angled, straightening when you mouse over it); the bottom HUD as one installed desk; the
  top nav as an etched part of the frame rather than a browser bar. Confirm terminal/chat
  scroll and quick-launch still work, and that text in the consoles is readable. Toggle
  reduce-motion → flat consoles, all functional.

## Next

- **V2-F** — hierarchy, lighting & hardening pass (depth grading, specular tuning, and a
  60fps / reduced-motion / a11y sweep). Optional within F: re-house the bottom **dock** as
  part of the chamber base, and a GSAP-based rake for the lower desk (avoiding the
  boot-animation conflict) if you want the desk angled too.
