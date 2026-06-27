# Command Center — Navigation Functionality Audit (done)

Made every visible nav/quick-launch/dock button honest and clickable. Inactive buttons now
either open an existing screen/state or a clearly-labelled placeholder. Presentational
view-state only.

## Files changed (4)
- **`components/command/CommandView.tsx`** (new) — a placeholder overlay that renders the
  Modules / Telemetry / Logs / Network / Terminal / Config views with a "← Bridge" back
  button. Placeholders are clearly marked "not connected yet" / "planned."
- **`components/command/CommandShell.tsx`** — added a `view` state (default `bridge`), nav/
  quick-launch/dock click handlers, and renders the overlay when `view !== "bridge"`.
- **`components/command/StageHudPanels.tsx`** — Quick Launch tiles now accept an `onLaunch`
  callback.
- **`components/command/SystemDock.tsx`** — dock items now accept an `onSelect` callback.

## What each item now does
**Top nav**
- **Bridge** → the main dashboard (default).
- **Modules** → a module directory (grid of all 9 modules); clicking one opens that module's
  existing panel on the bridge.
- **Telemetry** → system metrics overview using only the existing values (real NODES count +
  the already-"sim"-labelled CPU/MEM/NET), with a "live telemetry not connected yet" note.
- **Logs** → command log **placeholder** ("not connected yet" — no log data is persisted),
  listing the event types planned for later.
- **Forgeonix.dev** → external link (unchanged).

**Quick Launch (stage HUD)**
- **Infrastructure** → opens the **existing** Infrastructure module panel on the bridge.
- **Terminal** → terminal-style **placeholder** panel ("not connected yet"; no commands run).
- **Network Map** → network map **placeholder** ("planned — not the final map"), listing the
  future nodes (Forgeonix OS, Liftboard, Blackgate, Solea, Supabase, Vercel, Cloudinary,
  Zoho Mail, n8n, Home Assistant, Portainer, Uptime Kuma, Tailscale, AdGuard, homelab nodes).
- **System Config** → settings **placeholder** ("not connected yet"; planned settings listed).

**System dock (also wired)**
- HOME → bridge, MOD → modules, TERM → terminal, NET → network, CFG → config,
  EXIT → site link (unchanged).

## Honesty guarantees
- No fake live data. Telemetry only reuses existing values (NODES real; CPU/MEM/NET clearly
  "sim"). Logs explicitly state no data exists yet. Network map is a static legend, not a
  live graph. Every placeholder says "not connected yet" or "planned."
- The header and dock stay visible/usable above the overlay, so you can always switch views
  or return to the bridge.

## Preserved behavior
- Module card clicks, selection, expansion, and the module panels are unchanged
  (`handleModuleSelect` and the panel registry untouched).
- Quick Launch "Infrastructure" routes to the real existing Infrastructure panel.

## Explicit confirmation
No database/Supabase, API, auth, schema, routing, business-logic, or dependency changes.
This is purely client view-state + presentational components. No logging system, no
network map engine, and no new data were created.

## Verification
- Run `npm run lint` && `npm run build`.
- On `/command`: click each top-nav item, each Quick Launch tile, and each dock item — every
  one now does something (real screen or a clearly-labelled placeholder), and "← Bridge"
  returns to the dashboard.
