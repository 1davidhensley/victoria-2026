# Victoria 2026 Trip App — Known Issues

## Open

### 2. Race details pending
- **Status:** Open (expected — RVM emails bib numbers the week of the race)
- **Missing:** Paula's exact cheer spot near the finish and the post-race family meeting spot (both from the expo site map). **Bib 8697** arrived Oct 5 (RVM info package); the corral is the colour stripe on the printed bib, so it's only known at pickup.
- **Known:** goal 2:00 (5:41/km, 9:09/mi) → finish ~10:15 AM (estimate). Paula cheers near the finish (her plan, Oct 4); RVM has no dedicated spectator area.
- **Where:** `travelData.race.bib`, race banner subtitle, Sunday stops with `tbd`.

### 3. Unbooked items in the plan
- **Status:** Open — plan items marked "💡 Suggested, not booked"
- **Needs a decision/booking:** Fri lunch + dinner, Sat breakfast, **Mon Cycle BC bikes** (reserve 2 for the day), **Sat Dough Eyes table** (OpenTable, early), Sun post-race lunch, Mon lunch.
- **Soft facts:** Munro's Sunday hours (Session 3); Colossal Cards hours (Apple Maps), Dough Eyes hours (AAA listing), Sawmill Taphouse / Six Mile Pub Thanksgiving-Monday hours (unconfirmed); Session 4/7.

### 4. Packing list isn't editable
- **Status:** By design for v1. London's editable list (`pack-dp-custom-list`) wasn't ported. Port it if Paula wants to edit on the phone.

### 5. Site is public — contains confirmation numbers
- **Status:** Accepted (same as london-2026)
- **Details:** GitHub Pages sites are public. The app shows hotel / dinner / race / Clipper confirmation numbers. None of these alone lets someone change a booking without the matching email/account, but don't add anything more sensitive (home address, passport numbers, payment info).
- **Clipper boarding-pass QR codes ARE public** (added v9, Oct 8). David was offered a passcode lock and chose no lock. The QRs carry an opaque token (`1,<token>#READY`), not names; boarding still needs passports. If this changes, swap `BOARDING_PASSES` for an encrypted blob plus a passcode prompt (WebCrypto AES-GCM), and note that git history keeps the old images.
- **The Clipper booking PDF is deliberately NOT deployed** — it contains a home address. It stays in the editing copy only (git-ignored). All useful content from it is in `dayData` / `travelData`.

## Resolved

### 1. Clipper sailing times unverified
- **Status:** Fixed (Sep 27, 2026, Session 2)
- **Fix:** David dropped the booking PDF into the project folder. Confirmed: Fri Oct 9 8:00 AM Pier 69 → 11:00 AM Victoria; Mon Oct 12 5:00 PM → 7:45 PM Seattle; check-in opens 1 h before, onboard 15 min before; online check-in opens Oct 2. Friday stops shifted +15 min after the 11:00 arrival.

## Carried-over lessons from london-2026 (preventive, not bugs here)
- **Stale PWA cache** → bump `CACHE_NAME` every deploy; footer version tag shows stale installs.
- **Truncated day cards** → `max-height: 50000px` on expanded content.
- **`window.travelData` undefined** → use `typeof travelData`.
- **SW cached live API + `sw.js?nocache` responses** → Victoria SW treats Open-Meteo and `sw.js` as network-only.
