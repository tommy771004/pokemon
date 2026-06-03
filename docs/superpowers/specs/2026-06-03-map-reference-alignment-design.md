# Exploration Map — Reference Alignment & Annotation Layer

**Date:** 2026-06-03
**Page:** `src/pages/Map.tsx` (route `/map`, ZH `/zh/map`)
**Reference:** https://pokopiaguide.com/zh/map

## Goal

Align the Exploration Map with the reference site without abandoning the project's
editorial narrative map. Keep the current cartography drawing style. Adopt the
reference's official region names, add an annotation layer (collectible legend),
and add interactive filters + visited-tracking. Fully responsive on mobile and
desktop.

Scope decisions (confirmed with user):
- **Augment, keep narrative** — keep the 11 curated narrative locations + current
  drawing style; layer reference annotations on top. Do NOT rebuild as a 95-marker
  tracker.
- **Adopt reference region names** in both ZH and EN.
- **Add all four features:** region filter, category(kind) filter, collectibles
  legend, collection(visited) tracking.
- **Add the 6th region** `凸隆隆礦山內 / Bulging Mine Interior` as a new location.

## Out of Scope

- Renaming regions in the other six data files (`characters.json`, `guide.json`,
  `pokedex.json`, `home.json`, `items.json`, `excluded_pokemon.json`). Directive
  #1 is map-page-scoped. Cross-page name sync is a **follow-up**, tracked but not
  done here.
- The reference's full 95 individual collectible markers placed on the map. We
  represent collectibles only as an aggregate legend, not as placed pins.

## Approach

Data-driven. All new game data lives in `public/data/map.json` per the CLAUDE.md
rule ("game data lives in `public/data/*.json`"). UI strings stay inline
(`en ? "..." : "..."`) matching the existing Map.tsx convention — no
`translation.json` changes. Reuse the existing `useFavorites(storageKey)` hook
for visited-tracking (it is a generic localStorage `Set<string>` toggle).

## Data Model Changes (`public/data/map.json`)

### 1. New top-level `regions[]` (canonical source of truth for region names)

```json
"regions": [
  { "id": "withered-wasteland",        "nameEn": "Withered Wasteland",        "nameZh": "乾巴巴荒野", "icon": "landscape", "color": "#a89a7c" },
  { "id": "gloomy-seaside",            "nameEn": "Gloomy Seaside",            "nameZh": "暗沉沉海邊", "icon": "water",     "color": "#3c6ca5" },
  { "id": "bulging-highlands",         "nameEn": "Bulging Highlands",         "nameZh": "凸隆隆山地", "icon": "terrain",   "color": "#a35a3a" },
  { "id": "bulging-mine",              "nameEn": "Bulging Mine Interior",     "nameZh": "凸隆隆礦山內", "icon": "diamond", "color": "#7a6a52" },
  { "id": "sparkling-floating-island", "nameEn": "Sparkling Floating Island", "nameZh": "閃閃浮島",   "icon": "cloud",     "color": "#5a9bbe" },
  { "id": "empty-town",                "nameEn": "Empty Town",                "nameZh": "空空鎮",     "icon": "home",      "color": "#4c785a" }
]
```

### 2. New top-level `collectibles[]` (annotation legend taxonomy)

```json
"collectibles": [
  { "key": "yellow-pokeball", "labelEn": "Yellow Poké Balls", "labelZh": "黃球",       "icon": "radio_button_checked", "count": 13, "color": "#dcae4a" },
  { "key": "red-pokeball",    "labelEn": "Red Poké Balls",    "labelZh": "紅球",       "icon": "radio_button_checked", "count": 12, "color": "#be5a4a" },
  { "key": "magazine",        "labelEn": "Magazines",         "labelZh": "雜誌",       "icon": "menu_book",            "count": 8,  "color": "#7a6a52" },
  { "key": "workbench",       "labelEn": "Workbenches",       "labelZh": "工作臺",     "icon": "handyman",             "count": 6,  "color": "#a35a3a" },
  { "key": "diary",           "labelEn": "Diaries",           "labelZh": "日記",       "icon": "auto_stories",         "count": 4,  "color": "#4c785a" },
  { "key": "note",            "labelEn": "Notes",             "labelZh": "便條",       "icon": "sticky_note_2",        "count": 3,  "color": "#bc8e44" },
  { "key": "newspaper",       "labelEn": "Newspapers",        "labelZh": "報紙",       "icon": "newspaper",            "count": 2,  "color": "#6b6b6b" },
  { "key": "letter",          "labelEn": "Letters",           "labelZh": "信件",       "icon": "mail",                 "count": 2,  "color": "#3c6ca5" },
  { "key": "pokemon-center",  "labelEn": "Pokémon Centers",   "labelZh": "寶可夢中心", "icon": "local_hospital",       "count": 1,  "color": "#be5a4a" },
  { "key": "document",        "labelEn": "Documents",         "labelZh": "文件",       "icon": "description",          "count": 1,  "color": "#5a9bbe" },
  { "key": "photo",           "labelEn": "Photos",            "labelZh": "照片",       "icon": "photo_camera",         "count": 1,  "color": "#a89a7c" }
]
```

Counts come straight from the reference category breakdown. The UI shows
`total = Σ count` (currently 53) — no fabricated grand total.

### 3. New per-location fields on every `LocationEntry`

- `regionId: string` — references one `regions[].id`.
- `kind: "region" | "special-site" | "megaproject" | "legendary-project" | "event"`.

Mapping for the 12 locations (11 existing + 1 new):

| location id | new nameEn / nameZh | regionId | kind |
|---|---|---|---|
| withered-wasteland | Withered Wasteland / 乾巴巴荒野 | withered-wasteland | region |
| mural-passage | (unchanged) | withered-wasteland | special-site |
| bleak-beach | Gloomy Seaside / 暗沉沉海邊 | gloomy-seaside | region |
| rocky-ridges | Bulging Highlands / 凸隆隆山地 | bulging-highlands | region |
| **bulging-mine (NEW)** | Bulging Mine Interior / 凸隆隆礦山內 | bulging-mine | region |
| sparkling-skylands | Sparkling Floating Island / 閃閃浮島 | sparkling-floating-island | region |
| huge-building | (unchanged) | sparkling-floating-island | megaproject |
| palette-town | Empty Town / 空空鎮 | empty-town | region |
| altar-of-flame | (unchanged) | empty-town | legendary-project |
| abandoned-power-plant | (unchanged) | empty-town | legendary-project |
| freezing-chambers | (unchanged) | empty-town | legendary-project |
| dream-islands | (unchanged) | empty-town | event |

Note: location `id`s do NOT change (would break the `useFavorites` keys, the
Huge Building / altar special-section guards in Map.tsx, and any deep links).
Only display `nameEn`/`nameZh` change. The special-section guards in Map.tsx
(`active.id === "huge-building"` etc.) are unaffected.

### 4. New location `bulging-mine` content

Full `LocationEntry` authored consistent with game lore (docs/info3.md): the
mining interior beneath Bulging Highlands — smelting copper/iron ore into ingots,
crystal-shard extraction, Onix/Geodude/Golem excavation crews, supplying the
heavy materials the Skylands megaprojects and legendary altars consume. Position
near the highlands marker (approx `x: 52, y: 52`), `icon: "diamond"`,
`type: "region"`. All bilingual fields populated (summary, description,
objectives, skills, resources, notable pokémon, unlocks, tags, tagIcons,
sourceLinks).

### 5. In-prose rename touch-ups

Update `statusTickerEn/Zh` and any in-prose self-reference to a renamed region
*inside that region's own entry* (e.g. Gloomy Seaside's description should not
still say "Bleak Beach"). Cross-references from other entries are left if they
read naturally; the canonical names live in `regions[]`.

## UI Changes (`src/pages/Map.tsx`)

Drawing style is untouched: `MapBackdrop`, the absolute-positioned markers, the
status marquee, and the detail modal all stay as-is.

### Filter bar (new, above the map+index grid)

- Region chips: 6, from `regions[]`. Multi-select (none selected = show all).
- Kind chips: 5 (`region`, `special-site`, `megaproject`, `legendary-project`,
  `event`). Multi-select.
- "Hide visited" toggle switch.
- Active filters apply to BOTH the map markers (`locations.map`) and the index
  cards (right column). A location shows when it matches the region filter AND
  the kind filter AND (not hidden by the visited toggle).
- State: `useState<Set<string>>` for `regionFilter` and `kindFilter`.

### Collection (visited) tracking

- `const { favorites: visited, toggleFavorite: toggleVisited } = useFavorites("pokopia-map-visited")`.
- Each index card gets a visited toggle button (check icon); visited cards get a
  muted/"stamped" treatment. Map markers for visited locations get a check badge.
- "Hide visited" filter removes visited locations from map + index.
- A small counter: `visited.size / locations.length`.

### Collectibles legend panel (new)

- New section rendered from `collectibles[]`, placed under the map column (or in
  the index column on desktop). Styled with existing tokens: `bg-paper`,
  `hairline-border`, `font-mono-metadata`, material-symbols icons, per-row color
  swatch. Header shows `Σ count` total.

## Responsive (mobile + desktop)

The page is already a `grid-cols-1 md:grid-cols-12` layout. New elements follow
the same responsive discipline:

- **Filter bar:** chips wrap (`flex flex-wrap gap-2`). On mobile (`< sm`) the
  region + kind groups stack vertically with small section labels; on `md+` they
  sit on one row. Tap targets ≥ 36px high. If chip rows get tall on mobile, the
  bar stays scrollable rather than pushing the map far down.
- **Collectibles legend:** `grid-cols-2 sm:grid-cols-3 lg:grid-cols-2`
  (two columns on phones, denser on small tablets, two within the narrower
  desktop side column). No fixed pixel widths.
- **Visited toggle / chips:** touch-friendly hit area, `active:` + `hover:`
  states (hover-only affordances avoided on touch).
- **Index cards & modal:** unchanged (already responsive).
- Verify at 360px, 768px, 1280px widths.

## Error / Edge Handling

- `data.regions` / `data.collectibles` optional-chained with `?? []` so an older
  cached `map.json` without the new arrays still renders (filters/legend just
  hide). Keeps deploys safe during the data/code rollout window.
- A location with a `regionId` not present in `regions[]` still renders (region
  filter simply won't match it) — no crash.
- localStorage failures already swallowed inside `useFavorites`.

## Testing

- No test runner configured. Correctness gate: `npm run lint` (tsc `--noEmit`).
- Manual: `npm run dev`, then verify —
  1. Region names render as the reference names (ZH + EN toggle).
  2. New Bulging Mine Interior location appears on map + index, opens modal.
  3. Region + kind filters narrow both map markers and index cards; combined
     filters AND correctly; clearing shows all.
  4. Visited toggle persists across reload; "hide visited" works.
  5. Collectibles legend totals = Σ counts.
  6. Layout intact at 360 / 768 / 1280 px.

## Files Touched

- `public/data/map.json` — `regions[]`, `collectibles[]`, per-location
  `regionId`/`kind`, new `bulging-mine` entry, renames, ticker.
- `src/pages/Map.tsx` — types, filter bar, visited tracking, legend, responsive
  classes. Reuses `src/hooks/useFavorites.ts` (no change).
