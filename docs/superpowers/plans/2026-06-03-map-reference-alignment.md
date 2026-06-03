# Exploration Map — Reference Alignment & Annotation Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the Exploration Map page with pokopiaguide.com/zh/map — adopt official region names, add a new mine region, and layer in region/kind filters, a collectibles legend, and visited-tracking — without changing the existing cartography drawing style, fully responsive.

**Architecture:** Data-driven. New game data (`regions[]`, `collectibles[]`, per-location `regionId`/`kind`, new `bulging-mine` entry) lives in `public/data/map.json`. `src/pages/Map.tsx` reads it, derives a filtered location list, and renders new filter/legend/visited UI with existing Tailwind tokens. Visited state reuses the existing `useFavorites` localStorage hook.

**Tech Stack:** React 19 + TypeScript, Vite, Tailwind 4, i18next (inline `en ? ... : ...` strings — no translation.json changes). No test runner; correctness gate is `npm run lint` (tsc `--noEmit`) plus manual dev-server checks.

**Spec:** `docs/superpowers/specs/2026-06-03-map-reference-alignment-design.md`

**Note on verification:** This project has no unit-test runner (confirmed: CLAUDE.md says "No test runner is configured"). Each task is gated by `npm run lint` and explicit manual checks instead of automated tests. Commit after each green task.

---

## File Structure

- `public/data/map.json` — add two top-level arrays + per-location fields + one new location + renames. Single source of truth for all map game data.
- `src/pages/Map.tsx` — types, filter/visited state, derived `visibleLocations`, filter bar, visited UI, collectibles legend, responsive classes.
- `src/hooks/useFavorites.ts` — reused as-is, no change.

---

### Task 1: map.json — canonical `regions[]` + `collectibles[]` arrays, region renames, ticker

**Files:**
- Modify: `public/data/map.json`

- [ ] **Step 1: Add `regions[]` and `collectibles[]` as top-level keys.**

Insert immediately after the `"statusTickerZh": "..."` line (currently line 4), before `"locations"`:

```json
  "regions": [
    { "id": "withered-wasteland",        "nameEn": "Withered Wasteland",        "nameZh": "乾巴巴荒野",   "icon": "landscape", "color": "#a89a7c" },
    { "id": "gloomy-seaside",            "nameEn": "Gloomy Seaside",            "nameZh": "暗沉沉海邊",   "icon": "water",     "color": "#3c6ca5" },
    { "id": "bulging-highlands",         "nameEn": "Bulging Highlands",         "nameZh": "凸隆隆山地",   "icon": "terrain",   "color": "#a35a3a" },
    { "id": "bulging-mine",              "nameEn": "Bulging Mine Interior",     "nameZh": "凸隆隆礦山內", "icon": "diamond",   "color": "#7a6a52" },
    { "id": "sparkling-floating-island", "nameEn": "Sparkling Floating Island", "nameZh": "閃閃浮島",     "icon": "cloud",     "color": "#5a9bbe" },
    { "id": "empty-town",                "nameEn": "Empty Town",                "nameZh": "空空鎮",       "icon": "home",      "color": "#4c785a" }
  ],
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
  ],
```

- [ ] **Step 2: Rename the 4 region-type locations whose names differ.** (`withered-wasteland` already matches the reference EN/ZH — leave it.) Apply these exact field replacements:

`bleak-beach` entry:
- `"nameEn": "Bleak Beach"` → `"nameEn": "Gloomy Seaside"`
- `"nameZh": "荒涼海灘"` → `"nameZh": "暗沉沉海邊"`

`rocky-ridges` entry:
- `"nameEn": "Rocky Ridges"` → `"nameEn": "Bulging Highlands"`
- `"nameZh": "岩石山脊"` → `"nameZh": "凸隆隆山地"`

`sparkling-skylands` entry:
- `"nameEn": "Sparkling Skylands"` → `"nameEn": "Sparkling Floating Island"`
- `"nameZh": "閃耀空島"` → `"nameZh": "閃閃浮島"`

`palette-town` entry:
- `"nameEn": "Palette Town"` → `"nameEn": "Empty Town"`
- `"nameZh": "真新鎮"` → `"nameZh": "空空鎮"`

> Do NOT change any `"id"` values. Leave `summary`/`description` prose as-is in this step (handled in Step 3 only where it self-references its own renamed region).

- [ ] **Step 3: Update status ticker + in-prose self-references to the renamed regions.**

In `"statusTickerEn"` replace `BLEAK BEACH` → `GLOOMY SEASIDE`, `ROCKY RIDGES` → `BULGING HIGHLANDS`, `SPARKLING SKYLANDS` → `SPARKLING FLOATING ISLAND`, `PALETTE TOWN` → `EMPTY TOWN`.
In `"statusTickerZh"` replace `荒涼海灘` → `暗沉沉海邊`, `岩石山脊` → `凸隆隆山地`, `閃耀空島` → `閃閃浮島`, `真新鎮` → `空空鎮`.

Within the `bleak-beach` entry's own `summaryZh`/`descriptionZh`, replace the leading self-reference `荒涼海灘` → `暗沉沉海邊` and `summaryEn`/`descriptionEn` `Bleak Beach` → `Gloomy Seaside`. Do the same self-reference swap inside `rocky-ridges` (`岩石山脊`/`Rocky Ridges`), `sparkling-skylands` (`閃耀空島`/`Sparkling Skylands`), and `palette-town` (`真新鎮`/`Palette Town`) entries' own summary+description text. Leave cross-references from OTHER entries unchanged (they read naturally).

- [ ] **Step 4: Verify JSON is valid and the build still type-checks.**

Run: `node -e "JSON.parse(require('fs').readFileSync('public/data/map.json','utf8')); console.log('OK')"`
Expected: `OK`

Run: `npm run lint`
Expected: exit 0, no errors (Map.tsx ignores unknown JSON keys at runtime; types unchanged yet).

- [ ] **Step 5: Commit.**

```bash
git add public/data/map.json docs/superpowers/specs/2026-06-03-map-reference-alignment-design.md docs/superpowers/plans/2026-06-03-map-reference-alignment.md
git commit -m "feat(map): add canonical regions + collectibles data, adopt reference region names"
```

---

### Task 2: map.json — add `regionId`/`kind` to all locations + new `bulging-mine` entry

**Files:**
- Modify: `public/data/map.json`

- [ ] **Step 1: Add `regionId` and `kind` to each existing location.** Insert both keys right after the existing `"type"` line in each entry, using this mapping:

| location id | regionId | kind |
|---|---|---|
| withered-wasteland | withered-wasteland | region |
| mural-passage | withered-wasteland | special-site |
| bleak-beach | gloomy-seaside | region |
| rocky-ridges | bulging-highlands | region |
| sparkling-skylands | sparkling-floating-island | region |
| huge-building | sparkling-floating-island | megaproject |
| palette-town | empty-town | region |
| altar-of-flame | empty-town | legendary-project |
| abandoned-power-plant | empty-town | legendary-project |
| freezing-chambers | empty-town | legendary-project |
| dream-islands | empty-town | event |

Example (withered-wasteland): after `"type": "region",` add:
```json
      "regionId": "withered-wasteland",
      "kind": "region",
```

- [ ] **Step 2: Add the new `bulging-mine` location.** Insert this complete entry into the `locations` array immediately after the `rocky-ridges` entry's closing `},` and before `sparkling-skylands`:

```json
    {
      "id": "bulging-mine",
      "x": 52,
      "y": 53,
      "icon": "diamond",
      "type": "region",
      "regionId": "bulging-mine",
      "kind": "region",
      "levelEn": "MINE INTERIOR",
      "levelZh": "礦山內部",
      "categoryEn": "Underground Mine",
      "categoryZh": "地下礦坑",
      "nameEn": "Bulging Mine Interior",
      "nameZh": "凸隆隆礦山內",
      "summaryEn": "The excavation network beneath Bulging Highlands, where smelting and crystal extraction feed every late-game megaproject.",
      "summaryZh": "凸隆隆山地底下的開採網路，冶煉與水晶開採在此為後期所有大型工程供料。",
      "descriptionEn": "The Bulging Mine Interior is the industrial heart hidden under the Highlands. Once Ditto's Rock Smash is upgraded by the Burger Patty, the heavy metal blocks here finally give way, opening copper and iron veins, glittering crystal shards, and lava-warmed ore pockets. Onix carves the main shafts, Geodude and Golem clear rubble, and Magmar-fed furnaces turn raw ore into the ingots that the Huge Building and the three legendary altars consume by the dozens. Mastering this loop is what lets the endgame construction checks become routine instead of impossible.",
      "descriptionZh": "凸隆隆礦山內是藏在山地底下的工業心臟。當百變怪的碎巖被漢堡排強化後，這裡的重金屬塊才終於能被擊破，露出銅礦與鐵礦脈、閃爍的水晶碎片，以及被熔岩餘溫烘暖的礦囊。大巖蛇開鑿主礦道，小拳石與隆隆岩清理碎石，鴨嘴火獸供熱的熔爐把生礦煉成銅錠與鐵錠——而這些正是巨大建築與三座傳說祭壇成打成打消耗的材料。把這套迴圈練熟，終局的施工檢定就會從不可能變成例行公事。",
      "objectivesEn": [
        "Break the heavy metal blocks with upgraded Rock Smash.",
        "Open copper, iron, and crystal-shard veins.",
        "Smelt ore into ingots to stockpile for megaprojects."
      ],
      "objectivesZh": [
        "用強化後的碎巖擊破重金屬塊。",
        "打通銅礦、鐵礦與水晶碎片礦脈。",
        "將生礦冶煉成錠，為大型工程囤料。"
      ],
      "requiredSkillsEn": [
        "Upgraded Rock Smash",
        "Crush",
        "Smelting",
        "Resource stockpiling"
      ],
      "requiredSkillsZh": [
        "強化碎巖",
        "粉碎",
        "冶煉",
        "高階囤料"
      ],
      "resourceFocusEn": [
        "Copper Ore",
        "Iron Ore",
        "Crystal Shards",
        "Ingots"
      ],
      "resourceFocusZh": [
        "銅礦",
        "鐵礦",
        "水晶碎片",
        "金屬錠"
      ],
      "notablePokemonEn": [
        "Onix",
        "Geodude",
        "Golem",
        "Magmar"
      ],
      "notablePokemonZh": [
        "大巖蛇",
        "小拳石",
        "隆隆岩",
        "鴨嘴火獸"
      ],
      "unlocksEn": [
        "Stable ingot supply",
        "Crystal shard reserves",
        "Megaproject material pipeline"
      ],
      "unlocksZh": [
        "穩定金屬錠供應",
        "水晶碎片儲備",
        "大型工程材料供應線"
      ],
      "tagsEn": [
        "Mining",
        "Smelting",
        "Crystal",
        "Supply Chain"
      ],
      "tagsZh": [
        "採礦",
        "冶煉",
        "水晶",
        "供應鏈"
      ],
      "tagIcons": [
        "diamond",
        "local_fire_department",
        "hexagon",
        "conveyor_belt"
      ],
      "sourceLinks": [
        {
          "label": "Eurogamer Walkthrough",
          "url": "https://www.eurogamer.net/pokemon-pokopia-walkthrough"
        },
        {
          "label": "GameTyrant",
          "url": "https://gametyrant.com/news/pokmon-pokopia-team-initiation-challenge-guide"
        }
      ]
    },
```

- [ ] **Step 2b: Sanity-check icon names.** `hexagon` and `conveyor_belt` are valid Material Symbols. If any icon renders blank during the Task 7 manual check, swap to `view_in_ar` / `inventory`. (No action needed now.)

- [ ] **Step 3: Validate JSON + lint.**

Run: `node -e "const d=JSON.parse(require('fs').readFileSync('public/data/map.json','utf8')); console.log(d.locations.length, d.regions.length, d.collectibles.length)"`
Expected: `12 6 11`

Run: `npm run lint`
Expected: exit 0.

- [ ] **Step 4: Commit.**

```bash
git add public/data/map.json
git commit -m "feat(map): tag locations with regionId/kind, add Bulging Mine Interior region"
```

---

### Task 3: Map.tsx — types, imports, filter + visited state, derived `visibleLocations`

**Files:**
- Modify: `src/pages/Map.tsx`

- [ ] **Step 1: Add the `useFavorites` import.** After the existing `import ScrollFade ...` line (line 6) add:

```tsx
import { useFavorites } from "../hooks/useFavorites";
```

- [ ] **Step 2: Extend the types.** Add `regionId`/`kind` to `LocationEntry` (after its `type` field, ~line 18) and add new `Region`/`Collectible` types + extend `MapData`. Replace the `MapData` type block (lines 45-50) with:

```tsx
type Kind = "region" | "special-site" | "megaproject" | "legendary-project" | "event";

type Region = {
  id: string;
  nameEn: string;
  nameZh: string;
  icon: string;
  color: string;
};

type Collectible = {
  key: string;
  labelEn: string;
  labelZh: string;
  icon: string;
  count: number;
  color: string;
};

type MapData = {
  mapId: string;
  statusTickerEn: string;
  statusTickerZh: string;
  regions: Region[];
  collectibles: Collectible[];
  locations: LocationEntry[];
};
```

And in `LocationEntry`, add after the `type: "region" | "special";` line:

```tsx
  regionId: string;
  kind: Kind;
```

- [ ] **Step 3: Add a module-level KIND label map.** After the `POKEMON_ROSTER_POOL` const (after line 71) add:

```tsx
const KIND_META: Record<Kind, { en: string; zh: string; icon: string }> = {
  "region": { en: "Region", zh: "生態區域", icon: "public" },
  "special-site": { en: "Special Site", zh: "特殊據點", icon: "star" },
  "megaproject": { en: "Megaproject", zh: "大型工程", icon: "domain" },
  "legendary-project": { en: "Legendary Project", zh: "傳說工程", icon: "foundation" },
  "event": { en: "Event", zh: "隨機事件", icon: "shuffle" },
};
const KIND_ORDER: Kind[] = ["region", "special-site", "megaproject", "legendary-project", "event"];
```

- [ ] **Step 4: Add filter + visited state.** Inside `MapPage`, after the `const [showIndex, setShowIndex] = useState(false);` line (line 78) add:

```tsx
  const [regionFilter, setRegionFilter] = useState<Set<string>>(new Set());
  const [kindFilter, setKindFilter] = useState<Set<string>>(new Set());
  const [hideVisited, setHideVisited] = useState(false);
  const { favorites: visited, toggleFavorite: toggleVisited } = useFavorites("pokopia-map-visited");

  const toggleFilter = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };
```

> Note: `React` is already importable — add `import React, { useEffect, useState } from "react";` by changing line 1 from `import { useEffect, useState } from "react";` to include the default `React` import (needed for the `React.Dispatch` type annotation).

- [ ] **Step 5: Derive `regions`, `collectibles`, `visibleLocations`.** After the existing `const locations = data.locations ?? [];` line (line 155) add:

```tsx
  const regions = data.regions ?? [];
  const collectibles = data.collectibles ?? [];
  const collectiblesTotal = collectibles.reduce((sum, c) => sum + c.count, 0);
  const visibleLocations = locations.filter((loc) => {
    const regionOk = regionFilter.size === 0 || regionFilter.has(loc.regionId);
    const kindOk = kindFilter.size === 0 || kindFilter.has(loc.kind);
    const visitedOk = !hideVisited || !visited.has(loc.id);
    return regionOk && kindOk && visitedOk;
  });
  const filtersActive = regionFilter.size > 0 || kindFilter.size > 0 || hideVisited;
```

- [ ] **Step 6: Lint.**

Run: `npm run lint`
Expected: exit 0 (new vars `visibleLocations`/`regions`/`collectibles`/etc. may be flagged unused if lint had `noUnusedLocals`; they are wired in Tasks 4-6. If `noUnusedLocals` errors here, proceed to Task 4 before committing.)

- [ ] **Step 7: Commit** (only if lint is clean; otherwise commit at end of Task 4).

```bash
git add src/pages/Map.tsx
git commit -m "feat(map): add filter + visited state and derived visible locations"
```

---

### Task 4: Map.tsx — filter bar + wire filtering to markers and index cards

**Files:**
- Modify: `src/pages/Map.tsx`

- [ ] **Step 1: Insert the filter bar.** Immediately after the closing `</header>` (line 194) and before `<section className="col-span-1 md:col-span-7 ...">`, insert:

```tsx
        <section className="col-span-1 md:col-span-12 mb-md">
          <div className="border hairline-border bg-paper-warm/40 p-4 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="font-mono-metadata text-mono-metadata text-ink-mute uppercase tracking-widest">
                  {en ? "Region" : "區域"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {regions.map((r) => {
                    const on = regionFilter.has(r.id);
                    return (
                      <button
                        key={r.id}
                        onClick={() => toggleFilter(setRegionFilter, r.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-sm border font-mono-metadata text-mono-metadata transition-colors min-h-[32px] ${
                          on
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-line-soft text-ink-soft hover:bg-bone"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }}></span>
                        {en ? r.nameEn : r.nameZh}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="font-mono-metadata text-mono-metadata text-ink-mute uppercase tracking-widest">
                  {en ? "Type" : "類型"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {KIND_ORDER.map((k) => {
                    const on = kindFilter.has(k);
                    return (
                      <button
                        key={k}
                        onClick={() => toggleFilter(setKindFilter, k)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-sm border font-mono-metadata text-mono-metadata transition-colors min-h-[32px] ${
                          on
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-line-soft text-ink-soft hover:bg-bone"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">{KIND_META[k].icon}</span>
                        {en ? KIND_META[k].en : KIND_META[k].zh}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-3">
              <label className="flex items-center gap-2 cursor-pointer select-none min-h-[32px]">
                <input
                  type="checkbox"
                  checked={hideVisited}
                  onChange={(e) => setHideVisited(e.target.checked)}
                  className="accent-primary w-4 h-4"
                />
                <span className="font-mono-metadata text-mono-metadata text-ink-soft uppercase tracking-wider">
                  {en ? "Hide visited" : "隱藏已造訪"}
                </span>
              </label>
              <div className="flex items-center gap-3 font-mono-metadata text-mono-metadata text-ink-mute">
                <span>
                  {en
                    ? `${visibleLocations.length}/${locations.length} shown · ${visited.size} visited`
                    : `顯示 ${visibleLocations.length}/${locations.length} · 已造訪 ${visited.size}`}
                </span>
                {filtersActive && (
                  <button
                    onClick={() => {
                      setRegionFilter(new Set());
                      setKindFilter(new Set());
                      setHideVisited(false);
                    }}
                    className="text-primary hover:opacity-80 uppercase tracking-wider"
                  >
                    {en ? "Reset" : "重設"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
```

- [ ] **Step 2: Point the map markers at `visibleLocations`.** Change line 212 `{locations.map((loc) => (` to `{visibleLocations.map((loc) => (`.

- [ ] **Step 3: Point the index cards at `visibleLocations`.** Change line 291 `{locations.map((loc, idx) => (` to `{visibleLocations.map((loc, idx) => (`.

- [ ] **Step 4: Handle the empty-filter case in the index column.** Immediately after the `<div className="flex flex-col space-y-sm">` that wraps the index cards (line 290), the `.map` now uses `visibleLocations`. After the closing `</div>` of that wrapper (line 355), add a fallback rendered when nothing matches — insert just before that closing `</div>`:

```tsx
            {visibleLocations.length === 0 && (
              <div className="border border-dashed border-line-soft bg-bone p-6 text-center font-mono-metadata text-mono-metadata text-ink-mute">
                {en ? "No locations match the current filters." : "沒有符合目前篩選條件的地點。"}
              </div>
            )}
```

- [ ] **Step 5: Lint.**

Run: `npm run lint`
Expected: exit 0.

- [ ] **Step 6: Manual check.**

Run: `npm run dev` and open http://localhost:3000/map
Expected: filter bar shows 6 region chips + 5 type chips + "Hide visited". Toggling a region chip narrows both the map pins and the index cards; combining a region + type chip ANDs them; "Reset" clears. Counter updates.

- [ ] **Step 7: Commit.**

```bash
git add src/pages/Map.tsx
git commit -m "feat(map): region + type filter bar wired to markers and index"
```

---

### Task 5: Map.tsx — visited toggle on cards + visited badge on markers + counter

**Files:**
- Modify: `src/pages/Map.tsx`

- [ ] **Step 1: Add a visited badge to map markers.** Inside the marker `<div className="w-11 h-11 rounded-full ...">` (lines 222-233), after the closing `</span>` of the icon (line 232) and before the div closes (line 233), add:

```tsx
                    {visited.has(loc.id) && (
                      <span className="absolute -top-1 -right-1 bg-[#3d5a45] text-white rounded-full w-4 h-4 flex items-center justify-center material-symbols-outlined text-[11px] z-20">
                        check
                      </span>
                    )}
```

- [ ] **Step 2: Add a visited toggle button + stamped style to each index card.** In the index `<article>` (line 293), change its `className` so visited cards look muted: replace the existing `className={...}` expression on the article (lines 294-296) with:

```tsx
                  className={`border hairline-border p-6 bg-paper relative group transition-colors duration-300 cursor-pointer hover:bg-bone ${
                    hoveredTarget === loc.id ? "ring-1 ring-primary z-20" : "z-10"
                  } ${visited.has(loc.id) ? "opacity-70" : ""}`}
```

Then, inside the card's top-right area, next to the level pill (the `<div className="absolute top-sm right-sm text-right">` at line 328), add a visited toggle button. Replace that opening div (line 328) and its contents through its close (line 332) with:

```tsx
                  <div className="absolute top-sm right-sm text-right flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => toggleVisited(loc.id, e)}
                      title={en ? (visited.has(loc.id) ? "Mark unvisited" : "Mark visited") : (visited.has(loc.id) ? "標記未造訪" : "標記已造訪")}
                      aria-pressed={visited.has(loc.id)}
                      className={`material-symbols-outlined text-[18px] rounded-full w-7 h-7 flex items-center justify-center border transition-colors ${
                        visited.has(loc.id)
                          ? "bg-[#3d5a45] text-white border-[#3d5a45]"
                          : "text-ink-mute border-line-soft hover:text-primary hover:border-primary"
                      }`}
                    >
                      {visited.has(loc.id) ? "check" : "radio_button_unchecked"}
                    </button>
                    <span className="font-mono-metadata text-mono-metadata text-ink-mute border border-ink-mute px-2 py-0.5 rounded-full group-hover:text-ink-main group-hover:border-primary transition-colors">
                      {en ? loc.levelEn : loc.levelZh}
                    </span>
                  </div>
```

> `toggleVisited(loc.id, e)` calls `e.stopPropagation()` internally (see `useFavorites`), so clicking the badge will not open the modal.

- [ ] **Step 3: Lint.**

Run: `npm run lint`
Expected: exit 0.

- [ ] **Step 4: Manual check.**

Reload http://localhost:3000/map. Click a card's circle toggle → it fills green with a check, the card dims, and the matching map pin gets a green check badge. Reload the page → state persists (localStorage `pokopia-map-visited`). Enable "Hide visited" → visited cards/pins disappear.

- [ ] **Step 5: Commit.**

```bash
git add src/pages/Map.tsx
git commit -m "feat(map): visited toggle on cards with persisted badge on markers"
```

---

### Task 6: Map.tsx — collectibles legend panel

**Files:**
- Modify: `src/pages/Map.tsx`

- [ ] **Step 1: Insert the legend.** Inside the left column `<section className="col-span-1 md:col-span-7 ...">`, after the status-ticker `<div className="hairline-border bg-paper-warm overflow-hidden flex items-center h-8">...</div>` block closes (line 277) and before that section's closing `</section>` (line 278), insert:

```tsx
          <div className="border hairline-border bg-paper p-4">
            <div className="flex items-center justify-between hairline-bottom pb-2 mb-3">
              <h3 className="font-label-caps text-label-caps text-ink-soft uppercase tracking-wider flex items-center gap-2 font-semibold">
                <span className="material-symbols-outlined text-primary text-[18px]">inventory_2</span>
                {en ? "Collectibles Index" : "收集物標註索引"}
              </h3>
              <span className="font-mono-metadata text-mono-metadata text-primary">
                {collectiblesTotal} {en ? "marked" : "處標註"}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {collectibles.map((c) => (
                <div
                  key={c.key}
                  className="flex items-center gap-2 bg-paper-warm/40 border border-line-soft rounded-sm px-2.5 py-1.5"
                >
                  <span
                    className="material-symbols-outlined text-[16px] shrink-0"
                    style={{ color: c.color }}
                  >
                    {c.icon}
                  </span>
                  <span className="font-mono-metadata text-mono-metadata text-ink-soft truncate flex-grow">
                    {en ? c.labelEn : c.labelZh}
                  </span>
                  <span className="font-mono-metadata text-mono-metadata text-ink-mute font-bold shrink-0">
                    {c.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
```

- [ ] **Step 2: Lint.**

Run: `npm run lint`
Expected: exit 0.

- [ ] **Step 3: Manual check.**

Reload http://localhost:3000/map. The collectibles legend appears under the map's status ticker: 11 rows, each with a colored icon, label, and count; header total reads `53 marked` (= Σ counts). Toggle EN/ZH — labels switch.

- [ ] **Step 4: Commit.**

```bash
git add src/pages/Map.tsx
git commit -m "feat(map): collectibles legend annotation panel"
```

---

### Task 7: Responsive verification + polish

**Files:**
- Modify: `src/pages/Map.tsx` (only if a breakpoint check reveals an issue)

- [ ] **Step 1: Final type check.**

Run: `npm run lint`
Expected: exit 0.

- [ ] **Step 2: Mobile check (360px).** In browser devtools set width 360px on /map. Confirm: filter region/type groups stack vertically, chips wrap (no horizontal page scroll), the "Hide visited" row wraps cleanly, collectibles legend shows 2 columns, visited toggles are tappable (≥28px). Fix any overflow by adjusting only the offending Tailwind classes (e.g. add `min-w-0`/`flex-wrap`).

- [ ] **Step 3: Tablet check (768px).** Confirm filter groups move to one row, map+index grid switches to its `md:` 7/5 split, legend shows 3 columns.

- [ ] **Step 4: Desktop check (1280px).** Confirm two-column 7/5 layout, legend shows 2 columns within the left column, no layout shift when toggling filters.

- [ ] **Step 5: Build to confirm production bundle.**

Run: `npm run build`
Expected: build succeeds, no type errors.

- [ ] **Step 6: Commit (if any responsive tweaks were made).**

```bash
git add src/pages/Map.tsx
git commit -m "fix(map): responsive polish for filter bar and legend"
```

---

## Self-Review

**Spec coverage:**
- Region renames + canonical `regions[]` → Task 1. ✓
- New `collectibles[]` legend → Task 1 (data) + Task 6 (UI). ✓
- `regionId`/`kind` per location → Task 2. ✓
- New `bulging-mine` location → Task 2. ✓
- In-prose rename touch-ups + ticker → Task 1 Step 3. ✓
- Region filter + kind filter (both markers + index) → Task 3 (state) + Task 4 (UI/wiring). ✓
- Visited tracking + hide-visited → Task 3 (state) + Task 4 (toggle/counter) + Task 5 (card/marker UI). ✓
- Responsive → responsive classes baked into Tasks 4/6 + Task 7 verification. ✓
- Optional-chaining safety (`?? []`) → Task 3 Step 5. ✓
- Testing gate = lint + manual → every task. ✓
- Out-of-scope (other data files, 95 placed pins) → not in any task, by design. ✓

**Placeholder scan:** No TBD/TODO; all code + JSON shown in full; `bulging-mine` entry fully authored.

**Type consistency:** `Kind` used consistently in `LocationEntry.kind`, `KIND_META`, `KIND_ORDER`, `kindFilter`. `visited`/`toggleVisited` names match `useFavorites` return (`favorites`/`toggleFavorite`) via destructure-rename. `visibleLocations` used identically in Tasks 4-5. `collectiblesTotal` defined Task 3, used Task 6. `regions`/`collectibles` defined Task 3, used Tasks 4/6.
