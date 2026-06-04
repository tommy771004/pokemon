import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";
import ScrollFade from "../components/ScrollFade";
import { useFavorites } from "../hooks/useFavorites";

const PAGE_SIZE = 40;

export default function Items() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const { favorites, toggleFavorite } = useFavorites("fav_items");

  const en = i18n.language === "en";

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, selectedCategory, showFavoritesOnly]);

  useEffect(() => {
    fetch("/data/items.json")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData([]));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((item) => {
      const nameCurrent = en
        ? item.nameEn || item.name
        : item.name || item.nameEn;
      const matchesQuery =
        !q || nameCurrent?.toLowerCase().includes(q) || item.id?.includes(q);
      const matchesCategory =
        !selectedCategory || item.categoryKey === selectedCategory;
      const matchesFavorites = !showFavoritesOnly || favorites.has(item.id);
      return matchesQuery && matchesCategory && matchesFavorites;
    });
  }, [data, query, selectedCategory, en, showFavoritesOnly, favorites]);

  const visible = filtered.slice(0, visibleCount);

  const CATEGORIES = [
    { key: "food", en: "Food", zh: "食物" },
    { key: "material", en: "Material", zh: "素材" },
    { key: "furniture", en: "Furniture", zh: "家具" },
    { key: "goods", en: "Goods", zh: "雜貨" },
    { key: "nature", en: "Nature", zh: "自然物" },
    { key: "kit", en: "Kit", zh: "套件/模組" },
    { key: "outdoor", en: "Outdoor", zh: "戶外" },
    { key: "utility", en: "Utility", zh: "設備" },
    { key: "building", en: "Building", zh: "建築" },
    { key: "block", en: "Block", zh: "方塊" },
    { key: "key-item", en: "Key Item", zh: "重要物品" },
    { key: "other", en: "Other", zh: "其他" },
    { key: "uncollectable", en: "Uncollectable", zh: "不可收集" },
  ];

  const resetFilters = () => {
    setSelectedCategory(null);
    setQuery("");
    setShowFavoritesOnly(false);
  };

  const hasActiveFilters = Boolean(selectedCategory || query || showFavoritesOnly);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-gutter relative pb-4xl mt-6">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden sticky top-[70px] z-[30] bg-surface/90 backdrop-blur-md pt-4 pb-2 border-b border-line-soft -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2 className="font-headline-sm text-headline-sm text-ink-main flex items-center gap-2 flex-1">
              <span className="material-symbols-outlined text-[20px]">
                category
              </span>
              {en ? "Items Directory" : "物品圖鑑"}
              {hasActiveFilters && (
                <span className="ml-2 font-mono-metadata text-[10px] text-ink-mute uppercase tracking-widest whitespace-nowrap">
                  {filtered.length} {en ? "Matches" : "筆"}
                </span>
              )}
            </h2>
            <button
              className="flex items-center justify-center gap-2 bg-paper hover:bg-surface-container border border-line-soft px-3 py-1.5 hover:shadow-sm transition-all rounded-sm flex-shrink-0"
              onClick={() => setIsFiltersOpen(true)}
            >
              <span className="material-symbols-outlined text-[16px]">
                filter_list
              </span>
              <span className="font-label-caps text-xs text-ink-main uppercase">
                {en ? "Filters" : "篩選"}
              </span>
              {hasActiveFilters && (
                <span className="font-mono-metadata text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full ml-1 leading-none">
                  {(selectedCategory ? 1 : 0) + (query ? 1 : 0) + (showFavoritesOnly ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Filter Overlay */}
        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFiltersOpen(false)}
              className="fixed inset-0 bg-ink-main/20 backdrop-blur-sm z-[50] md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Filters sidebar / Drawer */}
        <aside
          className={`fixed inset-y-0 right-0 w-[85vw] max-w-[320px] bg-paper shadow-2xl z-[60] p-6 overflow-y-auto transition-transform duration-300 md:static md:w-64 md:flex-shrink-0 md:bg-transparent md:shadow-none md:p-0 md:translate-x-0 md:z-auto ${isFiltersOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Drawer Header (Mobile only) */}
          <div className="flex items-center justify-between md:hidden mb-6 pb-4 border-b border-line-soft">
            <span className="font-headline-sm text-lg text-ink-main uppercase">
              {en ? "Filters" : "篩選條件"}
            </span>
            <button 
              onClick={() => setIsFiltersOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-bone text-ink-soft transition-colors border border-line-soft"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="sticky top-0 md:top-[120px]">
            <div className="hidden md:flex flex-col gap-3 mb-md">
              <h2 className="font-headline-sm text-headline-sm text-ink-main border-b border-line pb-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    category
                  </span>
                  {en ? "Items Directory" : "物品圖鑑"}
                </span>
              </h2>
              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <span className="font-mono-metadata text-[10px] text-ink-mute uppercase tracking-widest hidden md:inline-block">
                    {filtered.length} {en ? "Remaining" : "剩餘數量"}
                  </span>
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-xs font-label-caps bg-surface-container hover:bg-surface-container-high text-ink-soft hover:text-ink-main py-1 px-3 rounded transition-colors border hairline-border ml-auto"
                  >
                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                    {en ? "Reset" : "一鍵重置"}
                  </button>
                </div>
              )}
            </div>

            <div className="mb-lg border bg-surface-container/20 rounded-sm">
              <h3 className="font-label-caps text-label-caps text-ink-soft border-line-soft p-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                   <span className="material-symbols-outlined text-[18px]">
                     folder
                   </span>
                   {en ? "Category" : "物品分類"}
                   {selectedCategory && <span className="font-mono-metadata text-[10px] bg-primary text-white px-2 py-0.5 rounded-full ml-2 leading-none">1</span>}
                </span>
              </h3>
              <div className="p-3 pt-0 border-t border-line-soft/50 space-y-xs">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setIsFiltersOpen(false);
                  }}
                  className={`w-full text-left font-body-base text-body-base flex items-center justify-between py-xs transition-colors group p-2 rounded ${selectedCategory === null ? "text-primary bg-primary/5" : "text-ink-soft hover:text-ink-main hover:bg-surface-container-high"}`}
                >
                  <span className="flex items-center gap-xs">
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${selectedCategory === null ? "bg-primary" : "bg-ink-faint group-hover:bg-primary"}`}
                    ></span>
                    {en ? "All Categories" : "不限分類"}
                  </span>
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => {
                      setSelectedCategory(cat.key === selectedCategory ? null : cat.key);
                      setIsFiltersOpen(false);
                    }}
                    className={`w-full text-left font-body-base text-body-base flex items-center justify-between py-xs transition-colors group p-2 rounded ${selectedCategory === cat.key ? "text-primary bg-primary/5" : "text-ink-soft hover:text-primary hover:bg-surface-container-high"}`}
                  >
                    <span className="flex items-center gap-xs">
                      <span
                        className={`w-2 h-2 rounded-full transition-colors ${selectedCategory === cat.key ? "bg-primary" : "bg-tertiary group-hover:bg-primary"}`}
                      ></span>
                      {en ? cat.en : cat.zh}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-lg border bg-surface-container/20 rounded-sm">
              <h3 className="font-label-caps text-label-caps text-ink-soft border-line-soft p-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                   <span className="material-symbols-outlined text-[18px]">
                     search
                   </span>
                   {t("pokedex.searchRegistry")}
                   {query && <span className="font-mono-metadata text-[10px] bg-primary text-white px-2 py-0.5 rounded-full ml-2 leading-none">1</span>}
                </span>
              </h3>
              <div className="p-3 pt-0 border-t border-line-soft/50">
                <button 
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} 
                  className={`mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-label-caps transition-colors w-full justify-center ${showFavoritesOnly ? 'bg-[#FF6B6B] text-white border border-[#FF6B6B]' : 'bg-transparent border border-line-soft text-ink-soft hover:bg-surface-container'}`}
                >
                  <span className={`material-symbols-outlined text-[14px] ${showFavoritesOnly ? 'fill-white font-variation-fill' : ''}`}>favorite</span>
                  {en ? "My Favorites Only" : "僅顯示我的最愛"}
                </button>
                <div className="relative mt-3">
                  <input
                    type="text"
                    placeholder={t("pokedex.searchPlaceholder")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-bone border border-line-soft text-ink-soft placeholder-ink-faint rounded-sm py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-body-base mt-2"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-[18px] text-ink-faint text-[18px]">
                    search
                  </span>
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-3 top-[18px] text-ink-faint hover:text-ink-soft"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        close
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="mb-sm flex items-center justify-between font-mono-metadata text-xs text-ink-mute uppercase tracking-widest border-b border-line-soft pb-2">
            <span>{en ? "Registry" : "登錄檔案"}</span>
            <span>
              {filtered.length} {en ? "Matches" : "筆結果"}
            </span>
          </div>

          {visible.length === 0 ? (
            <div className="border border-dashed border-line-soft rounded-sm py-xl flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-ink-faint text-4xl mb-sm">
                search_off
              </span>
              <p className="font-body-base text-body-base text-ink-mute">
                {t("pokedex.noResults")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-md relative">
              {visible.map((item: any, idx: number) => (
                <ScrollFade
                  key={item.id}
                  depth="none"
                  delay={(idx % 5) * 0.03}
                  className="h-full"
                >
                  <div
                    className={`relative group h-full [perspective:1000px] ${flippedId === item.id ? "z-10" : "z-0"}`}
                  >
                    <motion.div
                      className="w-full h-full [transform-style:preserve-3d] relative shadow-sm hover:shadow-md transition-shadow rounded-sm"
                      initial={false}
                      animate={{ rotateY: flippedId === item.id ? 180 : 0 }}
                      transition={{
                        duration: 0.6,
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                    >
                      {/* FRONT FACE */}
                      <article
                        onClick={() =>
                          setFlippedId(flippedId === item.id ? null : item.id)
                        }
                        className="p-3 sm:p-4 flex flex-col relative h-full border border-line-soft bg-paper hover:bg-surface-container/30 cursor-pointer group/front rounded-sm [backface-visibility:hidden]"
                      >
                        <div className="flex justify-between items-start mb-2 sm:mb-sm">
                          <span className="font-body-italic text-sm sm:text-base text-ink-soft line-clamp-1">
                            {CATEGORIES.find(
                              (c) => c.key === item.categoryKey,
                            )?.[en ? "en" : "zh"] ||
                              (en
                                ? item.categoryEn || item.categoryKey
                                : item.categoryZh || item.categoryKey)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => toggleFavorite(item.id, e)}
                              className="text-line hover:text-primary transition-colors focus:outline-none"
                            >
                              <span className={`material-symbols-outlined text-[16px] ${favorites.has(item.id) ? "fill-[#FF6B6B] text-[#FF6B6B] font-variation-fill" : ""}`}>
                                favorite
                              </span>
                            </button>
                            <span className="font-mono-metadata text-xs text-ink-mute">
                              NO.{item.id}
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-24 sm:h-32 mb-4 relative flex items-center justify-center group-hover/front:scale-105 transition-transform duration-500">
                          <img
                            src={`https://pokopiaguide.com${item.imageUrl}`}
                            alt={
                              en
                                ? item.nameEn || item.name
                                : item.nameZh || item.name
                            }
                            loading="lazy"
                            className="object-contain max-w-[70px] max-h-[70px] sm:max-w-[100px] sm:max-h-[100px]"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
                            }}
                          />
                        </div>

                        <div className="flex flex-col mt-auto pt-2 border-t border-line-soft">
                          <h2 className="font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md mb-1 transition-colors truncate text-ink-soft group-hover/front:text-ink-main">
                            {en
                              ? item.nameEn || item.name
                              : item.nameZh || item.name}
                          </h2>
                        </div>
                      </article>

                      {/* BACK FACE */}
                      <article
                        onClick={() =>
                          setFlippedId(flippedId === item.id ? null : item.id)
                        }
                        className="absolute inset-0 p-3 sm:p-4 flex flex-col h-full border border-line-soft bg-paper-warm [backface-visibility:hidden] [transform:rotateY(180deg)] cursor-pointer overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] rounded-sm"
                      >
                        <div className="flex items-start gap-2 mb-3 border-b border-line-soft pb-2 shrink-0">
                          <div className="w-10 h-10 shrink-0 bg-surface-container/50 rounded flex items-center justify-center mt-1">
                            <img
                              src={`https://pokopiaguide.com${item.imageUrl}`}
                              alt={
                                en
                                  ? item.nameEn || item.name
                                  : item.nameZh || item.name
                              }
                              className="max-w-[32px] max-h-[32px] object-contain drop-shadow-sm"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-mono-metadata text-[10px] text-ink-mute uppercase tracking-widest leading-none mb-1.5 line-clamp-1">
                              NO.{item.id} ·{" "}
                              {CATEGORIES.find(
                                (c) => c.key === item.categoryKey,
                              )?.[en ? "en" : "zh"] ||
                                (en
                                  ? item.categoryEn || item.categoryKey
                                  : item.categoryZh || item.categoryKey)}
                            </div>
                            <h2 className="font-headline-sm text-sm text-ink-main truncate leading-tight whitespace-normal line-clamp-2">
                              {en
                                ? item.nameEn || item.name
                                : item.nameZh || item.name}
                            </h2>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <p className="font-body-base text-xs text-ink-soft leading-relaxed">
                            {item.description}
                          </p>

                          {item.materials && item.materials.length > 0 && (
                            <div className="pt-2 border-t border-line-soft/50">
                              <span className="font-label-caps text-[10px] text-ink-mute block mb-1.5 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">
                                  handyman
                                </span>
                                {en ? "Crafting Materials" : "製作材料"}
                              </span>
                              <ul className="space-y-1">
                                {item.materials.map(
                                  (mat: any, i: number) => (
                                    <li
                                      key={i}
                                      className="flex items-center gap-2 bg-surface-container/40 rounded px-1.5 py-1"
                                    >
                                      <img
                                        src={`https://pokopiaguide.com${mat.imageUrl}`}
                                        alt={mat.name}
                                        loading="lazy"
                                        className="w-5 h-5 object-contain shrink-0 drop-shadow-sm"
                                        onError={(e) => {
                                          e.currentTarget.style.visibility =
                                            "hidden";
                                        }}
                                      />
                                      <span className="font-body-base text-[11px] text-ink-soft truncate flex-1 min-w-0">
                                        {mat.name}
                                      </span>
                                      <span className="font-mono-metadata text-[11px] text-ink-main shrink-0">
                                        ×{mat.count}
                                      </span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}

                          {item.recipe && item.recipe.length > 0 && (
                            <div className="pt-2 border-t border-line-soft/50">
                              <span className="font-label-caps text-[10px] text-ink-mute block mb-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">
                                  menu_book
                                </span>
                                {en ? "Recipe & Unlock" : "配方解鎖"}
                              </span>
                              <ul className="pl-3 space-y-0.5">
                                {item.recipe.map(
                                  (note: string, i: number) => (
                                    <li
                                      key={i}
                                      className="font-body-base text-[11px] text-ink-soft list-disc"
                                    >
                                      {note}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}

                          {item.obtain && item.obtain.length > 0 && (
                            <div className="pt-2 border-t border-line-soft/50">
                              <span className="font-label-caps text-[10px] text-ink-mute block mb-1">
                                {en ? "Obtain" : "獲取方式"}
                              </span>
                              <ul className="pl-3 space-y-0.5">
                                {item.obtain.map(
                                  (method: string, i: number) => (
                                    <li
                                      key={i}
                                      className="font-body-base text-[11px] text-ink-soft list-disc"
                                    >
                                      {method}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}

                          {(item.paintable || item.patternable) && (
                            <div className="pt-2 border-t border-line-soft/50 flex flex-wrap gap-1.5">
                              {item.paintable && (
                                <span className="inline-flex items-center gap-1 font-label-caps text-[10px] text-primary bg-primary/10 rounded-full px-2 py-0.5">
                                  <span className="material-symbols-outlined text-[12px]">
                                    palette
                                  </span>
                                  {en ? "Paintable" : "可上色"}
                                </span>
                              )}
                              {item.patternable && (
                                <span className="inline-flex items-center gap-1 font-label-caps text-[10px] text-tertiary bg-tertiary/10 rounded-full px-2 py-0.5">
                                  <span className="material-symbols-outlined text-[12px]">
                                    texture
                                  </span>
                                  {en ? "Patternable" : "可加圖樣"}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </article>
                    </motion.div>
                  </div>
                </ScrollFade>
              ))}
            </div>
          )}

          {visibleCount < filtered.length && (
            <div className="mt-lg flex justify-center w-full">
              <button
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                className="bg-surface-container hover:bg-surface-container-high border hairline-border text-ink-soft font-label-caps text-label-caps uppercase tracking-widest px-8 py-3 rounded transition-colors"
              >
                {t("pokedex.loadMore")} ({filtered.length - visibleCount})
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
