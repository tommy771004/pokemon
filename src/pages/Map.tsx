import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";
import MapBackdrop from "../components/MapBackdrop";

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

type MapData = {
  mapId: string;
  statusTickerEn: string;
  statusTickerZh: string;
  locations: LocationEntry[];
};

export default function MapPage() {
  const { i18n } = useTranslation();
  const [data, setData] = useState<MapData | null>(null);
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);
  const [active, setActive] = useState<LocationEntry | null>(null);
  const [showIndex, setShowIndex] = useState(false);

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
        keywords={["Pokemon Pokopia map", "Pokopia regions", "Dream Islands", "Huge Building", "Palette Town"]}
      />
    );
  }

  const locations = data.locations ?? [];
  const entryCount = String(locations.length).padStart(2, "0");

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia map", "Pokopia regions", "Dream Islands", "Huge Building", "Palette Town", "Legendary birds"]}
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

        <section className="col-span-1 md:col-span-7 flex flex-col space-y-md relative h-full">
          <div
            className="bg-bone hairline-border relative overflow-hidden group min-h-[340px] md:min-h-[560px] flex flex-col"
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

              {locations.map((loc) => (
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

            <div className="bg-bone hairline-top p-sm flex justify-between items-center z-10 relative flex-wrap gap-3">
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
            {locations.map((loc) => (
              <article
                key={loc.id}
                className={`bg-bone hairline-border p-sm relative group ambient-shadow transition-all duration-300 cursor-pointer ${
                  hoveredTarget === loc.id ? "ring-1 ring-primary" : ""
                }`}
                onMouseEnter={() => setHoveredTarget(loc.id)}
                onMouseLeave={() => setHoveredTarget(null)}
                onClick={() => setActive(loc)}
              >
                <div className="absolute top-sm right-sm text-right">
                  <span className="font-mono-metadata text-mono-metadata text-ink-mute border border-ink-mute px-2 py-0.5 rounded-full group-hover:text-primary group-hover:border-primary transition-colors">
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
            ))}
          </div>
        </section>

        {active && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink-soft/40 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <div
              className="bg-bone border border-line rounded-2xl ambient-shadow w-[95vw] md:max-w-6xl max-h-[90vh] overflow-y-auto relative paper-texture flex flex-col lg:flex-row"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-sm right-sm z-10 text-ink-mute hover:text-primary transition-colors bg-paper/80 backdrop-blur-md rounded-full p-1 border border-line-soft"
                aria-label={en ? "Close" : "關閉"}
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="lg:w-[320px] bg-surface-container-high p-lg border-b lg:border-b-0 lg:border-r border-line flex flex-col justify-center relative">
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

              <div className="lg:w-[calc(100%-320px)] p-lg md:p-xl flex flex-col gap-lg">
                <section>
                  <h3 className="font-label-caps text-label-caps text-ink-mute mb-3 uppercase tracking-wider">
                    {en ? "Area Description" : "區域詳情"}
                  </h3>
                  <p className="font-body-base text-body-base text-ink-soft leading-relaxed whitespace-pre-wrap">
                    {en ? active.descriptionEn : active.descriptionZh}
                  </p>
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-md">
                  <section className="bg-paper-warm border border-line-soft rounded-sm p-4">
                    <h3 className="font-label-caps text-label-caps text-ink-mute uppercase mb-3">
                      {en ? "Objectives" : "任務目標"}
                    </h3>
                    <ul className="space-y-3">
                      {(en ? active.objectivesEn : active.objectivesZh).map((item) => (
                        <li key={item} className="font-body-base text-body-base text-ink-soft leading-relaxed flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="bg-paper-warm border border-line-soft rounded-sm p-4">
                    <h3 className="font-label-caps text-label-caps text-ink-mute uppercase mb-3">
                      {en ? "Required Skills" : "需求技能"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(en ? active.requiredSkillsEn : active.requiredSkillsZh).map((item) => (
                        <span
                          key={item}
                          className="font-mono-metadata text-mono-metadata text-ink-soft bg-surface-container-high border border-line-soft px-2 py-1 rounded-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section className="bg-paper-warm border border-line-soft rounded-sm p-4">
                    <h3 className="font-label-caps text-label-caps text-ink-mute uppercase mb-3">
                      {en ? "Resource Focus" : "重點資源"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(en ? active.resourceFocusEn : active.resourceFocusZh).map((item) => (
                        <span
                          key={item}
                          className="font-mono-metadata text-mono-metadata text-ink-soft bg-surface-container-high border border-line-soft px-2 py-1 rounded-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section className="bg-paper-warm border border-line-soft rounded-sm p-4">
                    <h3 className="font-label-caps text-label-caps text-ink-mute uppercase mb-3">
                      {en ? "Notable Pokémon" : "關聯寶可夢"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(en ? active.notablePokemonEn : active.notablePokemonZh).map((item) => (
                        <span
                          key={item}
                          className="font-mono-metadata text-mono-metadata text-ink-soft bg-surface-container-high border border-line-soft px-2 py-1 rounded-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>

                <section>
                  <h3 className="font-label-caps text-label-caps text-ink-mute mb-3 uppercase tracking-wider">
                    {en ? "Unlocks" : "解鎖內容"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(en ? active.unlocksEn : active.unlocksZh).map((item) => (
                      <span
                        key={item}
                        className="font-mono-metadata text-mono-metadata text-ink-soft bg-bone border border-line-soft px-3 py-2 rounded-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="pt-sm border-t border-dashed border-line-soft">
                  <h3 className="font-label-caps text-label-caps text-ink-mute uppercase mb-3">
                    {en ? "Sources" : "資料來源"}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {active.sourceLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono-metadata text-mono-metadata text-ink-soft bg-paper-warm border border-line-soft px-3 py-2 rounded-sm hover:text-primary transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </section>
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
              className="bg-bone border border-line rounded-DEFAULT ambient-shadow max-w-3xl w-full max-h-[88vh] overflow-y-auto relative paper-texture"
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
                      <span className="material-symbols-outlined text-ink-mute group-hover:text-primary transition-colors">
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
