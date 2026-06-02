import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Pokedex() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    fetch("/data/pokedex.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return null;

  return (
    <>
      <header className="mb-gutter">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-md">
          <div>
            <h1 className="font-display-lg text-display-lg text-ink-soft mb-sm">{t("pokedex.title")}</h1>
            <p className="font-body-italic text-body-italic text-ink-mute max-w-2xl">
              {t("pokedex.subtitle")}
            </p>
          </div>
          <div className="mt-md md:mt-0 font-mono-metadata text-mono-metadata text-ink-faint uppercase tracking-widest text-left md:text-right">
            Vol. 01 / Updated M24
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-gutter relative">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden sticky top-[80px] z-[40] bg-surface/90 backdrop-blur-md py-4 border-b border-line-soft">
          <button 
            className="w-full flex items-center justify-between bg-bone border border-line-soft px-4 py-2 rounded-sm"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <span className="font-label-caps text-label-caps text-ink-soft uppercase">
              {t("pokedex.typeClassification")} & {t("pokedex.searchRegistry")}
            </span>
            <span className="material-symbols-outlined text-ink-mute transition-transform" style={{ transform: isFiltersOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
              expand_more
            </span>
          </button>
        </div>

        {/* Filters sidebar */}
        <aside className={`w-full md:w-64 flex-shrink-0 ${isFiltersOpen ? "block" : "hidden"} md:block`}>
          <div className="sticky top-[140px] md:top-[120px]">
            <div className="mb-lg">
              <h3 className="font-label-caps text-label-caps text-ink-soft mb-sm border-b border-line-soft pb-xs">
                {t("pokedex.typeClassification")}
              </h3>
              <ul className="space-y-xs">
                <li>
                  <button className="w-full text-left font-body-base text-body-base flex items-center justify-between py-xs text-ink-soft hover:text-primary transition-colors group p-2 rounded hover:bg-surface-container-high md:hover:bg-transparent">
                    <span className="flex items-center gap-xs">
                      <span className="w-2 h-2 rounded-full bg-ink-faint group-hover:bg-primary transition-colors"></span>
                      {t("pokedex.allTypes")}
                    </span>
                    <span className="font-mono-metadata text-mono-metadata text-ink-mute">151</span>
                  </button>
                </li>
                <li>
                  <button className="w-full text-left font-body-base text-body-base flex items-center justify-between py-xs text-primary transition-colors group p-2 rounded bg-surface-container md:bg-transparent">
                    <span className="flex items-center gap-xs">
                      <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                      {i18n.language === "en" ? "Grass" : "草"}
                    </span>
                    <span className="font-mono-metadata text-mono-metadata text-ink-mute">14</span>
                  </button>
                </li>
                 <li>
                  <button className="w-full text-left font-body-base text-body-base flex items-center justify-between py-xs text-ink-soft hover:text-primary transition-colors group p-2 rounded hover:bg-surface-container-high md:hover:bg-transparent">
                    <span className="flex items-center gap-xs">
                      <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                      {i18n.language === "en" ? "Fire" : "火"}
                    </span>
                    <span className="font-mono-metadata text-mono-metadata text-ink-mute">12</span>
                  </button>
                </li>
                {/* Additional Types can go here */}
              </ul>
            </div>
            <div className="mb-lg">
              <h3 className="font-label-caps text-label-caps text-ink-soft mb-sm border-b border-line-soft pb-xs">
                {t("pokedex.searchRegistry")}
              </h3>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full border-0 border-b border-ink-soft focus:border-primary focus:ring-0 font-body-base text-body-base py-sm px-0 transition-colors bg-transparent placeholder-ink-faint outline-none" 
                  placeholder={t("pokedex.searchPlaceholder")} 
                />
                <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-ink-mute pointer-events-none">
                  search
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md relative">
            {data.pokemon.map((pkmn: any) => (
              <article 
                key={pkmn.id} 
                className={`bg-bone border border-line-soft rounded-sm p-sm flex flex-col relative ambient-shadow transition-all duration-300 group cursor-pointer paper-texture ${!pkmn.known ? "opacity-50 hover:opacity-100" : ""}`}
              >
                <div className="flex justify-between items-start mb-md">
                  <span className={`font-body-italic text-body-italic ${pkmn.known ? "text-primary" : "text-ink-mute"}`}>
                    {pkmn.roman}
                  </span>
                  <span className="font-mono-metadata text-mono-metadata text-ink-mute bg-surface-variant px-2 py-1 rounded-sm border border-line-soft">
                    #{pkmn.id}
                  </span>
                </div>

                <div className="w-full aspect-square mb-md bg-surface-container-high rounded-sm border border-line-soft overflow-hidden relative flex items-center justify-center">
                  {pkmn.known ? (
                    <img 
                      src={pkmn.image} 
                      alt={pkmn.nameEn} 
                      className="object-contain w-full h-full mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-500 p-2 md:p-4"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-ink-faint text-4xl">visibility_off</span>
                  )}
                </div>

                <div className="flex flex-col mt-auto">
                  <h2 className={`font-headline-md text-headline-md mb-xs transition-colors truncate ${pkmn.known ? "text-ink-soft group-hover:text-primary" : "text-ink-mute"}`}>
                    {i18n.language === "en" ? pkmn.nameEn : pkmn.nameZh}
                  </h2>
                  <div className="flex flex-wrap gap-xs">
                    {(i18n.language === "en" ? pkmn.typesEn : pkmn.typesZh).map((type: string, idx: number) => (
                      <span 
                        key={idx} 
                        className={`font-label-caps text-label-caps px-2 py-0.5 rounded-sm border ${pkmn.known ? idx === 0 ? "text-tertiary border-tertiary/30" : "text-outline border-outline/30" : "text-ink-faint border-ink-faint/30"}`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-lg flex justify-center w-full">
            <button className="bg-primary text-on-primary font-label-caps text-label-caps py-sm px-lg rounded-full hover:-translate-y-[1px] hover:shadow-[0_4px_14px_0_rgba(165,58,44,0.39)] transition-all duration-200 uppercase w-full md:w-auto">
              {t("pokedex.loadMore")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
