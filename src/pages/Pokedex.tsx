import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import Seo from "../components/Seo";

const PAGE_SIZE = 12;

type PokedexSkill = {
  categoryEn: string;
  categoryZh: string;
  nameEn: string;
  nameZh: string;
  detailEn: string;
  detailZh: string;
};

export default function Pokedex() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [data, setData] = useState<any>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"id" | "alphabetical" | "role">("id");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [active, setActive] = useState<any>(null);
  const [expandReadMore, setExpandReadMore] = useState(false);

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
  const list: any[] = useMemo(() => {
    return (data?.pokemon ?? []).filter((p: any) => 
      !["Protagonist", "Story Character", "Mentor"].includes(p.roleEn)
    );
  }, [data]);

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
    const result = list.filter((p) => {
      const matchesType = !selectedType || (p.typesEn ?? []).includes(selectedType);
      const matchesQuery =
        !q ||
        p.nameEn?.toLowerCase().includes(q) ||
        p.nameZh?.includes(query.trim()) ||
        p.id?.includes(q);
      return matchesType && matchesQuery;
    });

    if (sortBy === "alphabetical") {
      result.sort((a, b) => {
        const nameA = en ? a.nameEn : a.nameZh;
        const nameB = en ? b.nameEn : b.nameZh;
        return (nameA || "").localeCompare(nameB || "");
      });
    } else if (sortBy === "role") {
      result.sort((a, b) => {
        const roleA = en ? a.roleEn : a.roleZh;
        const roleB = en ? b.roleEn : b.roleZh;
        if (roleA !== roleB) {
          return (roleA || "").localeCompare(roleB || "");
        }
        // Fallback to ID if roles are identical
        return parseInt(a.id, 10) - parseInt(b.id, 10);
      });
    } else {
      result.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
    }

    return result;
  }, [list, selectedType, query, sortBy, en]);

  // Reset pagination whenever the filter set or sort changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedType, query, sortBy]);

  const seoTitle = en ? "Pokédex Skills & Species Archive | Pokopia Chronicles" : "寶可夢圖鑑與技能檔案 | Pokopia 年代記";
  const seoDescription = en
    ? "Browse the Pokopia species archive with structured life, attack, and support skills, habitat roles, and story-linked entries."
    : "瀏覽 Pokopia 的寶可夢檔案，查看每隻寶可夢的生活技能、攻擊技能、輔助技能、棲地定位與劇情關聯。";

  if (!data) {
    return (
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia", "Pokopia Pokedex", "Pokemon skills", "Pokopia guide"]}
      />
    );
  }

  const visible = filtered.slice(0, visibleCount);
  const activeSkills: PokedexSkill[] = active?.skills ?? [];

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia", "Pokopia Pokedex", "Pokemon skills", "Habitat specialties", "Pokopia guide"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: seoTitle,
          description: seoDescription,
          url: "https://pokopiachronicles.com/pokedex",
          inLanguage: en ? "en" : "zh-Hant",
          about: "Pokemon Pokopia species archive and skills",
        }}
      />
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
        <div className="flex-grow flex flex-col min-w-0">
          <div className="flex justify-end mb-md gap-3 items-center">
            <label htmlFor="sort-select" className="font-label-caps text-label-caps text-ink-mute">
              {en ? "Sort by:" : "排序方式："}
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="font-body-base text-body-base px-3 py-1.5 rounded-sm bg-surface-container border border-line-soft text-ink-soft cursor-pointer focus:outline-none focus:border-primary transition-all hover:border-ink-soft appearance-none min-w-[120px]"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
            >
              <option value="id">{en ? "ID (Default)" : "編號 (預設)"}</option>
              <option value="alphabetical">{en ? "Alphabetical" : "按名稱"}</option>
              <option value="role">{en ? "Role Type" : "按角色類型"}</option>
            </select>
          </div>
          {visible.length === 0 ? (
            <div className="border border-dashed border-line-soft rounded-sm py-xl flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-ink-faint text-4xl mb-sm">search_off</span>
              <p className="font-body-base text-body-base text-ink-mute">{t("pokedex.noResults")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-md relative">
              {visible.map((pkmn: any) => (
                <motion.article
                  key={pkmn.id}
                  onClick={() => pkmn.known && setActive(pkmn)}
                  whileHover={pkmn.known ? { scale: 1.02, y: -2 } : {}}
                  className={`bg-bone border border-line-soft rounded-sm p-2.5 sm:p-sm flex flex-col relative ambient-shadow transition-colors transition-opacity duration-300 group paper-texture ${pkmn.known ? "cursor-pointer" : "opacity-50 hover:opacity-100"}`}
                >
                  <div className="flex justify-between items-start mb-2 sm:mb-sm">
                    <span className={`font-body-italic text-body-italic text-sm sm:text-base ${pkmn.known ? "text-primary" : "text-ink-mute"}`}>
                      {pkmn.roman}
                    </span>
                    <span className="font-mono-metadata text-mono-metadata text-ink-mute bg-surface-variant px-1.5 py-0.5 rounded-sm border border-line-soft text-[10px]">
                      #{pkmn.id}
                    </span>
                  </div>

                  <div className="w-full h-24 sm:h-32 mb-2 sm:mb-xs bg-surface-container-high rounded-sm border border-line-soft overflow-hidden relative flex items-center justify-center group/img">
                    {pkmn.known ? (
                      <img
                        src={pkmn.image}
                        alt={pkmn.nameEn}
                        loading="lazy"
                        className="object-contain max-w-[70px] max-h-[70px] sm:max-w-[100px] sm:max-h-[100px] group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-ink-faint text-3xl sm:text-4xl">visibility_off</span>
                    )}
                  </div>
                  
                  {pkmn.known && (
                    <div className="text-[9px] sm:text-[10px] text-ink-faint mb-2 sm:mb-sm flex gap-1 flex-wrap">
                      <span>{en ? "Image:" : "圖片:"}</span>
                      <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline decoration-dashed underline-offset-1" onClick={(e) => e.stopPropagation()}>PokeAPI</a>
                    </div>
                  )}

                  <div className="flex flex-col mt-auto">
                    <h2 className={`font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md mb-1 md:mb-xs transition-colors truncate ${pkmn.known ? "text-ink-soft group-hover:text-primary" : "text-ink-mute"}`}>
                      {en ? pkmn.nameEn : pkmn.nameZh}
                    </h2>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                      <div className="flex flex-wrap gap-1 sm:gap-xs">
                        {(en ? pkmn.typesEn : pkmn.typesZh).map((type: string, idx: number) => (
                          <span
                            key={idx}
                            className={`font-label-caps text-label-caps px-1 py-0.5 sm:px-2 rounded-sm border text-[9px] sm:text-[11px] ${pkmn.known ? idx === 0 ? "text-tertiary border-tertiary/30" : "text-outline border-outline/30" : "text-ink-faint border-ink-faint/30"}`}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                      {pkmn.known && (en ? pkmn.roleEn : pkmn.roleZh) && (
                        <span className="font-mono-metadata text-mono-metadata text-ink-soft flex items-center gap-0.5 sm:gap-1 bg-surface-container-high px-1 sm:px-2 py-0.5 rounded w-fit text-[9px] sm:text-[10px]">
                          <span className="material-symbols-outlined text-[10px] sm:text-[14px]">badge</span>
                          {en ? pkmn.roleEn : pkmn.roleZh}
                        </span>
                      )}
                      {pkmn.known && pkmn.specialtyEn && pkmn.specialtyEn !== "—" && (
                        <span className="font-mono-metadata text-mono-metadata text-ink-faint flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px]">
                          <span className="material-symbols-outlined text-[10px] sm:text-[14px]">bolt</span>
                          {en ? pkmn.specialtyEn : pkmn.specialtyZh}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
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
          className="fixed inset-0 z-[70] flex items-end md:items-center justify-center md:p-4 bg-ink-soft/40 backdrop-blur-sm"
          onClick={() => {
            setActive(null);
            setExpandReadMore(false);
          }}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-bone border-t md:border border-line rounded-t-3xl md:rounded-2xl ambient-shadow w-full md:max-w-2xl lg:max-w-3xl h-[92vh] md:h-auto md:max-h-[90vh] overflow-y-auto relative paper-texture mx-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 w-full flex justify-center pt-3 pb-1 md:hidden bg-bone/80 backdrop-blur-md z-20">
              <div className="w-12 h-1.5 bg-line-soft rounded-full"></div>
            </div>
            <button
              onClick={() => {
                setActive(null);
                setExpandReadMore(false);
              }}
              className="absolute top-sm right-sm z-10 text-ink-mute hover:text-primary transition-colors bg-paper/80 backdrop-blur-md rounded-full p-1 border border-line-soft"
              aria-label={t("pokedex.close")}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-surface-container-high border-b md:border-b-0 md:border-r border-line-soft flex flex-col items-center justify-center p-4 sm:p-md h-48 md:h-auto md:aspect-square relative flex-shrink-0">
                <img src={active.image} alt={active.nameEn} className="object-contain max-w-[150px] max-h-[150px] sm:max-w-[200px] sm:max-h-[200px] mb-4" />
                <div className="absolute bottom-2 right-2 text-[10px] text-ink-faint flex gap-1 bg-surface/50 backdrop-blur-sm px-2 py-1 rounded">
                  <span>{en ? "Img Source:" : "圖片出處:"}</span>
                  <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline decoration-dashed underline-offset-2">PokeAPI</a>
                </div>
              </div>
              <div className="p-4 sm:p-6 md:p-lg flex flex-col">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-sm mt-4">
                  {active.roleEn && (
                    <div className="bg-paper-warm md:hairline-border border-y md:border-y-0 border-line-soft py-4 px-4 md:py-2 md:px-3 md:rounded-sm flex items-center justify-between gap-2 -mx-4 sm:-mx-6 md:mx-0 mt-[-1px] md:mt-0">
                      <span className="font-label-caps text-label-caps text-ink-mute shrink-0">{t("pokedex.role")}</span>
                      <span className="font-body-base text-body-base text-ink-soft text-right">{en ? active.roleEn : active.roleZh}</span>
                    </div>
                  )}
                  {active.specialtyEn && active.specialtyEn !== "—" && (
                    <div className="bg-paper-warm md:hairline-border border-y md:border-y-0 border-line-soft py-4 px-4 md:py-2 md:px-3 md:rounded-sm flex items-center justify-between gap-2 -mx-4 sm:-mx-6 md:mx-0 mt-[-1px] md:mt-0">
                      <span className="font-label-caps text-label-caps text-ink-mute shrink-0">{t("pokedex.specialty")}</span>
                      <span className="font-body-base text-body-base text-primary text-right">{en ? active.specialtyEn : active.specialtyZh}</span>
                    </div>
                  )}
                  {activeSkills.length > 0 && (
                    <div className="bg-paper-warm md:hairline-border border-y md:border-y-0 border-line-soft py-5 px-4 md:py-3 md:px-3 md:rounded-sm md:col-span-2 -mx-4 sm:-mx-6 md:mx-0 mt-[-1px] md:mt-0">
                      <span className="font-label-caps text-label-caps text-ink-mute block mb-3 sm:mb-2">
                        {t("pokedex.skills")}
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {activeSkills.map((skill) => (
                          <article
                            key={`${skill.categoryEn}-${skill.nameEn}`}
                            className="bg-surface-container-high border border-line-soft rounded-sm px-3 py-2"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <span className="font-label-caps text-label-caps text-ink-mute uppercase">
                                {en ? skill.categoryEn : skill.categoryZh}
                              </span>
                              <span className="font-mono-metadata text-mono-metadata text-primary">
                                {en ? skill.nameEn : skill.nameZh}
                              </span>
                            </div>
                            <p className="font-body-base text-body-base text-ink-soft leading-relaxed">
                              {en ? skill.detailEn : skill.detailZh}
                            </p>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {active.descriptionEn && (
              <div className="p-4 sm:p-6 md:p-lg pt-0 sm:pt-6 md:pt-lg border-t border-line-soft mt-0 flex flex-col justify-between flex-grow">
                <p className={`font-body-base text-body-base text-ink-soft leading-relaxed transition-all ${expandReadMore ? "" : "line-clamp-3 mb-2"}`}>
                  {en ? active.descriptionEn : active.descriptionZh}
                </p>
                <button
                  onClick={() => setExpandReadMore(!expandReadMore)}
                  className="text-left font-label-caps text-label-caps text-primary hover:text-tertiary transition-colors mb-md self-start"
                >
                  {expandReadMore ? (i18n.language.startsWith('en') ? 'Show Less' : '顯示較少') : (i18n.language.startsWith('en') ? 'Read More' : '閱讀更多')}
                </button>
                <div className="mt-auto border-t border-dashed border-line-soft pt-sm">
                 <p className="font-mono-metadata text-mono-metadata text-ink-faint flex items-center justify-start gap-2 flex-wrap mb-1">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">link</span>{i18n.language === "en" ? "Source:" : "資料出處:"}</span>
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
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
