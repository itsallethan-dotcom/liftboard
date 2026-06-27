# Visual Overhaul — Phase 1: Typography & Spatial System (done)

*(Distinct from the original `PHASE1_COMPLETE.md`, which documents the Command
Center foundation. This is the visual-overhaul Phase 1.)*

The first *visible* phase, and the highest craft-per-effort. Establishes a real
two-voice type system, aligned numerals, crisp rendering, and a tokenized spatial
base — all **scoped to `.forgeonix-os`** so the marketing site is untouched.
Pure CSS. No motion, no layout restructure, no behavior change.

## What changed & why

**One machine voice.** The command center previously mixed `ui-monospace, monospace`
(32×) and `var(--font-geist-mono), monospace` for its data/telemetry text — an
inconsistent monospace voice. All of these now resolve to the single
`--fx-font-mono` token (Geist Mono → JetBrains Mono → system mono fallback). The
"machine voice" is now one consistent typeface everywhere.

**A display voice + the OS voice.** `.forgeonix-os` now explicitly sets the display
sans voice (`--fx-font-display`), and the heading tier (detail headers, row/form/
milestone/skill-group titles) is given the display voice with tighter tracking and
snug leading — so headings read as *designed* against the mono data, instead of
looking like more dashboard text.

**Aligned (tabular) numerals.** `.forgeonix-os` now renders all digits tabular
(`font-variant-numeric: tabular-nums; "tnum"`), so every column of telemetry,
metrics, counts, and timestamps lines up vertically. This is the single most
"instrument-grade" typographic signal and it's nearly free.

**Consistent caps tracking.** Uppercase system labels (module-bus label + detail
title, hub/career section labels) previously used a scatter of letter-spacings
(0.03–0.08em). They now share one consistent caps tracking (`--fx-track-label`,
0.08em) in the display voice — weight and colour left as-is.

**Crisp rendering.** Antialiasing + `optimizeLegibility` on the command root for
sharper small text.

**Tokenized spacing.** `.command-main` padding/gap is now expressed in the 4px
spatial system (`--fx-space-*`) at the *same pixel values* — the spatial rhythm is
now system-driven for future phases, with zero layout shift this phase.

## Files changed (2, CSS only)

- **`components/command/command-interactive.css`** — unified the mono voice
  (find/replace, command-scoped), and appended one marked **Phase 1** block: root
  type foundation (voices, tabular numerals, smoothing) + heading tier +
  system-label tier, all scoped under `.forgeonix-os`.
- **`app/globals.css`** — set `--fx-track-label` to `0.08em` (caps tracking), and
  tokenized `.command-main` padding/gap to `--fx-space-*` (values unchanged).

## Scope & safety

Everything is scoped to `.forgeonix-os` or lives in the command-only CSS file, so
the marketing site, resume, infrastructure public page, etc. are unaffected. No
React/TS touched, no business logic, Supabase, API, route, module, or
component-contract change. The expanded-panel readability sizing from the earlier
pass was deliberately **not** disturbed.

## Verification

- (If not already done for Phase 0) `npm install` — the repo now depends on GSAP.
- `npm run lint` && `npm run build` — Phase 1 is pure CSS; nothing here depends on GSAP.
- Open `/command`: data/telemetry now share one mono typeface; numbers align in
  columns; headings read crisper and more deliberate; uppercase labels are
  consistently tracked. Layout, positions, and behavior are unchanged.

## Next

Phase 2 — Depth & parallax environment: the three-plane depth model (background /
midground / foreground), subtle cursor parallax, and glass layering — the first
phase that introduces GSAP-driven motion and the "sense of place."
