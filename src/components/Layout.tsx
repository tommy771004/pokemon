import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { addSearchHistory, clearSearchHistory, getSearchHistory } from "../lib/searchHistory";
import { LayoutGrid, Search, Sparkles, Compass, BookOpen } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  React.useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [isHighContrast]);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "zh" : "en");
  };

  const openSearch = () => {
    setSearchHistory(getSearchHistory());
    setIsSearchOpen(true);
  };

  const runSearch = (raw: string) => {
    const q = raw.trim();
    if (q) setSearchHistory(addSearchHistory(q));
    navigate(q ? `/pokedex?q=${encodeURIComponent(q)}` : "/pokedex");
    setIsSearchOpen(false);
    setSearchValue("");
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(searchValue);
  };

  const isCurrent = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: t("nav.news"), path: "/", icon: LayoutGrid },
    { name: t("nav.pokedex"), path: "/pokedex", icon: Search },
    { name: t("nav.characters"), path: "/characters", icon: Sparkles },
    { name: t("nav.map"), path: "/map", icon: Compass },
    { name: t("nav.guides"), path: "/guide", icon: BookOpen },
  ];

  const getLinkLabel = (path: string) => {
    const isEn = i18n.language === "en";
    switch (path) {
      case "/": return isEn ? "News" : "最新";
      case "/pokedex": return isEn ? "Dex" : "圖鑑";
      case "/characters": return isEn ? "Cast" : "角色";
      case "/map": return isEn ? "Map" : "地圖";
      case "/guide": return isEn ? "Guide" : "指南";
      default: return "";
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 transition-colors glass-header hairline-bottom">
        <div className="flex justify-between items-center px-5 md:px-8 xl:px-12 max-w-[1360px] mx-auto h-16 md:h-20">
          <Link to="/" className="font-headline-md text-headline-md italic text-primary hover:opacity-80 transition-opacity">
            Pokopia
          </Link>
          <div className="hidden md:flex gap-md items-center">
            {navLinks.map((link) => {
              const active = isCurrent(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-headline-sm text-headline-sm uppercase tracking-wider block py-2 transition-colors duration-300 ${
                    active
                      ? "text-primary"
                      : "text-ink-mute hover:text-primary hover:opacity-80"
                  }`}
                >
                  {link.name}
                  {active && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setIsHighContrast(!isHighContrast)}
              className="flex items-center justify-center text-ink-mute hover:text-primary transition-colors focus:outline-none"
              aria-label="Toggle High Contrast Mode"
              title="Toggle High Contrast Mode"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isHighContrast ? "contrast" : "brightness_medium"}
              </span>
            </button>
            <button
              onClick={toggleLanguage}
              className="text-label-caps tracking-widest text-sm text-ink-mute hover:text-primary transition-colors uppercase min-w-[32px] flex items-center justify-center"
            >
              {i18n.language === "en" ? "中/EN" : "EN/中"}
            </button>
            <button
              onClick={openSearch}
              aria-label={t("pokedex.searchRegistry")}
              className="flex items-center justify-center text-ink-mute hover:text-primary transition-colors focus:outline-none"
            >
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-start justify-center pt-[15vh] px-4 bg-paper/90 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-bone border hairline-border w-full max-w-[40rem] p-8 relative flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b hairline-bottom pb-4">
                <span className="font-mono-metadata text-xs text-ink-soft uppercase tracking-widest">
                  {t("pokedex.searchRegistry")}
                </span>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-ink-mute hover:text-primary transition-colors focus:outline-none"
                  aria-label={t("pokedex.close")}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <form onSubmit={submitSearch} className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-0 text-ink-mute pointer-events-none text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-transparent border-none font-headline-sm text-2xl py-4 pl-10 pr-0 focus:ring-0 placeholder:text-ink-faint outline-none text-ink-main"
                  placeholder={t("pokedex.searchPlaceholder")}
                />
              </form>
              <p className="font-mono-metadata text-xs text-ink-faint">
                {t("pokedex.searchHint")}
              </p>

              {searchHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t hairline-top">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono-metadata text-xs text-ink-mute uppercase tracking-widest">
                      {t("pokedex.recentSearches")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSearchHistory(clearSearchHistory())}
                      className="font-mono-metadata text-xs text-ink-faint hover:text-primary transition-colors uppercase tracking-widest"
                    >
                      {t("pokedex.clear")}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {searchHistory.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => runSearch(q)}
                        className="font-mono-metadata text-xs text-ink-soft border hairline-border px-4 py-1.5 hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[14px]">history</span>
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Floating Bottom Nav Bar (iOS 26 Liquid Glass style) */}
      <div className="md:hidden fixed bottom-2.5 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-[290px]">
        <div 
          className="relative rounded-full border border-white/40 bg-white/70 backdrop-blur-2xl px-0.5 py-1 flex items-center justify-around transition-all duration-300 ring-1 ring-black/[0.04]"
          style={{
            boxShadow: "0 16px 48px -8px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.04), inset 0 1px 1.5px rgba(255,255,255,0.8)"
          }}
        >
          {/* Top gloss line to mimic thick glass material */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />
          
          {navLinks.map((link) => {
            const active = isCurrent(link.path);
            const Icon = link.icon;
            const label = getLinkLabel(link.path);
            
            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative flex-1 flex flex-col items-center py-2 px-0.5 focus:outline-none select-none transition-transform active:scale-95 duration-100"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {/* Active pill indicator with spring-based motion. */}
                {active && (
                  <motion.div
                    layoutId="bottomNavActiveHighlight"
                    className="absolute inset-y-0.5 inset-x-0.5 bg-primary/10 border border-primary/15 rounded-full z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  />
                )}

                <div className={`relative z-10 flex flex-col items-center gap-1 ${
                  active 
                    ? "text-primary font-semibold" 
                    : "text-ink-mute hover:text-ink-soft select-none"
                }`}>
                  <Icon className="w-5 h-5 transition-transform" />
                  <span className="font-sans text-[10px] font-semibold tracking-wider">
                    {label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <main className="flex-grow pt-[60px] md:pt-[80px] px-5 md:px-8 xl:px-12 max-w-[1360px] mx-auto w-full pb-28 md:pb-lg min-h-screen">
        {children}
      </main>

      <footer className="w-full bg-paper-warm border-t border-line transition-colors">
        {/* 其他工具連結 (水平顯示，可左右滑動) */}
        <div className="px-5 md:px-8 xl:px-12 pt-lg max-w-[1360px] mx-auto">
          <span className="font-label-caps text-label-caps text-ink-mute uppercase tracking-widest mb-4 block text-xs">
            {i18n.language === "en" ? "Other Utilities" : "其他工具連結"}
          </span>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x select-none" style={{ WebkitOverflowScrolling: "touch" }}>
            {/* 卡片 1 */}
            <a 
              href="https://taiwanrail.vercel.app/" 
              target="_blank"
              rel="noreferrer"
              className="flex-shrink-0 w-[240px] sm:w-[280px] snap-start bg-paper/60 border border-line-soft hover:border-primary/45 rounded-xl p-4 transition-all duration-300 hover:shadow-xs hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🚆</span>
                <h5 className="font-bold text-ink-main text-sm font-sans">
                  {i18n.language === "en" ? "Taiwan Rail & HSR Tracker" : "台/高鐵時刻表快速查詢"}
                </h5>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed min-h-[48px] font-sans">
                {i18n.language === "en" 
                  ? "Real-time arrival alerts, quick schedule lookups, and transit transfer info." 
                  : "提供即時到站提醒、雙向時刻表快速查詢、便利的轉乘資訊與交通引導。"}
              </p>
            </a>
            
            {/* 卡片 2 */}
            <a 
              href="https://tw-veggieprice.vercel.app/" 
              target="_blank"
              rel="noreferrer"
              className="flex-shrink-0 w-[240px] sm:w-[280px] snap-start bg-paper/60 border border-line-soft hover:border-primary/45 rounded-xl p-4 transition-all duration-300 hover:shadow-xs hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🥬</span>
                <h5 className="font-bold text-ink-main text-sm font-sans">
                  {i18n.language === "en" ? "Vegetable Tracker" : "台灣市場每日菜價"}
                </h5>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed min-h-[48px] font-sans">
                {i18n.language === "en" 
                  ? "Real-time vegetable market daily transactions and historical prices." 
                  : "追蹤觀測台灣蔬菜批發市場每日交易價格與波動走勢，掌握民生開銷。"}
              </p>
            </a>
            
            {/* 卡片 3 */}
            <a 
              href="https://roam-jelly-web.vercel.app/" 
              target="_blank"
              rel="noreferrer"
              className="flex-shrink-0 w-[240px] sm:w-[280px] snap-start bg-paper/60 border border-line-soft hover:border-primary/45 rounded-xl p-4 transition-all duration-300 hover:shadow-xs hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">✈️</span>
                <h5 className="font-bold text-ink-main text-sm font-sans">
                  {i18n.language === "en" ? "Roam Jelly Trip Planner" : "果凍漫遊旅程規劃"}
                </h5>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed min-h-[48px] font-sans">
                {i18n.language === "en" 
                  ? "AI-powered custom itineraries, flight searches, split expenses, and travel checklists." 
                  : "提供 AI 智慧行程規劃、航班機票與景點查詢、親友分帳紀錄及旅遊攜帶清單確認。"}
              </p>
            </a>
          </div>
          <div className="h-px bg-line-soft mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md px-5 md:px-8 xl:px-12 py-lg max-w-[1360px] mx-auto border-b border-line-soft inline-grid w-full">
          <div className="text-center md:text-left">
            <span className="font-headline-sm text-headline-sm text-ink-soft block mb-4">Pokopia</span>
            <p className="font-mono-metadata text-mono-metadata text-ink-soft mx-auto md:mx-0 whitespace-nowrap">
              {t("footer.copyright")}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end justify-end mt-sm md:mt-0">
            <span className="font-label-caps text-label-caps text-ink-mute uppercase tracking-widest mb-2">
              {t("footer.explore")}
            </span>
            <div className="flex flex-wrap gap-4 justify-center md:justify-end items-end">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-mono-metadata text-mono-metadata text-ink-mute hover:text-primary transition-colors py-2"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 md:px-8 xl:px-12 py-lg max-w-[1360px] mx-auto text-ink-mute">
          <h4 className="font-headline-sm text-headline-sm text-ink-soft mb-2">{i18n.language === "en" ? "Sources & References" : "資料來源與引用"}</h4>
          <p className="font-body-base text-body-base mb-4 max-w-4xl">
            {i18n.language === "en" ? "The tactical guides, build blueprints, and habitat details compiled in this guide reference the following excellent databases and community sites:" : "本攻略所彙編之戰術指南、建構藍圖與棲息地細節等資料，皆參考自以下強大的資料庫與社群站點："}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 font-mono-metadata text-mono-metadata">
            <div>
              <span className="font-label-caps text-label-caps text-ink-soft block">Nintendo Life</span>
              <a href="https://www.nintendolife.com/guides/pokemon-pokopia-sparkling-skylands-rebuild-the-huge-building-guide-how-to-help-tinkmaster" target="_blank" rel="noreferrer" className="hover:text-primary underline decoration-dashed underline-offset-2 transition-colors">Huge Building & Tinkmaster Guide</a>
            </div>
            <div>
              <span className="font-label-caps text-label-caps text-ink-soft block">Eurogamer</span>
              <a href="https://www.eurogamer.net/pokemon-pokopia-walkthrough" target="_blank" rel="noreferrer" className="hover:text-primary underline decoration-dashed underline-offset-2 transition-colors">Pokémon Pokopia Walkthrough</a>
            </div>
            <div>
              <span className="font-label-caps text-label-caps text-ink-soft block">Pokopia.center</span>
              <a href="https://pokopia.center/posts/pokopia-evolution-guide-2026/" target="_blank" rel="noreferrer" className="hover:text-primary underline decoration-dashed underline-offset-2 transition-colors">Habitat & Milestone Database</a>
            </div>
            <div>
              <span className="font-label-caps text-label-caps text-ink-soft block">GameTyrant</span>
              <a href="https://gametyrant.com/news/pokmon-pokopia-team-initiation-challenge-guide" target="_blank" rel="noreferrer" className="hover:text-primary underline decoration-dashed underline-offset-2 transition-colors">Team Initiation Challenge Guide</a>
            </div>
            <div>
              <span className="font-label-caps text-label-caps text-ink-soft block">Games.gg</span>
              <a href="https://games.gg/pokemon-pokopia/guides/pokemon-pokopia-how-to-get-eevee-and-all-eeveelutions/" target="_blank" rel="noreferrer" className="hover:text-primary underline decoration-dashed underline-offset-2 transition-colors">Eevee & All Eeveelutions Guide</a>
            </div>
            <div>
              <span className="font-label-caps text-label-caps text-ink-soft block">GameWith</span>
              <a href="https://gamewith.jp/pocoapokemon/" target="_blank" rel="noreferrer" className="hover:text-primary underline decoration-dashed underline-offset-2 transition-colors">General Pokopia Strategy Hub</a>
            </div>
          </div>
        </div>

        <div className="border-t border-line-soft bg-surface-container-low">
          <p className="px-5 md:px-8 xl:px-12 py-md max-w-[1360px] mx-auto font-mono-metadata text-mono-metadata text-ink-faint leading-relaxed">
            {t("footer.disclaimer")}
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-2 md:p-3 bg-paper border hairline-border text-ink-soft hover:text-ink-main hover:bg-bone transition-colors"
            aria-label="Back to top"
          >
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[20px]">keyboard_arrow_up</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
