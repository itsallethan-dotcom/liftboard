# Forgeonix V2 — Chunk F: Hierarchy, Lighting & Hardening (done)

The finishing pass on Forgeonix V2. A light polish on the installed consoles plus a
full audit of the V2 work. This completes the V2 program (A–F).

## What changed (polish)

**Installed-metal sheen.** The side-console housing now carries a faint top-edge sheen
in its background (a thin white-to-transparent band), so it reads as a real metal
surface catching the chamber's ambient light rather than a flat dark panel. The lower
desk already has its inset top highlight from V2-C. Static, decorative, behind content.

## What was deliberately NOT changed (and why)

- **Lower-desk rake** — left flat. Its container runs the boot-in entrance animation,
  whose held end-transform overrides a CSS rake; doing it reliably needs a GSAP/inner-
  wrapper approach that's a blind gamble without a browser. The side-console rake already
  establishes the angled-surface language.
- **The dock** — left as-is. Its styling state is ambiguous from source alone (no
  `.command-dock` rules in the two source CSS files, only in stale build output), so
  re-housing it blind risks either no effect or an unexpected change. It needs live
  inspection first.

Both are noted as safe follow-ups once you can review the build in a browser — I chose
not to gamble on them sight-unseen.

## Full V2 audit (A–F)

**Environment model (the place):**
- Reactor is calm — never translates with the cursor (V2-A).
- The room reacts — atmospheric backdrop drift + a carried specular light (V2-A).
- Floating rectangles are gone — one installed side console (V2-B), one installed
  instrument desk (V2-C), both continuous housings with flush, divider-separated zones.
- The side console is installed at a subtle angle and presents itself when operated (V2-D).
- The top bar reads as an etched part of the chamber frame, not a browser header (V2-E).
- Installed-metal sheen + depth on the housings (V2-F).

**Performance:**
- Transform/opacity only across all V2 motion; `quickTo`/single tweens; no per-frame
  tween creation.
- **Net fewer GPU blur layers** than V1 — removed `backdrop-filter` from the rail/desk
  zones and the nav (V2-B/C/E). This is a performance *improvement*, not a cost.
- `will-change: transform` only on the moving room layers (backdrop, carried light),
  desktop only.

**Accessibility / reduced motion:**
- Every V2 motion (room drift, carried light, console rake) is inside a
  `prefers-reduced-motion: no-preference` gate (matchMedia or media query). Reduced-motion
  and touch users get a calm, still, flat, fully-legible environment.
- The Phase-7 keyboard focus ring still applies to all controls.

**Geometry safety:**
- The stage, reactor, bays, and connection lines are never transformed by any V2 rule —
  their measured geometry is untouched (V2-A actually removed the only thing that moved
  them).

**No functional change:**
- No business logic, Supabase, API, route, module, or component-contract change in any V2
  chunk. Every panel and control is re-housed/re-staged, never re-wired. Terminal, AI Chat,
  Network, Quick Actions, Health, Resources, Quick Launch, nav, search, notifications, the
  dock, and all data behave exactly as before.

## Files changed this chunk

- **`components/command/command-interactive.css`** — added the installed-metal sheen to
  the side-console housing background (one layer).

## Verification

- `npm install` (GSAP) if needed, then `npm run lint` && `npm run build`.
- Open `/command`: the consoles should read as installed metal equipment around a calm,
  dominant reactor in a reacting room; the nav as an etched frame element. Confirm all
  panels scroll/click, console text is readable, and reduce-motion yields a still, flat,
  legible scene.

## Forgeonix V2 — program complete

V2-A → V2-F are done. Forgeonix now reads as a **constructed environment** — a calm,
massive reactor in a chamber that reacts, surrounded by installed console structures
rather than rectangles on a page.

**Recommended next, with a live browser:**
1. Review the full V2 build and tune angles/lighting to taste.
2. Lower-desk rake via GSAP (avoiding the boot-animation conflict).
3. Re-house the dock as the chamber base.
4. The two long-deferred items from V1: module-card → panel Flip, and fuller per-module
   bay art.
