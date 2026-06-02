import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const PAGE_SIZE = 12;

export default function Pokedex() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [data, setData] = useState<any>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [active, setActive] = useState<any>(null);

  useEffect(() => {
    fetch("/data/pokedex.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  // Pick up ?q= from the global search box.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) setQuery(q);
  }, [location.search]);

  const en = i18n.language === "en";
  const list: any[] = data?.pokemon ?? [];

  // Build the type list + counts dynamically from known entries.
  const types = useMemo(() => {
    const counts = new Map<string, { en: string; zh: string; count: number }>();
    for (const p of list) {
      if (!p.known) continue;
      (p.typesEn ?? []).forEach((te: string, idx: number) => {
        if (te === "UNKNOWN") return;
        const existing = counts.get(te);
        if (existing) existing.count += 1;
        else counts.set(te, { en: te, zh: p.typesZh?.[idx] ?? te, count: 1 });
      });
    }
    return Array.from(counts.values()).sort((a, b) => b.count - a.count);
  }, [list]);

  const knownCount = useMemo(() => list.filter((p) => p.known).length, [list]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((p) => {
      const matchesType = !selectedType || (p.typesEn ?? []).includes(selectedType);
      const matchesQuery =
        !q ||
        p.nameEn?.toLowerCase().includes(q) ||
        p.nameZh?.includes(query.trim()) ||
        p.id?.includes(q);
      return matchesType && matchesQuery;
    });
  }, [list, selectedType, query]);

  // Reset pagination whenever the filter set changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedType, query]);

  if (!data) return null;

  const visible = filtered.slice(0, visibleCount);

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
            {t("pokedex.speciesLogged", { count: knownCount })}
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
                  <button
                    onClick={() => setSelectedType(null)}
                    className={`w-full text-left font-body-base text-body-base flex items-center justify-between py-xs transition-colors group p-2 rounded ${selectedType === null ? "text-primary bg-surface-container md:bg-transparent" : "text-ink-soft hover:text-primary hover:bg-surface-container-high md:hover:bg-transparent"}`}
                  >
                    <span className="flex items-center gap-xs">
                      <span className={`w-2 h-2 rounded-full transition-colors ${selectedType === null ? "bg-primary" : "bg-ink-faint group-hover:bg-primary"}`}></span>
                      {t("pokedex.allTypes")}
                    </span>
                    <span className="font-mono-metadata text-mono-metadata text-ink-mute">{knownCount}</span>
                  </button>
                </li>
                {types.map((ty) => (
                  <li key={ty.en}>
                    <button
                      onClick={() => setSelectedType(ty.en)}
                      className={`w-full text-left font-body-base text-body-base flex items-center justify-between py-xs transition-colors group p-2 rounded ${selectedType === ty.en ? "text-primary bg-surface-container md:bg-transparent" : "text-ink-soft hover:text-primary hover:bg-surface-container-high md:hover:bg-transparent"}`}
                    >
                      <span className="flex items-center gap-xs">
                        <span className={`w-2 h-2 rounded-full transition-colors ${selectedType === ty.en ? "bg-primary" : "bg-tertiary group-hover:bg-primary"}`}></span>
                        {en ? ty.en : ty.zh}
                      </span>
                      <span className="font-mono-metadata text-mono-metadata text-ink-mute">{ty.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-lg">
              <h3 className="font-label-caps text-label-caps text-ink-soft mb-sm border-b border-line-soft pb-xs">
                {t("pokedex.searchRegistry")}
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full border-0 border-b border-ink-soft focus:border-primary focus:ring-0 font-body-base text-body-base py-sm px-0 pr-6 transition-colors bg-transparent placeholder-ink-faint outline-none"
                  placeholder={t("pokedex.searchPlaceholder")}
                />
                {query ? (
                  <button
                    onClick={() => setQuery("")}
                    className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-ink-mute hover:text-primary transition-colors"
                    aria-label={t("pokedex.close")}
                  >
                    close
                  </button>
                ) : (
                  <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-ink-mute pointer-events-none">
                    search
                  </span>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-grow">
          {visible.length === 0 ? (
            <div className="border border-dashed border-line-soft rounded-sm py-xl flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-ink-faint text-4xl mb-sm">search_off</span>
              <p className="font-body-base text-body-base text-ink-mute">{t("pokedex.noResults")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md relative">
              {visible.map((pkmn: any) => (
                <article
                  key={pkmn.id}
                  onClick={() => pkmn.known && setActive(pkmn)}
                  className={`bg-bone border border-line-soft rounded-sm p-sm flex flex-col relative ambient-shadow transition-all duration-300 group paper-texture ${pkmn.known ? "cursor-pointer hover:-translate-y-[2px]" : "opacity-50 hover:opacity-100"}`}
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
                        loading="lazy"
                        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500 p-2 md:p-4"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-ink-faint text-4xl">visibility_off</span>
                    )}
                  </div>

                  <div className="flex flex-col mt-auto">
                    <h2 className={`font-headline-md text-headline-md mb-xs transition-colors truncate ${pkmn.known ? "text-ink-soft group-hover:text-primary" : "text-ink-mute"}`}>
                      {en ? pkmn.nameEn : pkmn.nameZh}
                    </h2>
                    <div className="flex flex-wrap gap-xs">
                      {(en ? pkmn.typesEn : pkmn.typesZh).map((type: string, idx: number) => (
                        <span
                          key={idx}
                          className={`font-label-caps text-label-caps px-2 py-0.5 rounded-sm border ${pkmn.known ? idx === 0 ? "text-tertiary border-tertiary/30" : "text-outline border-outline/30" : "text-ink-faint border-ink-faint/30"}`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                    {pkmn.known && pkmn.specialtyEn && pkmn.specialtyEn !== "—" && (
                      <span className="font-mono-metadata text-mono-metadata text-ink-faint mt-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">bolt</span>
                        {en ? pkmn.specialtyEn : pkmn.specialtyZh}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {visibleCount < filtered.length && (
            <div className="mt-lg flex justify-center w-full">
              <button
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                className="bg-primary text-on-primary font-label-caps text-label-caps py-sm px-lg rounded-full hover:-translate-y-[1px] hover:shadow-[0_4px_14px_0_rgba(165,58,44,0.39)] transition-all duration-200 uppercase w-full md:w-auto"
              >
                {t("pokedex.loadMore")} ({filtered.length - visibleCount})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {active && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink-soft/40 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="bg-bone border border-line rounded-DEFAULT ambient-shadow max-w-2xl w-full max-h-[88vh] overflow-y-auto relative paper-texture"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActive(null)}
              className="absolute top-sm right-sm z-10 text-ink-mute hover:text-primary transition-colors bg-paper/80 backdrop-blur-md rounded-full p-1 border border-line-soft"
              aria-label={t("pokedex.close")}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="bg-surface-container-high border-b sm:border-b-0 sm:border-r border-line-soft flex items-center justify-center p-lg aspect-square">
                <img src={active.image} alt={active.nameEn} className="object-contain w-full h-full" />
              </div>
              <div className="p-lg flex flex-col">
                <div className="flex justify-between items-start mb-sm">
                  <span className="font-body-italic text-body-italic text-primary">{active.roman}</span>
                  <span className="font-mono-metadata text-mono-metadata text-ink-mute bg-surface-variant px-2 py-1 rounded-sm border border-line-soft">
                    #{active.id}
                  </span>
                </div>
                <h2 className="font-headline-md text-headline-md text-ink-soft leading-tight">
                  {en ? active.nameEn : active.nameZh}
                </h2>
                <span className="font-body-italic text-body-italic text-ink-mute mb-md">
                  {en ? active.nameZh : active.nameEn}
                </span>

                <div className="flex flex-wrap gap-xs mb-md">
                  {(en ? active.typesEn : active.typesZh).map((type: string, idx: number) => (
                    <span
                      key={idx}
                      className={`font-label-caps text-label-caps px-2 py-0.5 rounded-sm border ${idx === 0 ? "text-tertiary border-tertiary/30" : "text-outline border-outline/30"}`}
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-sm">
                  {active.roleEn && (
                    <div className="bg-paper-warm hairline-border p-sm rounded-sm">
                      <div className="font-label-caps text-label-caps text-ink-mute mb-1">{t("pokedex.role")}</div>
                      <div className="font-body-base text-body-base text-ink-soft">{en ? active.roleEn : active.roleZh}</div>
                    </div>
                  )}
                  {active.specialtyEn && active.specialtyEn !== "—" && (
                    <div className="bg-paper-warm hairline-border p-sm rounded-sm">
                      <div className="font-label-caps text-label-caps text-ink-mute mb-1">{t("pokedex.specialty")}</div>
                      <div className="font-body-base text-body-base text-primary">{en ? active.specialtyEn : active.specialtyZh}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {active.descriptionEn && (
              <div className="p-lg pt-0 sm:pt-lg border-t border-line-soft mt-0 sm:mt-0">
                <p className="font-body-base text-body-base text-ink-soft leading-relaxed">
                  {en ? active.descriptionEn : active.descriptionZh}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
