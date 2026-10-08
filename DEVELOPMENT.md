# Victoria 2026 Trip App — Development Log

## Scope (target: installed on both phones before Fri Oct 9, 2026)

1. Four-day itinerary (Oct 9–12) with expandable day cards driven by `dayData`
2. Race Day + Birthday as a combined themed Sunday (race accent + birthday accent)
3. Offline-first PWA (cache-first SW, static weather fallback)
4. Travel & Stays card, Resources (Canada-specific), packing list
5. Metric-first weather/distances with imperial alongside

## Session Log

### Session 1 — September 27, 2026

**Context gathered**
- Read london-2026's `CLAUDE.md`, `ARCHITECTURE.md`, `KNOWN-ISSUES.md`, `DEPLOY.md`, `sw.js`, `manifest.json`, and the relevant parts of `index.html` (dayData shape, renderer, weather, race mode, version tag).
- From Gmail (David's account):
  - **Fairmont Empress** conf QNSPDWPW, Oct 9–12, Deluxe City View King, check-in 4 PM / out 11 AM, CAD 3,081.34 pay-at-hotel.
  - **FRS Clipper** booking #1086760 (Jul 26) — details in an attached PDF we couldn't open → times left TBD.
  - **Race Roster** conf 58320020 — 2026 Royal Victoria Marathon (Outway Half). David asked RVM for a medium shirt in July.
  - **Il Terrazzo** birthday dinner (booked by Paula) — Sun Oct 11, 6:15 PM, 2 guests, conf 6Y4FP44B2826, 555 Johnson St.
- From runvictoriamarathon.com: half starts **Sun Oct 11, 8:15 AM**, Legislative grounds; expo at Crystal Gardens (713 Douglas) Fri 11–6 / Sat 9–6; gear check tent opens 6 AM; aid at 5 / 9.5 / 12 / 16 / 19 km, caffeine at 13 km; 3 h 30 limit; RTRT.me tracking. Road closures Sat 10 AM → Sun 7 PM on Belleville (Oswego→Government) and Menzies.

**Decisions**
- **Race Day and Paula's birthday are the same day (Sun Oct 11).** The brief imagined two separate themed days, but the race is always Thanksgiving-weekend Sunday and Paula's dinner reservation is that evening. One combined card with a `--race` → `--bday` gradient border, a race banner that flips to "birthday mode" after the race, and birthday-accented stops.
- **Monday is Canadian Thanksgiving** → holiday badge + closure warnings.
- Hotel is ~300 m from the start line → gear check marked optional, wake-up at 5:45.
- **Plan filled with clearly-marked suggestions** (`suggested: true`) rather than blanks, since David asked for help planning the rest. Anything factual but unknown is `tbd` — no invented times/confirmations except the typical Clipper sailing times, which are flagged ⚠️.
- Pace-sensitive placement: Craigdarroch by cab on Saturday (uphill), Butchart on Monday (flat recovery walk, bags held at bell desk), whale watching left in "Ideas" (seasickness risk pre-race).
- **New palette "Inner Harbour"**: Pacific blue / Douglas fir / Butchart bloom, race accent `--race`, birthday accent `--bday`; full dark-mode set.
- **Metric-first**: °C primary + °F pill; distances "~500 m · 0.3 mi".
- Canada specifics: passport only (no eTA/visa), CAD + ~12% GST/PST note, drive on the right / km/h note (no rental planned), 811 HealthLink BC.
- **No surprise/gift content in the app** — Paula has it on her phone too.

**Improvements over the London codebase**
- SW no longer caches Open-Meteo responses or `sw.js?nocache=…` (London's generic "cache every GET 200" meant cache-first served the first weather response forever and accumulated one cache entry per version check).
- Checklist keys use day + stop-name slug + item slug instead of stop index, so inserting a stop doesn't reassign saved checkmarks.
- localStorage access wrapped in try/catch (private mode).
- Ticket buttons use data attributes + delegated listener instead of inline `onclick` string interpolation.

**Verified (headless Chromium, 390×844)**
- Light + dark render; 4 cards, 35 stops, 24 checklist items, 20 packing items; no page errors.
- Live weather populated from Open-Meteo; offline reload served from cache with "Oct average" fallback.
- Checklist state persists across reload; SW controls page with cache `victoria-2026-v1`.

**Next**
- Clipper PDF → times + ticket viewer (KNOWN-ISSUES #1).
- Bib/corral/goal pace once RVM emails them (#2).
- Book / confirm suggested items, especially Sunday afternoon tea (#3).
- Create GitHub repo + Pages; set up deploy copy per `DEPLOY.md`.

### Session 2 — September 27, 2026 (deploy v1)

**David's input:** goal 2:00; no afternoon tea; "create the repo and all that stuff — I want to be minimally involved"; dropped the Clipper booking PDF into the folder.

**Changes**
- **Goal pace 2:00** (5:41/km · 9:09/mi): walk-to-start says join the 2:00 pace team; start stop shows pace; finish moved to ~10:15 AM; race banner gains Pace / Paula / Finish chips; in-race subtitle shows goal finish; Travel card shows goal.
- **Paula's cheer window 9:40–10:00 on Dallas Road** — an *estimate* (Dallas Road stretch starts after ~13 km; RVM publishes no per-location times). Kept a `tbd` for the exact spot.
- **Afternoon tea removed** (David doesn't want it). Replaced with a casual 12:30 post-race lunch (TBD) — lighter, since the birthday dinner is at 6:15.
- **Clipper details from the booking PDF:** 8:00→11:00 AM out, 5:00→7:45 PM back, Victoria Clipper V, Comfort class; check-in opens 1 h prior, onboard 15 min prior; online check-in from Oct 2 (added to packing checklist); bag fees, card-only onboard, terminal phones. All Clipper ⚠️ TBDs cleared. Friday stops after arrival shifted +15 min; Monday "collect bags" set to 3:45 PM.
- **Red Fish Blue Fish swapped out** — the Clipper PDF's terminal map marks it "temporarily closed". Friday lunch suggestion is now Victoria Public Market.

**Decisions**
- **Clipper PDF not deployed.** It contains Paula & David's home address, and GitHub Pages is public. Kept in the editing copy, git-ignored; no ticket button (boarding passes come from online check-in anyway).
- Deploy copy at `C:\Users\hensl\repos\victoria-2026` (mirrors London), public repo `1davidhensley/victoria-2026`, Pages from `main` root. Kept `CACHE_NAME` at v1 because v1 had never been deployed.

### Session 3 — October 4, 2026 (deploy v2: Paula's plan, car-free)

**Input:** Paula's email "Victoria Weekend Itinerary: Friday to Monday" (Oct 4) plus David: **no car this trip**. Her plan replaced most of our `suggested` placeholders; we kept the structural pieces (Clipper, expo checklist, shakeout, race-prep, race timeline, Il Terrazzo).

**Changes**
- **Fri:** lunch moved before bib pickup (Paula's order; expo is open 11–6). Inner Harbour walk became her **Beacon Hill Park + Dallas Road bluffs** fall-colour stroll. Fisherman's Wharf dinner became **"Inner Harbour or Chinatown, early night"**, with the Wharf as a side option.
- **Sat:** **Craigdarroch → Hatley Castle & Park by Uber** (~25–30 min). Gardens open 10 am to dusk and free; castle tours are over for the season, so grounds only. Added an optional **Fort Rodd Hill / Fisgard Lighthouse / Esquimalt Lagoon** stop (fort open daily 10–5 until Oct 15). Afternoon is **Royal BC Museum, Fan Tan Alley, or rest**. Munro's moved to Sunday.
- **Sun:** **Paula cheers near the finish** (her call), not on Dallas Road. Updated the stop, race-banner chip and expo checklist. Afternoon is now: rest at the hotel → **Munro's + Government St** → optional **Empress bar** (Q at the Empress daily 11–midnight; Lobby Lounge Sun 11–9) → **Uber both ways to Il Terrazzo** (`transportDir`).
- **Mon:** **Butchart → morning whale watching** from the Wharf St docks (walkable). Aim for a ~10 am departure. Prince of Whales' 12:30 half-day boat would get back too close to the 4:00 Clipper check-in. Flexible-cancel notes: Orca Spirit 24 h; PoW "Ticket Assurance". Bags collected 3:30 (was 3:45) so check-in isn't a rush.
- **Resources:** new "No car" row; Uber pickups on Government St during the Belleville closure (Sat 10 am – Sun 7 pm). The drive-on-the-right row is gone. Ideas now: Butchart, Craigdarroch, Fisherman's Wharf (the old ideas are scheduled now).

**Sources / confidence** (researched Oct 4)
- RVM expo hours/location and road closures: verified on runvictoriamarathon.com for 2026.
- Hatley, Fort Rodd Hill, Q / Lobby Lounge, Royal BC Museum hours: official sites, year not stated.
- Munro's Sunday 9:30–6 and whale-watch departure times: third-party listings only, so the text says so.
- Whale watching on Thanksgiving Monday: **unconfirmed** → `tbd`.

### Session 4 — October 7, 2026 (deploy v3: Paula's updates)

**Input (via David, from Paula):** drop whale watching; rent bikes Saturday morning near the Empress and ride the **Galloping Goose to Hatley Castle**, with lunch out that way; add two card shops, **Colossal** and **Epic Games**; pizza Saturday at **Dough Eyes**.

**Changes**
- **Sat:** Hatley by Uber became **Cycle BC e-bikes** (685 Humboldt St, right behind the Empress, 9–5 daily) → Galloping Goose (~14.5 km / 9 mi each way, ~1 h) → Hatley gardens → **Six Mile Pub** lunch (on the Goose in View Royal, about halfway home) → **Colossal Cards & Collectables** (101-515 Chatham, near the Goose's end at the Johnson St Bridge) → **Epic Games & More** (776 Hillside) → bikes back by 5 → **Dough Eyes** (530 Pandora) at 5:30. Shakeout is now optional, and breakfast is 8:15. The Fort Rodd Hill stop and the museum/Fan Tan afternoon are gone; Esquimalt Lagoon is a note on the Hatley stop, and the museum and Fan Tan Alley moved to Ideas. Power Plates is dropped because Dough Eyes is the race-eve dinner.
- **Mon:** whale watching removed, replaced with a suggested Fisherman's Wharf stroll. The seasickness-tablet note is gone from breakfast, and the packing item now says Clipper only.
- **Resources:** "No car" row updated; new "Bikes" row.

**Decisions**
- **E-bikes recommended:** ~29 km round trip with gravel at the far end, the day before a half marathon.
- **Card shops on Saturday, on the bikes:** Colossal is a few blocks from where the Goose ends, and Epic (~2 km north) is easier by bike than on foot. Colossal is closed Mondays. If Saturday feels too full, both shops are open Friday too (Colossal 10–8, Epic 9–7).
- **Lunch at Six Mile Pub:** the only sit-down place on the route I could verify. Royal Roads' campus café (Habitat) looks weekday-oriented, so it isn't listed.

**Sources / confidence** (researched Oct 7)
- Cycle BC hours, rates and ID/deposit rules: cyclebc.ca.
- Epic Games hours (9–7 daily) and phone: epicgamesvic.com. Colossal hours: Apple Maps listing.
- Dough Eyes hours: AAA listing; OpenTable reservations exist. Six Mile Pub: Tourism Victoria (beside the Goose); Saturday opening is 10 or 11 am depending on the listing → `tbd`.
- Goose distance to Hatley (~9 mi): a third-party trail guide, not the CRD.

### Session 5 — October 7, 2026 (deploy v4: bib)

- **Bib 8697**, from RVM's Oct 5 "Information Package" email. It's now in `travelData.race.bib`, the race-mode subtitle, the expo checklist, the walk-to-start stop and the RTRT note (event RVM26).
- **Corral `tbd` removed:** RVM assigns corrals by a colour stripe on the printed bib, matching the corral flags. The walk-to-start stop says so, and the start is on Menzies St beside the Legislative Buildings.
- Gear check needs your own bag plus the tear-off tag from the bib (same email).

### Session 6 — October 7, 2026 (deploy v5: is the bike route safe?)

**Question:** is the Saturday ride to Hatley safe? **Verdict:** mostly yes. It's separated trail and protected lanes, except for a short on-street detour, some road crossings, and the last approach to Epic Games.

**What's on the route (checked Oct 7):**
- Downtown → Goose: protected lanes on Humboldt and Wharf → Johnson St Bridge deck (signalized) → Harbour Rd two-way protected lane (2020).
- **CRD closure, Viaduct Park → Dupplin Rd** (Cecelia Ravine), Sept 23, 2026 to spring 2027. The bike detour, from the CRD's Sept 23 map, is Waterfront Cres → Gorge Rd E → Washington Ave → Dupplin Rd. The pedestrian detour is different. Another detour change is due "later this fall".
- Tillicum is still an at-grade signalized crossing (bridge construction starts spring 2027). McKenzie has a trail overpass.
- **CRD alert: Island Hwy → Watkiss Way** (350 m, MoTT bus-on-shoulder work), detoured via Watkiss Way, "reopen mid-October". The alert's year is ambiguous, so the app says "may still be detoured".
- Colwood's new trail bridge over the Island Hwy at Wale Rd opened April 2026 and replaces the old at-grade crossing.
- Royal Roads is at about km 15 (RRU). Paved to roughly km 13, then gravel. Sooke Rd is crossed at the lights by the RRU entrance (Aldeane).
- The Grange–Wilkinson closure (Oct 15–16) is after the trip and off the route.
- Forecast for Sat Oct 10 (Open-Meteo, Oct 7): 7–13.5 °C, 45% chance of ~1 mm, light wind. Friday is wet (5 mm), so expect damp trestle decking and leaves.

**Changes:** Hatley `transportDir` rewritten with the detours and crossings; distance corrected to ~16 km each way, ~30 km round trip (was 14.5). Bike stop now says to practise first and use a low assist level. Six Mile Pub is ~4 km back toward town, not "halfway" (CRD: Six Mile is km 11). Added Sawmill Taphouse (328 Wale Rd, AAA Sat 11–10) as a closer lunch. Epic stop warns about the Douglas/Hillside arterials.
