import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Map() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/map.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return null;

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
               
               {data.locations.map((loc: any) => (
                  <button 
                     key={loc.id}
                     onMouseEnter={() => setHoveredTarget(loc.id)}
                     onMouseLeave={() => setHoveredTarget(null)}
                     className="absolute flex flex-col items-center z-10 transition-transform duration-300 hover:scale-110"
                     style={{ top: `${loc.y}%`, left: `${loc.x}%` }}
                  >
                     <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors relative ${hoveredTarget === loc.id ? 'border-primary border-solid scale-110' : 'border-ink-mute border-dashed'} ${loc.type === 'hub' ? 'border-2 border-solid border-primary text-primary' : 'border text-ink-soft'}`}>
                        {loc.type === 'hub' && <div className="absolute -inset-1 rounded-full bg-primary/20 animate-ping"></div>}
                        <span className="material-symbols-outlined text-[20px]">{loc.icon}</span>
                     </div>
                  </button>
               ))}
               
            </div>

            <div className="bg-bone hairline-top p-sm flex justify-between items-center z-10 relative">
              <div className="flex space-x-4 font-mono-metadata text-mono-metadata text-ink-mute uppercase">
                <span className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-2"></span> {t("map.legend.majorHub")}</span>
                <span className="flex items-center"><span className="w-2 h-2 border border-ink-mute border-dashed rounded-full mr-2"></span> {t("map.legend.route")}</span>
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
                  {i18n.language === "en" ? data.statusTickerEn : data.statusTickerZh}
               </div>
            </div>
         </div>
      </section>

      {/* List Column */}
      <section className="col-span-1 md:col-span-5 flex flex-col space-y-md">
        <div className="flex justify-between items-end hairline-bottom pb-2">
          <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">{t("map.keyLocations")}</h2>
          <span className="font-mono-metadata text-mono-metadata text-ink-mute">{t("map.entries", { count: "03" })}</span>
        </div>
        <div className="flex flex-col space-y-sm">
           {data.locations.map((loc: any) => (
             <article 
               key={loc.id}
               className={`bg-bone hairline-border p-sm relative group ambient-shadow transition-all duration-300 cursor-pointer ${hoveredTarget === loc.id ? 'ring-1 ring-primary' : ''}`}
               onMouseEnter={() => setHoveredTarget(loc.id)}
               onMouseLeave={() => setHoveredTarget(null)}
             >
               <div className="absolute top-sm right-sm text-right">
                 <span className="font-mono-metadata text-mono-metadata text-ink-mute border border-ink-mute px-2 py-0.5 rounded-full group-hover:text-primary group-hover:border-primary transition-colors">
                   {i18n.language === "en" ? loc.levelEn : loc.levelZh}
                 </span>
               </div>
               <div className="mb-3">
                 <span className="font-body-italic text-body-italic text-ink-mute block mb-1">
                   {i18n.language === "en" ? loc.categoryEn : loc.categoryZh}
                 </span>
                 <h3 className="font-headline-md text-headline-md text-on-surface">
                   {i18n.language === "en" ? loc.nameEn : loc.nameZh}
                 </h3>
               </div>
               <p className="font-body-base text-body-base text-ink-soft mb-4 line-clamp-2">
                 {i18n.language === "en" ? loc.descriptionEn : loc.descriptionZh}
               </p>
               <div className="flex flex-wrap gap-3 font-mono-metadata text-mono-metadata text-ink-mute border-t border-line-soft pt-3">
                  {(i18n.language === "en" ? loc.tagsEn : loc.tagsZh).map((tag: string, idx: number) => (
                     <span key={idx} className="flex items-center">
                        <span className="material-symbols-outlined text-[14px] mr-1">{loc.tagIcons[idx]}</span> {tag}
                     </span>
                  ))}
               </div>
             </article>
           ))}
        </div>
        <button className="bg-primary text-on-primary font-label-caps text-label-caps py-3 px-6 rounded-full hover:bg-primary-container hover:-translate-y-[1px] transition-all shadow-[0_4px_14px_0_rgba(165,58,44,0.39)] w-full sm:w-auto self-start mt-4 uppercase">
            {t("map.viewIndex")}
        </button>
      </section>

      <style>{`
          @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
          }
      `}</style>
    </div>
  );
}
