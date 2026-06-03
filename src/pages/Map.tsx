import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import Seo from "../components/Seo";
import MapBackdrop from "../components/MapBackdrop";
import ScrollFade from "../components/ScrollFade";
import { useFavorites } from "../hooks/useFavorites";

type SourceLink = {
  label: string;
  url: string;
};

type LocationEntry = {
  id: string;
  x: number;
  y: number;
  icon: string;
  type: "region" | "special";
  regionId: string;
  kind: Kind;
  levelEn: string;
  levelZh: string;
  categoryEn: string;
  categoryZh: string;
  nameEn: string;
  nameZh: string;
  summaryEn: string;
  summaryZh: string;
  descriptionEn: string;
  descriptionZh: string;
  objectivesEn: string[];
  objectivesZh: string[];
  requiredSkillsEn: string[];
  requiredSkillsZh: string[];
  resourceFocusEn: string[];
  resourceFocusZh: string[];
  notablePokemonEn: string[];
  notablePokemonZh: string[];
  unlocksEn: string[];
  unlocksZh: string[];
  tagsEn: string[];
  tagsZh: string[];
  tagIcons: string[];
  sourceLinks: SourceLink[];
};

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

const POKEMON_ROSTER_POOL = [
  { id: "p1", nameEn: "Conkeldurr", nameZh: "修建老匠", specialties: ["build"], icon: "construction", descEn: "Heavy-grade building expert.", descZh: "重工建造大師，擅長大型工事基底。" },
  { id: "p2", nameEn: "Pikachu", nameZh: "皮卡丘", specialties: ["generate"], icon: "bolt", descEn: "Consistent low-voltage output.", descZh: "穩定的低壓發電，適合敏感電網調試。" },
  { id: "p3", nameEn: "Peakychu", nameZh: "皮卡丘", specialties: ["generate"], icon: "star", descEn: "Leader-spec electrical general.", descZh: "領袖級特殊電能型，電瓶電網之魂。" },
  { id: "p4", nameEn: "Magnemite", nameZh: "小磁怪", specialties: ["generate"], icon: "electrical_services", descEn: "Floating electromagnetic balancer.", descZh: "懸浮電磁力能手，可修補局部磁力漏洞。" },
  { id: "p5", nameEn: "Pidgeot", nameZh: "大比鳥", specialties: ["fly"], icon: "flight", descEn: "Wide-area high-altitude sweepers.", descZh: "廣域高空翱翔，提供精準的地形測繪。" },
  { id: "p6", nameEn: "Dragonite", nameZh: "快龍", specialties: ["fly"], icon: "air", descEn: "Ultra-heavy load glider.", descZh: "超重型載物滑翔，能在空中搬運重型建材。" },
  { id: "p7", nameEn: "Charizard", nameZh: "噴火龍", specialties: ["burn", "fly"], icon: "mode_fan", descEn: "Can smelt ore and fly logistics.", descZh: "兼具熔煉礦石與高空物流搬運雙重職能。" },
  { id: "p8", nameEn: "Magmar", nameZh: "鴨嘴火獸", specialties: ["burn"], icon: "whatshot", descEn: "Ultra-high temp metallurgy support.", descZh: "極限高溫熱力源，為金屬重工冶煉提供原動力。" },
  { id: "p9", nameEn: "Blastoise", nameZh: "水箭龜", specialties: ["build"], icon: "water_drop", descEn: "Hydro-hydraulic landscape stabilizer.", descZh: "高壓水力阻尼，有效調節地熱或土壤水分。" },
  { id: "p10", nameEn: "Lapras", nameZh: "拉普拉斯", specialties: ["freeze", "transport"], icon: "bubble_chart", descEn: "Glacial waterside resource mover.", descZh: "寒冰水路運輸，提供安全、低溫的物資防護。" },
  { id: "p11", nameEn: "Glaceon", nameZh: "冰伊布", specialties: ["freeze"], icon: "ac_unit", descEn: "Precision cryo-cell thermal barrier.", descZh: "精準低溫冷凝防護，防止電極或熱能過載。" },
  { id: "p12", nameEn: "Sneasel", nameZh: "狃拉", specialties: ["freeze", "crush"], icon: "grid_view", descEn: "Fast frozen ice cutter.", descZh: "極速切冰能手，利爪能將冰岩分解成標準模組。" },
  { id: "p13", nameEn: "Machamp", nameZh: "怪力", specialties: ["build", "transport"], icon: "fitness_center", descEn: "Four-arm rapid material layer.", descZh: "四手搬運大師，同時兼任土木搭建與多維阻尼調整。" },
  { id: "p14", nameEn: "Geodude", nameZh: "小拳石", specialties: ["crush"], icon: "terrain", descEn: "Standard heavy rock crusher.", descZh: "標準重力碎巖工，擅長粉碎雜石網格。" },
  { id: "p15", nameEn: "Golem", nameZh: "隆隆岩", specialties: ["crush"], icon: "circle", descEn: "Seismic excavation breaker.", descZh: "震盪式開挖能手，可以瞬間擊破大型岩體。" },
  { id: "p16", nameEn: "Onix", nameZh: "大岩蛇", specialties: ["crush"], icon: "hive", descEn: "Subterranean foundation excavator.", descZh: "地下基底挖掘巨獸，用於開鑿排融溝渠道。" },
  { id: "p17", nameEn: "Raichu", nameZh: "雷丘", specialties: ["generate"], icon: "bolt", descEn: "Heavy lightning generator.", descZh: "重型電網發電機，提供源源不斷的大幅額外電流。" },
  { id: "p18", nameEn: "Ivysaur", nameZh: "妙蛙草", specialties: ["build"], icon: "nature", descEn: "Organic binder and soil anchoring.", descZh: "有機纖維黏合，為地盤提供強大的土木錨定點。" }
];

const KIND_META: Record<Kind, { en: string; zh: string; icon: string }> = {
  "region": { en: "Region", zh: "生態區域", icon: "public" },
  "special-site": { en: "Special Site", zh: "特殊據點", icon: "star" },
  "megaproject": { en: "Megaproject", zh: "大型工程", icon: "domain" },
  "legendary-project": { en: "Legendary Project", zh: "傳說工程", icon: "foundation" },
  "event": { en: "Event", zh: "隨機事件", icon: "shuffle" },
};
const KIND_ORDER: Kind[] = ["region", "special-site", "megaproject", "legendary-project", "event"];

export default function MapPage() {
  const { i18n } = useTranslation();
  const [data, setData] = useState<MapData | null>(null);
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);
  const [active, setActive] = useState<LocationEntry | null>(null);
  const [showIndex, setShowIndex] = useState(false);

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

  // New States for "Rebuild the Huge Building"
  const [hugeBuildingFloor, setHugeBuildingFloor] = useState<"2F" | "3F" | "4F">("2F");
  const [hugeBuildingProgress, setHugeBuildingProgress] = useState<Record<"2F" | "3F" | "4F", number>>({
    "2F": 100, // assume 2F starts solved or fully prepared
    "3F": 0,
    "4F": 0,
  });
  const [hugeBuildingTimerActive, setHugeBuildingTimerActive] = useState(false);
  const [hugeBuildingTimeRemaining, setHugeBuildingTimeRemaining] = useState<number>(3600); // 1 hour in seconds
  const [hugeBuildingMultiplier, setHugeBuildingMultiplier] = useState<number>(1); // 1x or 120x speed for testing

  // New States for 15-member Pokémon workforce on legendary bird altars
  const [selectedAltarCrew, setSelectedAltarCrew] = useState<Record<string, string[]>>({
    "altar-of-flame": [],
    "abandoned-power-plant": [],
    "freezing-chambers": [],
  });

  useEffect(() => {
    let interval: any = null;
    if (hugeBuildingTimerActive) {
      interval = setInterval(() => {
        setHugeBuildingTimeRemaining((prev) => {
          const next = prev - hugeBuildingMultiplier;
          if (next <= 0) {
            setHugeBuildingTimerActive(false);
            setHugeBuildingProgress((prevProgress) => ({
              ...prevProgress,
              [hugeBuildingFloor]: 100,
            }));
            return 3600; // Reset for next floor
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hugeBuildingTimerActive, hugeBuildingMultiplier, hugeBuildingFloor]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [
      String(h).padStart(2, "0"),
      String(m).padStart(2, "0"),
      String(s).padStart(2, "0")
    ].join(":");
  };

  useEffect(() => {
    fetch("/data/map.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const en = i18n.language === "en";
  const seoTitle = en ? "Exploration Map & Region Routes | Pokopia Chronicles" : "探索地圖與區域路線 | Pokopia 年代記";
  const seoDescription = en
    ? "Explore Pokopia's core regions, hidden murals, legendary bird megaprojects, and Dream Islands with objectives, skills, resources, and unlock routes."
    : "探索 Pokopia 的主線區域、夢幻壁畫、三神鳥大型工地與夢境群島，檢視任務目標、需求技能、資源與解鎖路線。";

  if (!data) {
    return (
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia map", "Pokopia regions", "Dream Islands", "Huge Building", "Empty Town"]}
      />
    );
  }

  const locations = data.locations ?? [];
  const entryCount = String(locations.length).padStart(2, "0");

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

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia map", "Pokopia regions", "Dream Islands", "Huge Building", "Empty Town", "Legendary birds"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: seoTitle,
          description: seoDescription,
          url: "https://pokemoninfoperfer.vercel.app/map",
          inLanguage: en ? "en" : "zh-Hant",
          about: "Pokopia exploration map and location archive",
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter relative mt-10">
        <header className="col-span-1 md:col-span-12 mb-lg">
          <div className="hairline-bottom pb-sm flex justify-between items-end gap-4">
            <div>
              <span className="font-mono-metadata text-mono-metadata text-primary block mb-2 tracking-widest uppercase">
                {en ? "Cartography Archive" : "製圖檔案"}
              </span>
              <h1 className="font-display-lg text-display-lg text-on-surface">
                {en ? "Exploration Map" : "探索地圖"}
              </h1>
            </div>
            <div className="text-right hidden sm:block">
              <span className="font-mono-metadata text-mono-metadata text-ink-mute block uppercase">
                {en ? "Indexed Sites" : "已建檔地點"}
              </span>
              <span className="font-body-italic text-body-italic text-primary">{entryCount}</span>
            </div>
          </div>
        </header>

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

        <section className="col-span-1 md:col-span-7 flex flex-col space-y-md relative h-full">
          <div
            className="border hairline-border bg-paper relative overflow-hidden group min-h-[340px] md:min-h-[560px] flex flex-col"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 24%, rgba(165, 58, 44, 0.12), transparent 24%), radial-gradient(circle at 78% 70%, rgba(188, 142, 68, 0.15), transparent 22%), radial-gradient(circle at 54% 12%, rgba(76, 120, 90, 0.12), transparent 20%), linear-gradient(to right, var(--color-line-soft) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line-soft) 1px, transparent 1px)",
              backgroundSize: "auto, auto, auto, 38px 38px, 38px 38px",
            }}
          >
            <div className="absolute top-0 right-0 bg-paper-warm hairline-border border-t-0 border-r-0 px-3 py-1 z-20">
              <span className="font-mono-metadata text-mono-metadata text-ink-mute">{data.mapId}</span>
            </div>

            <div className="relative flex-grow overflow-hidden">
              <MapBackdrop />

              {visibleLocations.map((loc) => (
                <button
                  key={loc.id}
                  onMouseEnter={() => setHoveredTarget(loc.id)}
                  onMouseLeave={() => setHoveredTarget(null)}
                  onClick={() => setActive(loc)}
                  title={en ? loc.nameEn : loc.nameZh}
                  className="absolute flex flex-col items-center z-10 transition-transform duration-300 hover:scale-110 -translate-x-1/2 -translate-y-1/2"
                  style={{ top: `${loc.y}%`, left: `${loc.x}%` }}
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors relative bg-bone/80 backdrop-blur-sm ${
                      hoveredTarget === loc.id || active?.id === loc.id
                        ? "border-primary border-solid border-2 text-primary scale-110"
                        : loc.type === "region"
                          ? "border-2 border-solid border-primary/70 text-primary"
                          : "border border-dashed border-ink-mute text-ink-soft"
                    }`}
                  >
                    {loc.type === "region" && <div className="absolute -inset-1 rounded-full bg-primary/20 animate-ping"></div>}
                    <span className="material-symbols-outlined text-[20px] relative z-10">{loc.icon}</span>
                    {visited.has(loc.id) && (
                      <span className="absolute -top-1 -right-1 bg-[#3d5a45] text-white rounded-full w-4 h-4 flex items-center justify-center material-symbols-outlined text-[11px] z-20">
                        check
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-mono-metadata text-mono-metadata text-ink-soft bg-bone/85 px-2 py-1 mt-1 rounded-sm transition-opacity whitespace-nowrap pointer-events-none ${
                      hoveredTarget === loc.id || active?.id === loc.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {en ? loc.nameEn : loc.nameZh}
                  </span>
                </button>
              ))}
            </div>

            <div className="border-t hairline-top p-6 flex justify-between items-center z-10 relative flex-wrap gap-4 bg-surface/80 backdrop-blur-sm">
              <div className="flex flex-wrap gap-4 font-mono-metadata text-mono-metadata text-ink-mute uppercase">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  {en ? "Region" : "生態區域"}
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 border border-ink-mute border-dashed rounded-full mr-2"></span>
                  {en ? "Special Site" : "特殊據點"}
                </span>
              </div>
              <button
                onClick={() => setShowIndex(true)}
                className="font-label-caps text-label-caps text-primary hover:opacity-80 transition-opacity uppercase"
              >
                {en ? "View Index" : "檢視索引"}
              </button>
            </div>
          </div>

          <div className="hairline-border bg-paper-warm overflow-hidden flex items-center h-8">
            <div className="bg-primary text-on-primary px-3 h-full flex items-center font-mono-metadata text-mono-metadata font-bold z-10 shrink-0">
              {en ? "Status" : "狀態"}
            </div>
            <div className="flex-grow overflow-hidden whitespace-nowrap relative">
              <div
                className="animate-[marquee_28s_linear_infinite] inline-block font-mono-metadata text-mono-metadata text-ink-soft"
                style={{ animation: "marquee 28s linear infinite" }}
              >
                {en ? data.statusTickerEn : data.statusTickerZh}
              </div>
            </div>
          </div>

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
        </section>

        <section className="col-span-1 md:col-span-5 flex flex-col space-y-md">
          <div className="flex justify-between items-end hairline-bottom pb-2">
            <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">
              {en ? "Key Locations" : "關鍵地點"}
            </h2>
            <span className="font-mono-metadata text-mono-metadata text-ink-mute">
              {entryCount} {en ? "Entries" : "筆資料"}
            </span>
          </div>

          <div className="flex flex-col space-y-sm">
            {visibleLocations.map((loc, idx) => (
              <ScrollFade key={loc.id} depth="none" delay={idx * 0.03} className="w-full">
                <article
                  className={`border hairline-border p-6 bg-paper relative group transition-colors duration-300 cursor-pointer hover:bg-bone ${
                    hoveredTarget === loc.id ? "ring-1 ring-primary z-20" : "z-10"
                  } ${visited.has(loc.id) ? "opacity-70" : ""}`}
                  onMouseEnter={() => setHoveredTarget(loc.id)}
                  onMouseLeave={() => setHoveredTarget(null)}
                  onClick={() => setActive(loc)}
                >
                  <AnimatePresence>
                    {hoveredTarget === loc.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-[calc(100%+0.5rem)] left-0 w-full bg-paper-warm border border-primary/30 rounded-sm p-4 shadow-lg pointer-events-none z-50"
                      >
                        <div className="font-label-caps text-sm text-primary uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-line-soft pb-2">
                          <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                          {en ? "Resource Yields Preview" : "主要資源產出預覽"}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(en ? loc.resourceFocusEn : loc.resourceFocusZh).map((res) => (
                            <span
                              key={res}
                              className="font-mono-metadata text-xs text-ink-soft bg-bone border border-line-soft px-2 py-1 rounded-sm shadow-sm"
                            >
                              {res}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
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
                  <div className="mb-3 pr-20 min-w-0">
                    <span className="font-body-italic text-body-italic text-ink-mute block mb-1 truncate">
                      {en ? loc.categoryEn : loc.categoryZh}
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface break-words">
                      {en ? loc.nameEn : loc.nameZh}
                    </h3>
                  </div>
                  <p className="font-body-base text-body-base text-ink-soft mb-4 line-clamp-3 break-words">
                    {en ? loc.summaryEn : loc.summaryZh}
                  </p>
                  <div className="flex flex-wrap gap-3 font-mono-metadata text-mono-metadata text-ink-mute border-t border-line-soft pt-3">
                    {(en ? loc.tagsEn : loc.tagsZh).map((tag, index) => (
                      <span key={tag} className="flex items-center">
                        <span className="material-symbols-outlined text-[14px] mr-1">{loc.tagIcons[index]}</span>
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              </ScrollFade>
            ))}
            {visibleLocations.length === 0 && (
              <div className="border border-dashed border-line-soft bg-bone p-6 text-center font-mono-metadata text-mono-metadata text-ink-mute">
                {en ? "No locations match the current filters." : "沒有符合目前篩選條件的地點。"}
              </div>
            )}
          </div>
        </section>

        {active && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink-soft/40 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <div
              className="bg-paper border hairline-border w-[95vw] md:max-w-7xl xl:max-w-[1380px] max-h-[90vh] overflow-y-auto relative flex flex-col lg:flex-row"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-sm right-sm z-10 text-ink-mute hover:text-primary transition-colors bg-paper/80 backdrop-blur-md rounded-full p-1 border border-line-soft"
                aria-label={en ? "Close" : "關閉"}
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="lg:w-[290px] bg-surface-container-high p-lg border-b lg:border-b-0 lg:border-r border-line flex flex-col justify-center relative shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-primary text-primary flex items-center justify-center bg-bone mb-md shadow-[0_0_40px_-10px_rgba(165,58,44,0.3)]">
                  <span className="material-symbols-outlined text-[48px] sm:text-[64px]">{active.icon}</span>
                </div>
                <span className="font-body-italic text-body-italic text-ink-mute block mb-xs">
                  {en ? active.categoryEn : active.categoryZh}
                </span>
                <h2 className="font-display-md text-display-md text-ink-soft leading-tight mb-md">
                  {en ? active.nameEn : active.nameZh}
                </h2>
                <span className="font-mono-metadata text-mono-metadata text-ink-mute border border-ink-mute px-3 py-1 rounded-full w-fit mb-md">
                  {en ? active.levelEn : active.levelZh}
                </span>
                <p className="font-body-base text-body-base text-ink-soft leading-relaxed">
                  {en ? active.summaryEn : active.summaryZh}
                </p>
              </div>

              <div className="lg:w-[calc(100%-290px)] p-6 md:p-12 xl:p-14 flex flex-col gap-9 flex-grow">
                <ScrollFade depth="none" scaleEnabled={false} className="w-full">
                  <section className="bg-paper border hairline-border p-6 md:p-8">
                    <h3 className="font-label-caps text-label-caps text-primary mb-4 uppercase tracking-wider flex items-center gap-2 font-semibold">
                      <span className="material-symbols-outlined text-[20px]">explore</span>
                      {en ? "Area Description" : "區域詳情"}
                    </h3>
                    <p className="font-body-base text-body-base text-ink-soft leading-relaxed whitespace-pre-wrap">
                      {en ? active.descriptionEn : active.descriptionZh}
                    </p>
                  </section>
                </ScrollFade>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-lg">
                  <ScrollFade depth="none" scaleEnabled={false}>
                    <section className="bg-paper-warm/40 border border-line-soft rounded-DEFAULT p-6 md:p-8 h-full hover:bg-paper-warm/60 transition-colors duration-300 shadow-sm flex flex-col">
                      <h3 className="font-label-caps text-label-caps text-ink-soft uppercase mb-4 tracking-wider flex items-center gap-2 font-semibold">
                        <span className="material-symbols-outlined text-primary text-[20px]">task_alt</span>
                        {en ? "Objectives" : "任務目標"}
                      </h3>
                      <ul className="space-y-3 flex-grow">
                        {(en ? active.objectivesEn : active.objectivesZh).map((item) => (
                          <li key={item} className="font-body-base text-body-base text-ink-soft leading-relaxed flex gap-2.5">
                            <span className="text-primary mt-1 select-none">✦</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </ScrollFade>

                  <ScrollFade depth="none" scaleEnabled={false}>
                    <section className="bg-paper-warm/40 border border-line-soft rounded-DEFAULT p-6 md:p-8 h-full hover:bg-paper-warm/60 transition-colors duration-300 shadow-sm flex flex-col">
                      <h3 className="font-label-caps text-label-caps text-ink-soft uppercase mb-4 tracking-wider flex items-center gap-2 font-semibold">
                        <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                        {en ? "Required Skills" : "需求技能"}
                      </h3>
                      <div className="flex flex-wrap gap-2.5">
                        {(en ? active.requiredSkillsEn : active.requiredSkillsZh).map((item) => (
                          <span
                            key={item}
                            className="font-mono-metadata text-mono-metadata text-ink-soft bg-bone border border-line-soft px-3 py-1.5 rounded-sm hover:-translate-y-0.5 hover:shadow-xs transition-all duration-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </section>
                  </ScrollFade>

                  <ScrollFade depth="none" scaleEnabled={false}>
                    <section className="bg-paper-warm/40 border border-line-soft rounded-DEFAULT p-6 md:p-8 h-full hover:bg-paper-warm/60 transition-colors duration-300 shadow-sm flex flex-col">
                      <h3 className="font-label-caps text-label-caps text-ink-soft uppercase mb-4 tracking-wider flex items-center gap-2 font-semibold">
                        <span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
                        {en ? "Resource Focus" : "重點資源"}
                      </h3>
                      <div className="flex flex-wrap gap-2.5">
                        {(en ? active.resourceFocusEn : active.resourceFocusZh).map((item) => (
                          <span
                            key={item}
                            className="font-mono-metadata text-mono-metadata text-ink-soft bg-bone border border-line-soft px-3 py-1.5 rounded-sm hover:-translate-y-0.5 hover:shadow-xs transition-all duration-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </section>
                  </ScrollFade>

                  <ScrollFade depth="none" scaleEnabled={false}>
                    <section className="bg-paper-warm/40 border border-line-soft rounded-DEFAULT p-6 md:p-8 h-full hover:bg-paper-warm/60 transition-colors duration-300 shadow-sm flex flex-col">
                      <h3 className="font-label-caps text-label-caps text-ink-soft uppercase mb-4 tracking-wider flex items-center gap-2 font-semibold">
                        <span className="material-symbols-outlined text-primary text-[20px]">pets</span>
                        {en ? "Notable Pokémon" : "關聯寶可夢"}
                      </h3>
                      <div className="flex flex-wrap gap-2.5">
                        {(en ? active.notablePokemonEn : active.notablePokemonZh).map((item) => (
                          <span
                            key={item}
                            className="font-mono-metadata text-mono-metadata text-ink-soft bg-bone border border-line-soft px-3 py-1.5 rounded-sm hover:-translate-y-0.5 hover:shadow-xs transition-all duration-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </section>
                  </ScrollFade>
                </div>

                <ScrollFade depth="none" scaleEnabled={false} className="w-full">
                  <section className="bg-paper border hairline-border p-6 md:p-8 mt-8">
                    <h3 className="font-label-caps text-label-caps text-ink-soft mb-4 uppercase tracking-wider flex items-center gap-2 font-semibold">
                      <span className="material-symbols-outlined text-primary text-[20px]">lock_open</span>
                      {en ? "Unlocks" : "解鎖內容"}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {(en ? active.unlocksEn : active.unlocksZh).map((item) => (
                        <span
                          key={item}
                          className="font-mono-metadata text-mono-metadata text-ink-soft bg-paper-warm/60 border border-line-soft px-4 py-2 rounded-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </section>
                </ScrollFade>

                {/* Rebuild the Huge Building Layer */}
                {(active.id === "huge-building" || active.id === "sparkling-skylands") && (
                  <ScrollFade depth="none" scaleEnabled={false} className="w-full">
                    <section className="bg-paper border hairline-border p-6 mt-8 relative overflow-hidden">
                      {/* Decorative Blueprint Background Accent */}
                      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none text-primary transform translate-x-1/4 translate-y-1/4">
                        <span className="material-symbols-outlined text-[320px]">domain</span>
                      </div>
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b hairline-bottom pb-4 mb-6 relative z-10">
                        <div>
                          <span className="font-mono-metadata text-xs text-primary uppercase tracking-widest block mb-2">
                            {en ? "BLUEPRINT OVERLAY LAYER" : "巨大建築・重建工程投影圖層"}
                          </span>
                          <h3 className="font-headline-sm text-2xl text-ink-main flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">layers</span>
                            {en ? "Tinkmaster's Huge Building Construction Office" : "巨鍛匠的巨型建築施工管制室"}
                          </h3>
                        </div>
                        <div className="flex gap-2 border hairline-border p-1">
                          {(["2F", "3F", "4F"] as const).map((floor) => (
                            <button
                              key={floor}
                              onClick={() => {
                                setHugeBuildingFloor(floor);
                                if (hugeBuildingProgress[floor] !== 100 && !hugeBuildingTimerActive) {
                                  setHugeBuildingTimeRemaining(3600);
                                }
                              }}
                              className={`px-4 py-2 font-mono-metadata text-xs uppercase tracking-widest transition-colors ${
                                hugeBuildingFloor === floor
                                  ? "bg-primary text-white"
                                  : "text-ink-mute hover:text-ink-main hover:bg-bone"
                              }`}
                            >
                              {floor}
                              {hugeBuildingProgress[floor] === 100 && " ✓"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Material requirements list */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
                        <div className="lg:col-span-6 flex flex-col gap-4">
                          <h4 className="font-mono-metadata text-xs text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                            {en ? `Required Materials for ${hugeBuildingFloor}` : `${hugeBuildingFloor} 工料清單`}
                          </h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b hairline-bottom">
                            {hugeBuildingFloor === "2F" && (
                              <>
                                <div className="bg-paper border hairline-border p-4 flex items-center justify-between transition-colors">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Concrete" : "混凝土"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">30 Units / 30 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Glass" : "玻璃"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">10 Units / 10 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Pokémetal" : "寶可金屬"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">5 Units / 5 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Iron Ingots" : "鐵錠"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">20 Units / 20 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                              </>
                            )}

                            {hugeBuildingFloor === "3F" && (
                              <>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Glow Stones" : "發光石"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">15 Units / 15 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Copper Ingots" : "銅錠"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">30 Units / 30 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-paper border hairline-border p-4 flex items-center justify-between transition-colors sm:col-span-2">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Concrete" : "混凝土"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">35 Units / 35 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                              </>
                            )}

                            {hugeBuildingFloor === "4F" && (
                              <>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Concrete" : "混凝土"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">40 Units / 40 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Glass" : "玻璃"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">15 Units / 15 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Paper" : "紙張"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">10 Units / 10 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Bricks" : "磚塊"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">10 Units / 10 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between sm:col-span-2">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Lumber" : "木材"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">20 Units (From Scyther cuts) / 20 單位 (飛天螳螂砍伐)</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Mission Escort Lock Info */}
                          <div className="bg-[#ecdcb9]/30 border border-[#bfa46f]/60 p-4 rounded text-xs gap-2.5 flex flex-col">
                            <h5 className="font-bold text-ink-soft flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-primary text-[16px]">link</span>
                              {en ? "Mission Line Lock & Escort Requirements" : "任務鏈互鎖與護送條件"}
                            </h5>
                            
                            {hugeBuildingFloor === "2F" && (
                              <div className="text-ink-soft leading-relaxed flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-700 text-[16px]">check_circle</span>
                                <span>{en ? "No pre-requisite escorts required for 2F foundation casting." : "已就緒：2F 為標準地床澆補，不需要特定角色護送。"}</span>
                              </div>
                            )}

                            {hugeBuildingFloor === "3F" && (
                              <div className="flex flex-col gap-1.5 leading-relaxed">
                                <div className="flex items-center gap-2 font-semibold text-primary">
                                  <span className="material-symbols-outlined text-[16px]">person_pin_circle</span>
                                  <span>{en ? "Escort Lock: Chef Dente (凸隆隆山地主廚)" : "特定護送：主廚 Dente (Chef Dente)"}</span>
                                </div>
                                <p className="text-ink-mute pl-6">
                                  {en 
                                    ? "Requires completing Wheat Bread Strength rescue in Bulging Highlands first to unlock Chef Dente's heavy logistical transport sequence."
                                    : "已護送確認：必須先在「凸隆隆山地」烤製小麥麵包、取得怪力加成並斬開鐵鍊解救主廚 Dente，方可解鎖 3F 大型施工。"}
                                </p>
                              </div>
                            )}

                            {hugeBuildingFloor === "4F" && (
                              <div className="flex flex-col gap-1.5 leading-relaxed">
                                <div className="flex items-center gap-2 font-semibold text-primary">
                                  <span className="material-symbols-outlined text-[16px]">electric_bolt</span>
                                  <span>{en ? "Escort Lock: Peakychu (暗沉沉海邊發電員)" : "特定護送：皮卡丘 (暗沉沉海邊發電專長)"}</span>
                                </div>
                                <p className="text-ink-mute pl-6">
                                  {en 
                                    ? "Requires full Beach power-grid alignment and lighthouse water wheel repair to guide Peakychu to Skylands' vertical lift generator."
                                    : "已護送確認：必須先在「暗沉沉海邊」打通完整的發電網絡、修復燈塔水車，方可指引 Peakychu 前往空島激活 4F 終極垂吊發電機。"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Real-time progress bar countdown simulator */}
                        <div className="lg:col-span-6 bg-paper border border-line-soft p-5 rounded flex flex-col justify-between gap-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-mono-metadata text-xs text-ink-soft uppercase tracking-wider font-bold">
                                {en ? "Real-time Concrete Cure & Build Timer" : "工料現場固化與施工計時"}
                              </span>
                              <span className="bg-primary/10 text-primary font-mono text-xs px-2 py-0.5 rounded font-bold animate-pulse">
                                {en ? "1 HOUR REQUIRED" : "現實需要 1 小時"}
                              </span>
                            </div>

                            <p className="text-xs text-ink-mute leading-relaxed mb-4">
                              {en 
                                ? "Every skyscraper floor requires massive real-world concrete drying and material assembly time. Tap below to simulate regional project acceleration." 
                                : "摩天大樓每升一層均需要現實時間 1 小時進行高空物料固化與排班。可使用下方「時空加速器」模擬專案執行進度。"}
                            </p>

                            {/* Simulated progress slider or bar */}
                            <div className="bg-bone p-4 rounded border border-line-soft space-y-3">
                              <div className="flex justify-between items-end">
                                <div>
                                  <div className="font-mono-metadata text-xs text-ink-faint uppercase font-bold">
                                    {en ? "Current Cure State" : "固化與施工進度"}
                                  </div>
                                  <div className="text-lg font-bold text-on-surface">
                                    {hugeBuildingProgress[hugeBuildingFloor] === 100 
                                      ? "100.00% (Completed / 已完工)" 
                                      : `${Math.min(100, Math.max(0, ((3600 - hugeBuildingTimeRemaining) / 3600) * 100)).toFixed(2)}%`}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-mono-metadata text-xs text-ink-faint uppercase font-bold">
                                    {en ? "Time Remaining" : "賸餘等待時間"}
                                  </div>
                                  <kbd className="text-sm font-mono font-bold bg-ink-soft text-on-primary px-2 py-1 rounded">
                                    {hugeBuildingProgress[hugeBuildingFloor] === 100 ? "00:00:00" : formatTime(hugeBuildingTimeRemaining)}
                                  </kbd>
                                </div>
                              </div>

                              {/* Progress Bar Container */}
                              <div className="w-full h-3 bg-[#eadecd] rounded overflow-hidden relative">
                                <div 
                                  className="h-full bg-primary transition-all duration-300 relative"
                                  style={{ 
                                    width: `${
                                      hugeBuildingProgress[hugeBuildingFloor] === 100 
                                        ? 100 
                                        : ((3600 - hugeBuildingTimeRemaining) / 3600) * 100
                                    }%` 
                                  }}
                                >
                                  {hugeBuildingTimerActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite] bg-[length:200px_100%]"></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 pt-2 border-t border-line-soft">
                            {/* Speed toggles */}
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-ink-mute">{en ? "Simulation Speed:" : "模擬時空流速控制:"}</span>
                              <div className="flex gap-1 bg-[#ecdcb9]/40 p-0.5 rounded border border-[#bfa46f]/30">
                                <button
                                  type="button"
                                  onClick={() => setHugeBuildingMultiplier(1)}
                                  className={`px-2.5 py-0.5 rounded font-mono font-bold text-xs ${
                                    hugeBuildingMultiplier === 1 ? "bg-primary text-on-primary" : "text-ink-soft hover:bg-[#ccdcb9]/40"
                                  }`}
                                >
                                  1x (Real)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setHugeBuildingMultiplier(120)}
                                  className={`px-2.5 py-0.5 rounded font-mono font-bold text-xs ${
                                    hugeBuildingMultiplier === 120 ? "bg-primary text-on-primary" : "text-ink-soft hover:bg-[#ccdcb9]/40"
                                  }`}
                                  title={en ? "Compresses 1 hour into 30 seconds" : "將 1 小時壓縮為 30 秒快速預覽"}
                                >
                                  120x (Fast)
                                </button>
                              </div>
                            </div>

                            {/* Trigger Button */}
                            {hugeBuildingProgress[hugeBuildingFloor] === 100 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setHugeBuildingProgress((prev) => ({ ...prev, [hugeBuildingFloor]: 0 }));
                                  setHugeBuildingTimeRemaining(3600);
                                  setHugeBuildingTimerActive(false);
                                }}
                                className="w-full bg-[#3d5a45] text-on-primary font-mono-metadata text-xs font-bold py-3.5 px-4 rounded hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                              >
                                <span className="material-symbols-outlined text-[16px]">autorenew</span>
                                {en ? "Reset Build State for Simulation" : "重置本層進度重新進行模擬"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setHugeBuildingTimerActive(!hugeBuildingTimerActive)}
                                className={`w-full font-mono-metadata text-xs font-bold py-3.5 px-4 rounded transition-all flex items-center justify-center gap-1.5 ${
                                  hugeBuildingTimerActive
                                    ? "bg-[#be5a4a] text-on-primary shadow-sm hover:bg-[#be5a4a]/90"
                                    : "bg-primary text-on-primary shadow-md hover:bg-primary/95"
                                }`}
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  {hugeBuildingTimerActive ? "pause_circle" : "play_circle"}
                                </span>
                                {hugeBuildingTimerActive 
                                  ? (en ? "PAUSE TIME PROGRESS" : "暫停時空流程") 
                                  : (en ? "BEGIN FLOATING EXCAVATION & BUILD" : "啟動現即高空施工與材料澆灌")}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>
                  </ScrollFade>
                )}

                {/* Legendary Bird Megaproject 33x35 Grid Layout and 15 Pokémon Workforce Planner */}
                {(active.id === "altar-of-flame" || active.id === "abandoned-power-plant" || active.id === "freezing-chambers") && (
                  <ScrollFade depth="none" scaleEnabled={false} className="w-full">
                    <section className="bg-[#f0f4f8] border-2 border-x-0 sm:border-x-2 border-[#3c6ca5]/20 rounded-none sm:rounded-lg -mx-6 sm:mx-0 p-6 md:p-8 shadow-sm relative overflow-hidden">
                      
                      {/* Visual Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#3c6ca5]/10 pb-4 mb-6 relative z-10">
                        <div>
                          <span className="bg-[#3c6ca5]/10 text-[#305684] font-mono-metadata text-xs px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                            {en ? "ULTIMATE ALTAR BLUEPRINT LAYER" : "極限祭壇佈局與合工專長管制圖層"}
                          </span>
                          <h3 className="font-headline-sm text-headline-sm text-ink-soft mt-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#3c6ca5]">foundation</span>
                            {en ? `${active.nameEn} 33x35 Grid & Crew Dispatch` : `${active.nameZh} 33x35 網格佈置與隊伍派遣`}
                          </h3>
                        </div>
                        <div className="bg-[#e2eaf4] px-3.5 py-1.5 rounded text-xs shrink-0 font-mono font-bold text-[#305684]">
                          {en ? "GRID SIZE: 33x35 CELLS" : "佔地總規模：33x35 巨大網格"}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                        
                        {/* Left Column: 11x11 Grid Layout & Environmental Physics */}
                        <div className="lg:col-span-5 flex flex-col gap-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-mono-metadata text-xs text-[#305684] font-bold uppercase tracking-wider flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px]">grid_4x4</span>
                              {en ? "33x35 Layout Grid Viewer (11x11 Segment)" : "33x35 核心網格佈局剖面 (11x11)"}
                            </h4>
                            <span className="text-xs font-mono-metadata text-ink-mute uppercase">
                              {en ? "Coords: [X11-X22, Y12-Y23]" : "切片坐標系：[X11-X22, Y12-Y23]"}
                            </span>
                          </div>

                          {/* Interactive grid blocks diagram */}
                          <div className="bg-bone border border-[#3c6ca5]/30 p-4 rounded flex flex-col items-center justify-center gap-3">
                            <div className="grid grid-cols-11 gap-1 w-full max-w-[280px]">
                              {Array.from({ length: 121 }).map((_, index) => {
                                const r = Math.floor(index / 11);
                                const c = index % 11;
                                const isCore = r >= 3 && r <= 7 && c >= 3 && c <= 7;
                                let cellColor = "bg-stone-200/60";
                                let cellBorder = "border-stone-300";
                                
                                if (isCore) {
                                  if (active.id === "altar-of-flame") {
                                    cellColor = "bg-[#be5a4a]";
                                    cellBorder = "border-[#be5a4a]/80";
                                  } else if (active.id === "abandoned-power-plant") {
                                    cellColor = "bg-[#dcae4a]";
                                    cellBorder = "border-[#dcae4a]/80";
                                  } else {
                                    cellColor = "bg-[#5aa8be]";
                                    cellBorder = "border-[#5aa8be]/80";
                                  }
                                } else if (active.id === "altar-of-flame") {
                                  const isDiverter = r === 1 || r === 9 || c === 1 || c === 9;
                                  if (isDiverter) {
                                    cellColor = "bg-[#334e68]/75";
                                    cellBorder = "border-blue-900/60";
                                  } else if (r === 0 || r === 10 || c === 0 || c === 10) {
                                    cellColor = "bg-[#be5a4a]/25 animate-pulse";
                                    cellBorder = "border-[#be5a4a]/20";
                                  }
                                } else if (active.id === "abandoned-power-plant") {
                                  const isGap = c % 2 === 0 && r % 2 === 0;
                                  if (isGap) {
                                    cellColor = "bg-[#486581]";
                                    cellBorder = "border-slate-500";
                                  }
                                } else {
                                  const isInsulator = r === 2 || r === 8 || c === 2 || c === 8;
                                  if (isInsulator) {
                                    cellColor = "bg-[#e0f2fe]";
                                    cellBorder = "border-[#7dd3fc]";
                                  }
                                }

                                return (
                                  <div
                                    key={index}
                                    className={`aspect-square rounded-[3px] border text-[7px] font-mono flex items-center justify-center transition-all ${cellColor} ${cellBorder}`}
                                    title={`Cell [${r + 11}, ${c + 12}]`}
                                  >
                                    {isCore && index === 60 ? "★" : ""}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Grid legend */}
                            <div className="flex flex-wrap gap-4 text-xs font-mono-metadata text-ink-soft border-t border-[#3c6ca5]/10 pt-2 w-full justify-center">
                              <span className="flex items-center gap-1.5">
                                <span className={`w-2.5 h-2.5 rounded-xs border ${
                                  active.id === "altar-of-flame" ? "bg-[#be5a4a]" : active.id === "abandoned-power-plant" ? "bg-[#dcae4a]" : "bg-[#5aa8be]"
                                }`}></span>
                                {en ? "Altar Center Target" : "中央祭壇核心塊"}
                              </span>
                              {active.id === "altar-of-flame" && (
                                <>
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-xs border bg-[#334e68]/75"></span>
                                    {en ? "Bypass Trench" : "4格深防爆避災導流溝"}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-xs border bg-[#be5a4a]/20"></span>
                                    {en ? "Active Lava Flow" : "活火山高熱熔岩"}
                                  </span>
                                </>
                              )}
                              {active.id === "abandoned-power-plant" && (
                                <>
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-xs border bg-[#486581]"></span>
                                    {en ? "8px Spark Gaps" : "8px 磁場引極隙路"}
                                  </span>
                                </>
                              )}
                              {active.id === "freezing-chambers" && (
                                <>
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-xs border bg-[#e0f2fe] border-[#7dd3fc]"></span>
                                    {en ? "Insulator Shards" : "水晶防洩冷凝屏障"}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Environmental rules */}
                          <div className="bg-[#e9eff5] p-4 rounded border border-[#3c6ca5]/30 text-xs">
                            <h5 className="font-bold text-[#305684] flex items-center gap-1.5 mb-2">
                              <span className="material-symbols-outlined text-[16px]">info</span>
                              {en ? "Ecosystem Mechanics & Fluid Physics" : "本區極限佈局流體力學與危害管理"}
                            </h5>
                            
                            {active.id === "altar-of-flame" && (
                              <p className="text-ink-soft leading-relaxed">
                                {en 
                                  ? "Moltres's Altar requires carving 4-block-deep cooling ditches outside the 33x35 center matrix. High-temperature lava must be fully redirected to avoid melting materials and instantly resetting build cycles!"
                                  : "烈焰祭壇要求在 33x35 網格邊緣開鑿四格深的「防爆避災導流溝」。高溫火山熔岩必須引入外側水道，若溢流進入中央祭壇，將嚴重融毀所耗重金屬結構，導致施工計時器歸零。"}
                              </p>
                            )}

                            {active.id === "abandoned-power-plant" && (
                              <p className="text-ink-soft leading-relaxed">
                                {en 
                                  ? "Zapdos's generator demands strict 8px node spacing gaps for static wire structures. Any physical obstruction or conductive metal laying outside prescribed lines will spark electric arcs, scaring away workers."
                                  : "廢棄發電廠要求全區以精確 8px 物理間隙架置靜電特斯拉線圈。凡金屬方塊或線路排布不合，將引發高壓電弧起火，對 15 人施工隊伍產生致命恐慌，造成施工人員逃佚。"}
                              </p>
                            )}

                            {active.id === "freezing-chambers" && (
                              <p className="text-ink-soft leading-relaxed">
                                {en 
                                  ? "Articuno's ice chamber must encapsulate cold leak paths. 50 ice blocks must be immediately bordered by 10 harvested crystal shards, preventing environmental heating from surrounding rocky air flow."
                                  : "冰結之室必須採用內外隔熱法。將 50 快冰塊組入 10 水晶碎片構成的冷凝屏障中，以阻隔外部火山灰與地熱侵擾。若熱量洩漏，冰塊將急速氣化融化，清單材料亦會損毀。"}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right Column: 15 Pokémon dispatch panel & compliance counters */}
                        <div className="lg:col-span-7 flex flex-col gap-5">
                          
                          <div className="flex justify-between items-center bg-[#cae2fa]/40 border border-[#3c6ca5]/30 px-4 py-3.5 rounded-sm">
                            <div>
                              <div className="font-bold text-[#305684] text-sm">
                                {en ? "Dispatched Workers Count" : "派遣施工人員列表"}
                              </div>
                              <p className="text-xs text-ink-mute">
                                {en ? "15-member team configuration required for construction" : "必須精確選中 15 隻寶可夢合工，少一隻或多一隻都無法啟動"}
                              </p>
                            </div>
                            <span className={`font-mono font-bold text-lg px-2.5 py-1 rounded ${
                              (selectedAltarCrew[active.id] ?? []).length === 15 
                                ? "bg-emerald-700 text-on-primary animate-pulse" 
                                : "bg-[#3c6ca5] text-on-primary"
                            }`}>
                              {(selectedAltarCrew[active.id] ?? []).length} / 15
                            </span>
                          </div>

                          {/* Current 15-member workforce list */}
                          <div>
                            <span className="font-mono-metadata text-xs text-ink-mute uppercase font-bold block mb-2 tracking-wider">
                              {en ? "CURRENT WORKFORCE CREW (15 MAN SLOTS)" : "當前工作隊成員（共 15 個工人坑位）"}
                            </span>
                            
                            {(selectedAltarCrew[active.id] ?? []).length === 0 ? (
                              <div className="bg-bone border border-dashed border-line-soft p-6 rounded text-center text-xs text-ink-mute">
                                {en 
                                  ? "Roster is currently empty. Tap Pokémon cards below to assign workers to this altar project." 
                                  : "工作隊目前無人值守。請點擊下方「全能後備隊」卡片派遣專長精確的寶可夢入隊。"}
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2.5 max-h-[170px] overflow-y-auto bg-bone p-3 border border-line-soft rounded">
                                {(selectedAltarCrew[active.id] ?? []).map((pId) => {
                                  const pkmn = POKEMON_ROSTER_POOL.find((x) => x.id === pId);
                                  if (!pkmn) return null;
                                  return (
                                    <div 
                                      key={pId} 
                                      className="bg-paper shadow-xs border border-[#3c6ca5]/30 pl-2 pr-1.5 py-1.5 rounded flex items-center gap-2 text-xs transition-all hover:border-[#be5a4a] group shrink-0"
                                    >
                                      <span className="material-symbols-outlined text-[#3c6ca5] text-[16px]">{pkmn.icon}</span>
                                      <span className="font-bold text-ink-soft">{en ? pkmn.nameEn : pkmn.nameZh}</span>
                                      <div className="flex gap-0.5">
                                        {pkmn.specialties.map((spec) => (
                                          <span 
                                            key={spec} 
                                            className="bg-primary/10 text-primary text-[8px] font-mono px-1 rounded scale-90 uppercase"
                                            title={spec}
                                          >
                                            {spec === "build" && (en ? "Bld" : "建")}
                                            {spec === "burn" && (en ? "Brn" : "燃")}
                                            {spec === "generate" && (en ? "Gen" : "電")}
                                            {spec === "fly" && (en ? "Fly" : "飛")}
                                            {spec === "freeze" && (en ? "Frz" : "凍")}
                                            {spec === "crush" && (en ? "Crsh" : "碎")}
                                            {spec === "transport" && (en ? "Trsp" : "運")}
                                          </span>
                                        ))}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedAltarCrew((prev) => ({
                                            ...prev,
                                            [active.id]: prev[active.id].filter((x) => x !== pId),
                                          }));
                                        }}
                                        className="text-ink-mute hover:text-[#be5a4a] ml-1.5 focus:outline-none"
                                        title={en ? "Remove worker" : "撤除此工人"}
                                      >
                                        <span className="material-symbols-outlined text-[15px]">close</span>
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Live Workforce Specialty Checker */}
                          {(() => {
                            const crewIds = selectedAltarCrew[active.id] ?? [];
                            const crew = POKEMON_ROSTER_POOL.filter((x) => crewIds.includes(x.id));
                            const countSpec = (spec: string) => crew.filter((x) => x.specialties.includes(spec)).length;

                            const bldCount = countSpec("build");
                            const brnCount = countSpec("burn");
                            const genCount = countSpec("generate");
                            const flyCount = countSpec("fly");
                            const frzCount = countSpec("freeze");
                            const crshCount = countSpec("crush");
                            const trspCount = countSpec("transport");

                            let isRosterValid = false;
                            let checks = [] as Array<{ label: string; current: number; required: number; pass: boolean }>;

                            if (active.id === "altar-of-flame") {
                              checks = [
                                { label: en ? "Build Specialty (建造)" : "建造專長寶可夢", current: bldCount, required: 3, pass: bldCount >= 3 },
                                { label: en ? "Burn Specialty (燃燒)" : "燃燒/熔煉專長寶可夢", current: brnCount, required: 3, pass: brnCount >= 3 },
                                { label: en ? "Crush Specialty (粉碎)" : "粉碎開挖專長寶可夢", current: crshCount, required: 2, pass: crshCount >= 2 },
                                { label: en ? "Transport Specialty (運輸)" : "物資搬運專長寶可夢", current: trspCount, required: 2, pass: trspCount >= 2 },
                              ];
                              isRosterValid = crewIds.length === 15 && checks.every((c) => c.pass);
                            } else if (active.id === "abandoned-power-plant") {
                              checks = [
                                { label: en ? "Build Specialty (建造)" : "建造專長寶可夢", current: bldCount, required: 4, pass: bldCount >= 4 },
                                { label: en ? "Generate Specialty (發電)" : "發電/配電專長寶可夢", current: genCount, required: 4, pass: genCount >= 4 },
                                { label: en ? "Crush Specialty (粉碎)" : "粉碎開挖專長寶可夢", current: crshCount, required: 3, pass: crshCount >= 3 },
                                { label: en ? "Fly Specialty (飛行)" : "高空作業/飛行專長寶可夢", current: flyCount, required: 3, pass: flyCount >= 3 },
                              ];
                              isRosterValid = crewIds.length === 15 && checks.every((c) => c.pass);
                            } else {
                              checks = [
                                { label: en ? "Build Specialty (建造)" : "建造專長寶可夢", current: bldCount, required: 4, pass: bldCount >= 4 },
                                { label: en ? "Freeze Specialty (冰凍)" : "低溫冷凝/冰凍專長", current: frzCount, required: 5, pass: frzCount >= 5 },
                                { label: en ? "Crush Specialty (粉碎)" : "粉碎開挖專長寶可夢", current: crshCount, required: 3, pass: crshCount >= 3 },
                                { label: en ? "Transport Specialty (運輸)" : "物資搬運專長寶可夢", current: trspCount, required: 2, pass: trspCount >= 2 },
                              ];
                              isRosterValid = crewIds.length === 15 && checks.every((c) => c.pass);
                            }

                            return (
                              <div className="bg-paper border border-[#3c6ca5]/30 rounded p-4 space-y-3">
                                <div className="font-mono-metadata text-xs text-[#305684] uppercase font-bold tracking-wider border-b border-[#3c6ca5]/10 pb-2">
                                  {en ? "WORKFORCE SPECIALTY COMPLIANCE AUDIT" : "合工班專長審查標準"}
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  {checks.map((c, i) => (
                                    <div 
                                      key={i} 
                                      className={`flex items-center justify-between p-2 rounded border ${
                                        c.pass ? "bg-emerald-50 border-emerald-200/50 text-emerald-900" : "bg-red-50 border-red-200/50 text-red-900"
                                      }`}
                                    >
                                      <span className="truncate pr-2">{c.label}</span>
                                      <span className="font-mono font-bold shrink-0">
                                        {c.current} / {c.required} {c.pass ? "✓" : "✗"}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                {isRosterValid ? (
                                  <div className="bg-emerald-600 text-on-primary p-3 rounded text-center font-mono-metadata text-xs font-bold leading-relaxed shadow-sm animate-pulse flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">verified</span>
                                    {active.id === "altar-of-flame" && (
                                      <span>{en ? "🔥 CHOSEN ALTAR READY! MOLTRES RECRUITMENT PATHWAY PRIMED." : "🔥 烈焰祭壇就緒！火焰鳥召喚力能已達到臨界點！"}</span>
                                    )}
                                    {active.id === "abandoned-power-plant" && (
                                      <span>{en ? "⚡ TURBINES FULLY CHARGED! ZAPDOS RECRUITMENT PATHWAY PRIMED." : "⚡ 廢棄發電廠充能完畢！閃電鳥引雷震盪程序已就緒！"}</span>
                                    )}
                                    {active.id === "freezing-chambers" && (
                                      <span>{en ? "❄️ ICE BARRIERS ENCAPSULATED! ARTICUNO RECRUITMENT PATHWAY PRIMED." : "❄️ 冰結之室密封完成！急凍鳥冷凝喚醒程序已就緒！"}</span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded text-center font-body-base text-xs leading-relaxed flex items-start gap-2">
                                    <span className="material-symbols-outlined text-amber-600 text-[16px] mt-0.5 shrink-0">lock</span>
                                    <span className="text-left font-semibold">
                                      {en 
                                        ? `Awaiting exact 15 dispatched workers meeting the criteria above to trigger ${active.nameEn}'s ancient calling.`
                                        : `合工條件不契合。必須派遣精確 15 隻寶可夢，且完全契合上方所要求的合工班專長配比，才能成功召喚 ${active.nameZh}。`}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                          {/* Roster Pool Board (Available fleet) */}
                          <div className="bg-bone p-4 border border-line-soft rounded">
                            <div className="flex justify-between items-center mb-3">
                              <span className="font-mono-metadata text-xs text-ink-mute uppercase font-bold tracking-wider">
                                {en ? "AVAILABLE FLEET POOL" : "空空鎮與據點全能後備隊"}
                              </span>
                              <span className="text-xs font-mono-metadata text-ink-faint">
                                {en ? "Select up to 15 workers" : "點擊可派遣或移出工作隊"}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto pr-1">
                              {POKEMON_ROSTER_POOL.map((p) => {
                                const crewIds = selectedAltarCrew[active.id] ?? [];
                                const isSelected = crewIds.includes(p.id);
                                return (
                                  <button
                                    type="button"
                                    key={p.id}
                                    disabled={!isSelected && crewIds.length >= 15}
                                    onClick={() => {
                                      if (isSelected) {
                                        setSelectedAltarCrew((prev) => ({
                                          ...prev,
                                          [active.id]: prev[active.id].filter((id) => id !== p.id),
                                        }));
                                      } else if (crewIds.length < 15) {
                                        setSelectedAltarCrew((prev) => ({
                                          ...prev,
                                          [active.id]: [...prev[active.id], p.id],
                                        }));
                                      }
                                    }}
                                    className={`p-2 rounded border text-left flex flex-col justify-between h-20 transition-all ${
                                      isSelected
                                        ? "bg-[#3c6ca5]/10 border-[#3c6ca5] ring-1 ring-[#3c6ca5] text-[#305684]"
                                        : crewIds.length >= 15
                                          ? "bg-stone-50 border-stone-200 opacity-40 cursor-not-allowed text-stone-400"
                                          : "bg-paper hover:bg-stone-50 border-line-soft text-ink-soft"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start w-full gap-1">
                                      <span className="font-bold text-xs truncate leading-tight">
                                        {en ? p.nameEn : p.nameZh}
                                      </span>
                                      <span className="material-symbols-outlined text-[15px] shrink-0 opacity-70">
                                        {p.icon}
                                      </span>
                                    </div>
                                    <div className="w-full">
                                      <div className="flex flex-wrap gap-0.5 mb-1">
                                        {p.specialties.map((spec) => (
                                          <span 
                                            key={spec} 
                                            className="bg-[#3c6ca5]/10 text-[#305684] text-[7px] scale-90 origin-left px-1 py-0.2 rounded font-mono uppercase"
                                          >
                                            {spec}
                                          </span>
                                        ))}
                                      </div>
                                      <div className="text-xs text-ink-faint leading-tight truncate">
                                        {en ? p.descEn : p.descZh}
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      </div>
                    </section>
                  </ScrollFade>
                )}

                <ScrollFade depth="none" scaleEnabled={false} className="w-full">
                  <section className="pt-6 border-t border-dashed border-line-soft">
                    <h3 className="font-label-caps text-label-caps text-ink-mute uppercase mb-4 tracking-wider flex items-center gap-2 font-semibold text-xs">
                      <span className="material-symbols-outlined text-[16px]">menu_book</span>
                      {en ? "Sources & References" : "資料來源與參考"}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {active.sourceLinks.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono-metadata text-mono-metadata text-ink-soft bg-paper-warm/40 border border-line-soft px-4 py-2 rounded-sm hover:text-primary hover:bg-paper-warm/80 transition-all duration-300 shadow-sm"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </section>
                </ScrollFade>
              </div>
            </div>
          </div>
        )}

        {showIndex && (
          <div
            className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-ink-soft/40 backdrop-blur-sm"
            onClick={() => setShowIndex(false)}
          >
            <div
              className="bg-paper border hairline-border max-w-3xl w-full max-h-[88vh] overflow-y-auto relative"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 bg-bone/95 backdrop-blur-md flex justify-between items-center px-lg py-md border-b border-line-soft z-10">
                <h2 className="font-headline-sm text-headline-sm text-ink-soft uppercase">
                  {en ? "Full Location Index" : "完整地點索引"}
                </h2>
                <button onClick={() => setShowIndex(false)} className="text-ink-mute hover:text-primary transition-colors" aria-label={en ? "Close" : "關閉"}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <ul className="divide-y divide-line-soft">
                {locations.map((loc) => (
                  <li key={loc.id}>
                    <button
                      onClick={() => {
                        setActive(loc);
                        setShowIndex(false);
                      }}
                      className="w-full text-left px-lg py-md flex items-center gap-md hover:bg-surface-container-high transition-colors group"
                    >
                      <span className="material-symbols-outlined text-ink-mute group-hover:text-ink-main transition-colors">
                        {loc.icon}
                      </span>
                      <span className="flex-grow">
                        <span className="font-headline-sm text-headline-sm text-ink-soft block group-hover:text-primary transition-colors">
                          {en ? loc.nameEn : loc.nameZh}
                        </span>
                        <span className="font-mono-metadata text-mono-metadata text-ink-mute">
                          {en ? loc.categoryEn : loc.categoryZh}
                        </span>
                      </span>
                      <span className="font-mono-metadata text-mono-metadata text-ink-mute shrink-0">
                        {en ? loc.levelEn : loc.levelZh}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </div>
    </>
  );
}
