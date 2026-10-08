# CLAUDE.md

Guidance for Claude Code working in this repository.

## Project Overview

Progressive Web App for David & Paula's Victoria, BC trip (**Fri Oct 9 – Mon Oct 12, 2026**): the Royal Victoria Half Marathon and Paula's birthday — **both on Sunday Oct 11**. Travel is FRS Clipper from Seattle; hotel is the Fairmont Empress.

Sibling of `1davidhensley/london-2026` and modeled on its patterns — but an **independent repo and deploy** (`1davidhensley/victoria-2026` → GitHub Pages). Nothing is shared at runtime.

No build step, no package manager, no framework: a **single `index.html`** (all markup, CSS, JS inline) + `sw.js` + `manifest.json`. Context lives in `ARCHITECTURE.md`, `DEVELOPMENT.md` (dated session log — read it for *why*), `KNOWN-ISSUES.md`, and `DEPLOY.md`.

## Common Commands

```bash
python -m http.server 8000   # then open http://localhost:8000/
```

Testing SW changes: hard-reload (Ctrl+Shift+R) or DevTools → Application → Service Workers → "Update on reload".

## Deployment — MANDATORY checklist

1. Make changes in the **editing copy** (see `DEPLOY.md` for paths).
2. Test locally (incl. offline: DevTools → Network → Offline, reload).
3. **Bump `CACHE_NAME` in `sw.js`** (`victoria-2026-v1` → `v2` …) on *every* deploy that touches `index.html`, `sw.js`, or anything in `ASSETS_TO_CACHE`. Without it, installed PWAs keep the old copy. This was the #1 bug source in the London app.
4. New cacheable asset (e.g. a ticket PDF)? Add it to `ASSETS_TO_CACHE` — and **only list files that exist** (`cache.addAll` fails the whole install on one 404).
5. Copy to the deploy copy, commit, push, verify the footer shows `App version: vN ✓`.

## Architecture essentials

- **`dayData` drives everything.** Days have `number` (date of month), `date`, `theme`, `weather`, `stops[]`, plus flags `isRace`, `isBirthday`, `isHoliday`. Stop fields: `time, emoji, name, details, link, mapsQuery, walkTo, walkMapsQuery, transportDir, checklist, tickets {name,pdf} or {name,passes:'out'|'ret'} (Clipper QRs in `BOARDING_PASSES`), reservation {bookedBy,partySize,conf}, suggested, tbd, startLine, bdayStop`. Edit data, not DOM.
- **Never invent facts.** Unknown times / confirmations go in `tbd: '…'` (renders a ⚠️ line). Ideas that aren't booked get `suggested: true` (renders "💡 Suggested, not booked").
- **Offline-first is a hard constraint.** Cache-first SW with navigation fallback to `index.html`. Live weather (Open-Meteo) falls back to `OCT_AVG`. The SW deliberately does **not** cache Open-Meteo or `sw.js` (London bug — see DEVELOPMENT.md Session 1).
- **Metric first.** °C / km primary, °F / mi in the smaller pill or parenthetical.
- **localStorage keys are namespaced:** `victoria2026-checked` (checklists, keyed by day + stop-name slug + item slug — not index, so inserting stops doesn't scramble state), `pack-vic-{id}` (packing). sessionStorage: `victoria2026-raceModeDismissed`.
- **Design tokens** in `:root` with a full `prefers-color-scheme: dark` counterpart — **every new color needs both**. Race accent is `var(--race)`, birthday is `var(--bday)`; never hardcode their hex.
- **Expand animation:** `.day-card.expanded .day-content { max-height: 50000px }` — not `none` (kills the transition), not small (truncates).
- **`typeof travelData`**, never `window.travelData` — top-level `const` doesn't attach to `window`.
- **Canada ≠ UK:** US passport only (no eTA/visa), CAD, drive on the right, Thanksgiving Monday Oct 12. Don't copy London's ETA/GBP content.
- Paula has the app on her phone — **don't put surprise/gift plans in it.**

## Working conventions

- Keep it single-file. No bundler, no modules.
- After any non-trivial change: dated entry in `DEVELOPMENT.md` (why, not just what); update `KNOWN-ISSUES.md` / `ARCHITECTURE.md` as needed.
- Bump the SW cache on every deploy.
