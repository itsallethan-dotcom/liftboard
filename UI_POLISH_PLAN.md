# Forgeonix OS — UI Polish Plan (Option A: CSS / SVG / tsparticles)

Goal: move the command center toward the eDEX-UI / Opera GX / Jarvis "you're inside a
real system" feel — atmosphere, a living reactor core, depth, motion, and an experience —
while preserving 100% of existing functionality.

Hard rules: **visual only.** No schema, API, auth, or business-logic changes. No new
modules, Jarvis, agents, n8n, or new dependencies (no three.js). Reuse what's already
installed: `@tsparticles/react` + `@tsparticles/slim`, `framer-motion`, `howler`.

Cross-cutting (applies to every chunk):
- Full `prefers-reduced-motion` support — a static/lite fallback for all animation.
- Performance budget — capped particle counts, GPU-friendly transforms (`transform`/
  `opacity` only), `will-change` used sparingly, no layout thrash; throttle on resize.
- Each chunk is independently revertible.

Existing scaffolding we build on (so this is mostly enhancement, not new construction):
`CoreReactor.tsx`, `ReactorChamber.tsx`, `CoreNode.tsx`, `CommandCenterBackground.tsx`,
`ParticleBackground.tsx`, `ConnectionLines.tsx`, `ModuleSparkline.tsx`, `PanelCorners.tsx`,
`HudPanel.tsx`, `BootOverlay.tsx`, `lib/sounds.ts`, `lib/home-motion.ts`.

---

## Chunk 1 — Atmosphere + reactor core
Goal: deeper background (grid/radial/scanlines/vignette + subtle particle field) and a
living 2.5D reactor (layered orbital rings, breathing glow, particle halo, pulse).

| File | Change | Risk |
|---|---|---|
| `app/globals.css` (command section) | Tune `.command-bg__*`, `.command-core`, reactor keyframes; add depth/glow layers, reduced-motion guards | Med (large shared file; changes scoped to `command-*`/`forgeonix-os`) |
| `components/command/CoreReactor.tsx` | Add orbital ring layers + pulse + halo | Low |
| `components/command/ReactorChamber.tsx` | Compose reactor + particle halo behind `CoreNode` | Low |
| `components/command/CoreNode.tsx` | Glow/border/typography polish only (no data changes) | Low |
| `components/command/CommandCenterBackground.tsx` / `ParticleBackground.tsx` | Add a capped, slow particle field (tsparticles slim) with reduced-motion off-switch | Med (perf — mitigated by low counts + fps cap) |
| `components/command/CommandStage.tsx` | Mount the reactor/particles behind the stage (markup only) | Low |

Chunk risk: **Medium** (perf + large CSS file). Verify: 60fps feel on desktop, reduced-motion renders static, boot still completes, no layout shift of nodes.

## Chunk 2 — Module nodes + connection pulses
Goal: richer module cards (icon, status dot, sparkline, hover/selected depth) and animated
energy pulses flowing along the core→node connection lines.

| File | Change | Risk |
|---|---|---|
| `components/command/ModuleNode.tsx` | Card polish: hierarchy, status dot, hover/selected glow; re-enable sparkline strip | Low |
| `components/command/ModuleBusPanel.tsx` | Match node styling in the left rail list | Low |
| `components/command/ModuleSparkline.tsx` | Decorative/real sparkline rendering polish | Low |
| `components/command/moduleMeta.ts` | Repopulate per-module accent/sparkline (decorative or activity-derived; no data-model change) | Low |
| `components/command/ConnectionLines.tsx` | Animated pulse particles along existing measured paths | Med (SVG animation over existing geometry) |
| `app/globals.css` (connection rules) | Pulse keyframes; **remove 4 stale `leads`/`ai-ops` selectors** | Low |
| `components/command/command-interactive.css` | `.command-module` polish tokens | Low |

Chunk risk: **Medium** (ConnectionLines ties into the layout-measuring logic in `CommandStage`; visual-only, geometry untouched). Verify: 9 nodes still position correctly, pulses follow lines, no perf regression.

## Chunk 3 — Panel polish + table/form readability + states
Goal: unify the inline-styled panels onto the design system; consistent tabs, badges,
tables, forms; proper loading / empty / error states.

| File | Change | Risk |
|---|---|---|
| `components/command/command-interactive.css` | Add shared classes: tabs, badge/status-dot, table, input/select, empty/loading/error, metric chip | Low |
| `components/command/ModuleHubShell.tsx` | Shared `Loading` (skeleton/spinner), `EmptyState`, error styling | Low |
| `components/command/panels/InfrastructurePanel.tsx` | Replace inline styles with classes; tabs/badges/tables | Med (surface area) |
| `components/command/panels/BusinessPanel.tsx` | Same: tabs, pipeline cards, table, stat chips, empty states | Med (largest panel) |
| `components/command/panels/AiMemoryPanel.tsx` | Same | Med |
| `panels/ProjectsPanel/FinancePanel/AutomationsPanel/HealthPanel/CareerTrackerPanel` | Badge/empty-state consistency (light touch) | Low |
| `components/command/NotificationCenter.tsx` / `GlobalSearch.tsx` / `QuickActionsPanel.tsx` | Move inline styles to shared classes | Low |
| `app/command/infrastructure/{assets,roadmap,docs}/page.tsx` | Table readability: row height, hover, aligned numbers, sticky header | Low |

Chunk risk: **Medium** (touches many files, but each change is presentational; no logic). Verify: every panel renders, all actions still work, mobile/responsive cleanup holds.

## Chunk 4 — Boot experience + screen transitions
Goal: boot that feels like entering an environment; smooth transitions between Bridge /
Modules / Telemetry / Logs.

| File | Change | Risk |
|---|---|---|
| `components/command/BootOverlay.tsx` | Typed lines, progress ramp, fade-to-bridge polish (keep the run-once timer fix intact) | Med (boot previously had a loop bug — preserve current effect structure) |
| `components/command/CommandShell.tsx` | Lightweight view-state for nav (Bridge/Modules/Telemetry/Logs) + `framer-motion` crossfades; **presentational only** | Med (adds view switching; no data/route changes) |
| `app/globals.css` | Boot + transition keyframes, reduced-motion guards | Low |
| `lib/home-motion.ts` | Shared motion variants (optional) | Low |

Chunk risk: **Medium** (boot sensitivity + new view-switch state). Verify: boot plays once → reveals bridge → never loops; nav transitions smooth; reduced-motion = instant swap.

## Chunk 5 — Optional sound (behind a mute toggle, default OFF)
Goal: subtle ambience/clicks/boot chime for immersion — strictly opt-in.

| File | Change | Risk |
|---|---|---|
| `lib/sounds.ts` | Define/guard sound cues via `howler`; respect autoplay policy | Low |
| `components/command/SystemDock.tsx` (or nav) | Mute/unmute toggle, persisted in `localStorage` | Low |
| `components/command/CommandShell.tsx` | Trigger cues on boot/selection (gated by toggle) | Med (must default off; honor reduced-motion/quiet) |

Chunk risk: **Low–Medium** (opt-in, default silent). Verify: silent by default, toggle works, no autoplay errors, no audio under reduced-motion.

---

## Files NOT touched (guardrails)
No migrations, no `lib/os/*` data layer, no `app/api/*` routes, no `lib/auth/*`, no
`types/*` data shapes, no `proxy.ts`. Purely CSS, presentational components, and the
already-installed animation/sound libs.

## Suggested sequencing & checkpoints
Build one chunk per session given limits; after each: `npm run build` + `npm run lint`,
click through `/command`, verify reduced-motion + perf, then a short `UI_CHUNK_N.md`
note. Recommended order is 1 → 2 → 3 → 4, with 5 optional/last.

## Risk summary
| Chunk | Risk | Main concern | Mitigation |
|---|---|---|---|
| 1 Atmosphere + reactor | Med | particle perf, big CSS file | capped counts, fps cap, scoped classes |
| 2 Nodes + pulses | Med | connection geometry coupling | visual-only over existing measured paths |
| 3 Panels + tables/states | Med | file surface area | presentational, class-by-class |
| 4 Boot + transitions | Med | boot loop history, view state | preserve run-once timer; presentational nav |
| 5 Sound (optional) | Low–Med | autoplay/accessibility | default off, toggle, reduced-motion aware |
