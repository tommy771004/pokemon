import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Map() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);
  const [active, setActive] = useState<any>(null);
  const [showIndex, setShowIndex] = useState(false);

  useEffect(() => {
    fetch("/data/map.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return null;

  const en = i18n.language === "en";
  const locations: any[] = data.locations ?? [];
  const entryCount = String(locations.length).padStart(2, "0");

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter relative mt-10">
      <header className="col-span-1 md:col-span-12 mb-lg">
        <div className="hairline-bottom pb-sm flex justify-between items-end">
          <div>
            <span className="font-mono-metadata text-mono-metadata text-primary block mb-2 tracking-widest uppercase">
              {t("map.archive")}
            </span>
            <h1 className="font-display-lg text-display-lg text-on-surface">{t("map.title")}</h1>
          </div>
          <div className="text-right hidden sm:block">
            <span className="font-mono-metadata text-mono-metadata text-ink-mute block uppercase">{t("map.index")}</span>
            <span className="font-body-italic text-body-italic text-primary">II.</span>
          </div>
        </div>
      </header>

      {/* Map Column */}
      <section className="col-span-1 md:col-span-7 flex flex-col space-y-md relative h-full">
         <div className="bg-bone hairline-border relative overflow-hidden group min-h-[300px] md:min-h-[500px] h-full flex flex-col"
              style={{
                 backgroundImage: "linear-gradient(to right, var(--color-line-soft) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line-soft) 1px, transparent 1px)",
                 backgroundSize: "40px 40px"
              }}>

            <div className="absolute top-0 right-0 bg-paper-warm hairline-border border-t-0 border-r-0 px-3 py-1 z-20">
              <span className="font-mono-metadata text-mono-metadata text-ink-mute">{data.mapId}</span>
            </div>

            <div className="relative flex-grow overflow-hidden">
               <img
                  src={data.image}
                  alt="Map"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 transition-transform duration-1000 group-hover:scale-105"
               />

               {locations.map((loc: any) => (
                  <button
                     key={loc.id}
                     onMouseEnter={() => setHoveredTarget(loc.id)}
                     onMouseLeave={() => setHoveredTarget(null)}
                     onClick={() => setActive(loc)}
                     title={en ? loc.nameEn : loc.nameZh}
                     className="absolute flex flex-col items-center z-10 transition-transform duration-300 hover:scale-110 -translate-x-1/2 -translate-y-1/2"
                     style={{ top: `${loc.y}%`, left: `${loc.x}%` }}
                  >
                     <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors relative bg-bone/70 backdrop-blur-sm ${hoveredTarget === loc.id || active?.id === loc.id ? 'border-primary border-solid border-2 text-primary scale-110' : loc.type === 'region' ? 'border-2 border-solid border-primary text-primary' : 'border border-dashed border-ink-mute text-ink-soft'}`}>
                        {loc.type === 'region' && <div className="absolute -inset-1 rounded-full bg-primary/20 animate-ping"></div>}
                        <span className="material-symbols-outlined text-[20px] relative z-10">{loc.icon}</span>
                     </div>
                     <span className={`font-mono-metadata text-mono-metadata text-ink-soft bg-bone/80 px-1 mt-1 rounded-sm transition-opacity whitespace-nowrap pointer-events-none ${hoveredTarget === loc.id || active?.id === loc.id ? "opacity-100" : "opacity-0"}`}>
                        {en ? loc.nameEn : loc.nameZh}
                     </span>
                  </button>
               ))}

            </div>

            <div className="bg-bone hairline-top p-sm flex justify-between items-center z-10 relative">
              <div className="flex space-x-4 font-mono-metadata text-mono-metadata text-ink-mute uppercase">
                <span className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-2"></span> {t("map.legend.region")}</span>
                <span className="flex items-center"><span className="w-2 h-2 border border-ink-mute border-dashed rounded-full mr-2"></span> {t("map.legend.special")}</span>
              </div>
            </div>
         </div>

         <div className="hairline-border bg-paper-warm overflow-hidden flex items-center h-8">
            <div className="bg-primary text-on-primary px-3 h-full flex items-center font-mono-metadata text-mono-metadata font-bold z-10 shrink-0">
               {t("map.status")}
            </div>
            <div className="flex-grow overflow-hidden whitespace-nowrap relative">
               <div className="animate-[marquee_20s_linear_infinite] inline-block font-mono-metadata text-mono-metadata text-ink-soft" style={{
                   animation: 'marquee 20s linear infinite'
               }}>
                  {en ? data.statusTickerEn : data.statusTickerZh}
               </div>
            </div>
         </div>
      </section>

      {/* List Column */}
      <section className="col-span-1 md:col-span-5 flex flex-col space-y-md">
        <div className="flex justify-between items-end hairline-bottom pb-2">
          <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">{t("map.keyLocations")}</h2>
          <span className="font-mono-metadata text-mono-metadata text-ink-mute">{t("map.entries", { count: entryCount })}</span>
        </div>
        <div className="flex flex-col space-y-sm">
           {locations.map((loc: any) => (
             <article
               key={loc.id}
               className={`bg-bone hairline-border p-sm relative group ambient-shadow transition-all duration-300 cursor-pointer ${hoveredTarget === loc.id ? 'ring-1 ring-primary' : ''}`}
               onMouseEnter={() => setHoveredTarget(loc.id)}
               onMouseLeave={() => setHoveredTarget(null)}
               onClick={() => setActive(loc)}
             >
               <div className="absolute top-sm right-sm text-right">
                 <span className="font-mono-metadata text-mono-metadata text-ink-mute border border-ink-mute px-2 py-0.5 rounded-full group-hover:text-primary group-hover:border-primary transition-colors">
                   {en ? loc.levelEn : loc.levelZh}
                 </span>
               </div>
               <div className="mb-3 pr-16 min-w-0">
                 <span className="font-body-italic text-body-italic text-ink-mute block mb-1 truncate">
                   {en ? loc.categoryEn : loc.categoryZh}
                 </span>
                 <h3 className="font-headline-md text-headline-md text-on-surface break-words">
                   {en ? loc.nameEn : loc.nameZh}
                 </h3>
               </div>
               <p className="font-body-base text-body-base text-ink-soft mb-4 line-clamp-2 break-words text-wrap">
                 {en ? loc.descriptionEn : loc.descriptionZh}
               </p>
               <div className="flex flex-wrap gap-3 font-mono-metadata text-mono-metadata text-ink-mute border-t border-line-soft pt-3">
                  {(en ? loc.tagsEn : loc.tagsZh).map((tag: string, idx: number) => (
                     <span key={idx} className="flex items-center">
                        <span className="material-symbols-outlined text-[14px] mr-1">{loc.tagIcons[idx]}</span> {tag}
                     </span>
                  ))}
               </div>
             </article>
           ))}
        </div>
        <button
          onClick={() => setShowIndex(true)}
          className="bg-primary text-on-primary font-label-caps text-label-caps py-3 px-6 rounded-full hover:bg-primary-container hover:-translate-y-[1px] transition-all shadow-[0_4px_14px_0_rgba(165,58,44,0.39)] w-full sm:w-auto self-start mt-4 uppercase">
            {t("map.viewIndex")}
        </button>
      </section>

      {/* Location Detail Modal */}
      {active && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink-soft/40 backdrop-blur-sm" onClick={() => setActive(null)}>
          <div className="bg-bone border border-line rounded-DEFAULT ambient-shadow w-[95vw] md:max-w-5xl max-h-[88vh] overflow-y-auto relative paper-texture flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActive(null)}
              className="absolute top-sm right-sm z-10 text-ink-mute hover:text-primary transition-colors bg-paper/80 backdrop-blur-md rounded-full p-1 border border-line-soft md:hidden"
              aria-label={t("map.close")}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="md:w-1/3 bg-surface-container-high p-lg border-b md:border-b-0 md:border-r border-line flex flex-col items-center md:items-start justify-center relative min-h-[250px]">
              <button
                onClick={() => setActive(null)}
                className="hidden md:block absolute top-sm left-sm text-ink-mute hover:text-primary transition-colors bg-paper/80 backdrop-blur-md rounded-full p-1 border border-line-soft"
                aria-label={t("map.close")}
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-primary text-primary flex items-center justify-center shrink-0 bg-bone mb-md shadow-[0_0_40px_-10px_rgba(165,58,44,0.3)]">
                <span className="material-symbols-outlined text-[48px] sm:text-[64px]">{active.icon}</span>
              </div>
              <div className="w-full text-center md:text-left">
                <span className="font-body-italic text-body-italic text-ink-mute block mb-xs">{en ? active.categoryEn : active.categoryZh}</span>
                <h2 className="font-display-md text-display-md text-ink-soft leading-tight mb-md break-words">{en ? active.nameEn : active.nameZh}</h2>
                <span className="font-mono-metadata text-mono-metadata text-ink-mute border border-ink-mute px-3 py-1 rounded-full shadow-sm">
                  {en ? active.levelEn : active.levelZh}
                </span>
              </div>
            </div>
            
            <div className="md:w-2/3 p-lg md:p-xl flex flex-col">
              <h3 className="font-label-caps text-label-caps text-ink-mute mb-md uppercase tracking-wider">{t("map.description", "Area Description")}</h3>
              <p className="font-body-base text-body-base text-ink-soft leading-relaxed mb-xl whitespace-pre-wrap flex-grow min-h-[150px]">
                {en ? active.descriptionEn : active.descriptionZh}
              </p>
              <div>
                <h3 className="font-label-caps text-label-caps text-ink-mute mb-sm uppercase tracking-wider">{t("map.resources", "Key Features & Resources")}</h3>
                <div className="flex flex-wrap gap-sm font-mono-metadata text-mono-metadata text-ink-mute">
                  {(en ? active.tagsEn : active.tagsZh).map((tag: string, idx: number) => (
                    <span key={idx} className="flex items-center bg-surface-variant border border-line px-3 py-1.5 rounded-sm shadow-sm transition-transform hover:-translate-y-0.5">
                      <span className="material-symbols-outlined text-[16px] mr-2 text-primary">{active.tagIcons[idx]}</span> {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-8 pt-sm border-t border-dashed border-line-soft">
                 <p className="font-mono-metadata text-mono-metadata text-ink-faint flex items-center justify-start gap-2 flex-wrap mb-1">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">link</span>{en ? "Source:" : "資料出處:"}</span>
                    <a href="https://bulbapedia.bulbagarden.net/wiki/Main_Page" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline decoration-dashed underline-offset-2">
                       Bulbapedia
                    </a>
                    <span>·</span>
                    <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline decoration-dashed underline-offset-2">
                       PokeAPI
                    </a>
                 </p>
                 <p className="font-mono-metadata text-mono-metadata text-ink-faint text-[11px] leading-tight flex items-start gap-1 mt-1">
                    <span className="material-symbols-outlined text-[12px] mt-[1px]">copyright</span>
                    <span>{en ? "Nintendo, Game Freak, and The Pokémon Company." : "版權歸屬任天堂、Game Freak 及 The Pokémon Company。本站僅作攻略資訊整合。"}</span>
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Index Overlay */}
      {showIndex && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-ink-soft/40 backdrop-blur-sm" onClick={() => setShowIndex(false)}>
          <div className="bg-bone border border-line rounded-DEFAULT ambient-shadow max-w-2xl w-full max-h-[88vh] overflow-y-auto relative paper-texture" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-bone/95 backdrop-blur-md flex justify-between items-center px-lg py-md border-b border-line-soft z-10">
              <h2 className="font-headline-sm text-headline-sm text-ink-soft uppercase">{t("map.fullIndex")}</h2>
              <button onClick={() => setShowIndex(false)} className="text-ink-mute hover:text-primary transition-colors" aria-label={t("map.close")}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <ul className="divide-y divide-line-soft">
              {locations.map((loc: any) => (
                <li key={loc.id}>
                  <button
                    onClick={() => { setActive(loc); setShowIndex(false); }}
                    className="w-full text-left px-lg py-md flex items-center gap-md hover:bg-surface-container-high transition-colors group"
                  >
                    <span className="material-symbols-outlined text-ink-mute group-hover:text-primary transition-colors">{loc.icon}</span>
                    <span className="flex-grow">
                      <span className="font-headline-sm text-headline-sm text-ink-soft block group-hover:text-primary transition-colors">{en ? loc.nameEn : loc.nameZh}</span>
                      <span className="font-mono-metadata text-mono-metadata text-ink-mute">{en ? loc.categoryEn : loc.categoryZh}</span>
                    </span>
                    <span className="font-mono-metadata text-mono-metadata text-ink-mute shrink-0">{en ? loc.levelEn : loc.levelZh}</span>
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
  );
}
