# Victoria 2026 Trip App — Architecture

## Overview

Offline-capable PWA trip guide for David & Paula's Victoria, BC weekend, **Fri Oct 9 – Mon Oct 12, 2026**:

- **Sat Oct 10** — pre-race day (shakeout, card shops, Royal BC Museum, pizza at Dough Eyes)
- **Sun Oct 11** — **Race Day + Paula's Birthday** (Royal Victoria Marathon's Outway Half, 8:15 AM; birthday dinner at Il Terrazzo 6:15 PM)
- **Mon Oct 12** — Canadian Thanksgiving; rental e-bikes on the Galloping Goose to Hatley Castle; Clipper home

Modeled on `1davidhensley/london-2026` (same single-file + SW + manifest shape), deployed independently to GitHub Pages from `1davidhensley/victoria-2026`.

## Why a single-file PWA (inherited decision)

- Installs from the browser ("Add to Home Screen"), no app store.
- Full offline support — the Clipper crossing and the race course have patchy signal.
- No build step: the simplicity is load-bearing for a non-technical deploy flow.
- Trade-offs accepted: no push notifications, no sync between phones.

## Components

### 1. `index.html` (UI + data + logic)
- **Hero** with trip countdown.
- **Sticky pill nav** — one pill per day (Sunday styled in `--race`) + Travel / Resources / Packing.
- **Day cards** rendered by `renderDayCards()` from `dayData`; expand/collapse; auto-expand + scroll to today during the trip.
- **Stops**: time pill, emoji, name/link, details, checklist, ⚠️ TBD line, "💡 Suggested" tag, reservation tag, Open-in-Maps button, ticket button, dashed walk transition (`walkTo`), transit callout (`transportDir`, Board/Ride/Exit icons).
- **Race Mode banner** (Sunday card) — on Oct 11 only: live countdown to 8:15 AM, then "race in progress", then "birthday mode" with the dinner. Dismissible per session.
- **Birthday note** + birthday-accented stops (`bdayStop`).
- **Weather bar** — °C primary, °F pill. Live from Open-Meteo (Victoria 48.4284, −123.3656, `America/Vancouver`), fallback `OCT_AVG` (14° / 7 °C, ~45% rain) labelled "Oct average".
- **Now badge** on the current stop (5-min refresh + on visibility change).
- **Travel & Stays** from `travelData` (Clipper legs, Empress, race entry).
- **Resources** from `resources` (entry docs, CAD, emergency, getting around, race links, unscheduled ideas).
- **Packing list** from `packingList` (checkbox only — not editable in v1).
- **Ticket viewer modal**, wired to `stop.tickets` via `ticketButton()` / `openTicketButton()`. `{ name, pdf }` opens a PDF in an iframe (`viewTicket`; none yet). `{ name, passes: 'out'|'ret' }` shows the Clipper boarding-pass QRs from `BOARDING_PASSES` (`viewPasses`). The same button is on each Clipper leg in Travel & Stays (`travelData.*.passes`). The QRs are inline `data:` PNGs (no files to cache) on `--qr-bg`, which is white in both themes, at 270px (3× the 90px source) with `image-rendering: pixelated`.
- **Version tag** in footer — installed cache vs deployed `CACHE_NAME`; turns `--race` colored when stale.

### 2. `sw.js`
- Pre-caches app shell + Google Fonts CSS; `skipWaiting` + `clients.claim`; deletes old caches on activate.
- Cache-first; navigation requests fall back to `./index.html` (`ignoreSearch` for navigations).
- Runtime-caches only same-origin files and Google Fonts.
- **Network-only** for `api.open-meteo.com` and `sw.js` (improvement over London, which cached both).

### 3. `manifest.json`
- Name "Victoria 2026 — Half Marathon & Birthday Trip", short "Victoria 26".
- Theme `#1f5f8b` (harbour), background `#f5f3ee` (paper). Standalone, portrait. Inline SVG 🇨🇦 icons.

## Data model

```js
dayData[i] = {
  number: 11,                   // day of month (Oct)
  date: 'Sunday, October 11',
  theme: '🏅 Race Day + Paula\'s Birthday',
  isRace, isBirthday, isHoliday, // optional flags → accents/badges
  weather: { hiC, loC, icon, desc, rain, live },
  stops: [{ time, emoji, name, details, link, mapsQuery, walkTo, walkMapsQuery,
            transportDir: { name, steps: [{ icon: 'board'|'ride'|'transfer'|'exit'|'walk', text }], time },
            checklist: [], tickets: { name, pdf } | { name, passes: 'out'|'ret' }, reservation: { bookedBy, partySize, conf },
            suggested, tbd, startLine, bdayStop }]
}
```

## Design system — "Inner Harbour"

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--paper` | #f5f3ee | #0e1418 | Page background |
| `--paper-2` | #ebe7de | #172028 | Inset blocks (transit callouts) |
| `--card` | #ffffff | #141c22 | Cards |
| `--ink` | #14212b | #eef1f2 | Primary text |
| `--ink-2` | #34434f | #c3ccd2 | Secondary text |
| `--ink-dim` | #6b7780 | #8a969e | Labels, tertiary |
| `--hairline` | #d9d4c8 | #26323b | Dividers |
| `--harbour` | #1f5f8b | #6fb0de | Pacific blue — primary accent, times, Maps buttons |
| `--harbour-soft` | rgba(31,95,139,.10) | rgba(111,176,222,.16) | Time pills, weather bar |
| `--fir` | #2e5e45 | #8cc7a2 | Douglas fir — walks, reservations, packing |
| `--fir-soft` | rgba(46,94,69,.12) | rgba(140,199,162,.14) | Reservation tag bg |
| `--bloom` | #b83b6e | #f08cb6 | Butchart florals |
| `--bloom-soft` | rgba(184,59,110,.10) | rgba(240,140,182,.14) | |
| `--race` | #d4531c | #ff8d5a | **Race Day accent** (Sunday card, banner, start line, stale version tag) |
| `--race-soft` | rgba(212,83,28,.12) | rgba(255,141,90,.16) | Race banner / start-line bg |
| `--bday` | → `--bloom` | → `--bloom` | **Birthday accent** |
| `--bday-soft` | → `--bloom-soft` | → `--bloom-soft` | |
| `--warn` | #9a6200 | #f0b64a | ⚠️ TBD lines, holiday badge |
| `--warn-soft` | rgba(168,106,0,.12) | rgba(240,182,74,.14) | |

Sunday's card border is a `--race` → `--bday` gradient.

**Typography:** Fraunces (display: hero, day numbers, race countdown) + Work Sans (body). Google Fonts, cached by the SW.

## Tickets

| Item | File | Day | Status |
|---|---|---|---|
| FRS Clipper booking #1086760 | — | Fri 9 / Mon 12 | **Deliberately not deployed** (the PDF has a home address and the site is public). Times and rules are copied into `dayData` and `travelData.clipperNotes`. |

## File structure

```
Victoria Travel App/
├── index.html       # The app
├── sw.js            # Service worker (CACHE_NAME = victoria-2026-vN)
├── manifest.json
├── tickets/         # (future) PDFs — add to ASSETS_TO_CACHE when added; never publish personal info
├── .gitignore       # keeps the Clipper booking PDF out of git
├── CLAUDE.md
├── ARCHITECTURE.md
├── DEVELOPMENT.md
├── KNOWN-ISSUES.md
└── DEPLOY.md
```

## Key constraints

1. **Offline-first** — nothing may hard-fail without signal.
2. **Phones first** — iOS Safari + Android Chrome PWA installs.
3. **Single file, no backend, no build.**
4. **Deadline** — trip starts Oct 9, 2026.
