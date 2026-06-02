import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "zh" : "en");
  };

  const openSearch = () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(true);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchValue.trim();
    navigate(q ? `/pokedex?q=${encodeURIComponent(q)}` : "/pokedex");
    setIsSearchOpen(false);
    setSearchValue("");
  };

  const isCurrent = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: t("nav.news"), path: "/" },
    { name: t("nav.pokedex"), path: "/pokedex" },
    { name: t("nav.characters"), path: "/characters" },
    { name: t("nav.map"), path: "/map" },
    { name: t("nav.guides"), path: "/guide" },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 transition-colors glass-header hairline-bottom">
        <div className="flex justify-between items-center px-4 md:px-margin-desktop max-w-[1360px] mx-auto h-16 md:h-20">
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
          <div className="flex items-center gap-sm">
            <button
              onClick={toggleLanguage}
              className="text-label-caps font-label-caps border border-line-soft px-4 py-2 rounded-full text-ink-mute hover:text-primary hover:border-primary hover:bg-surface-variant transition-all uppercase min-w-[72px]"
            >
              {i18n.language === "en" ? "中/EN" : "EN/中"}
            </button>
            <button
              className="md:hidden text-primary hover:opacity-80 transition-all active:scale-95 duration-200 p-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                menu
              </span>
            </button>
            <div className="hidden md:flex gap-sm">
              <button
                onClick={openSearch}
                aria-label={t("pokedex.searchRegistry")}
                className="text-primary hover:opacity-80 transition-all active:scale-95 duration-200 p-2 rounded-full hover:bg-surface-variant"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  search
                </span>
              </button>
            </div>
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
            className="fixed inset-0 z-[80] flex items-start justify-center pt-[15vh] px-4 bg-ink-soft/40 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-bone border border-line rounded-DEFAULT ambient-shadow w-full max-w-xl p-lg relative paper-texture"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-md">
                <span className="font-label-caps text-label-caps text-ink-soft uppercase tracking-widest">
                  {t("pokedex.searchRegistry")}
                </span>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-ink-mute hover:text-primary transition-colors bg-surface-variant rounded-full p-1"
                  aria-label={t("pokedex.close")}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={submitSearch} className="relative group">
                <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-ink-mute group-focus-within:text-primary transition-colors pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full border-0 border-b border-line-soft focus:border-primary focus:ring-0 font-headline-sm text-headline-sm py-sm pl-8 pr-0 transition-colors bg-transparent placeholder-ink-faint outline-none"
                  placeholder={t("pokedex.searchPlaceholder")}
                />
              </form>
              <p className="font-mono-metadata text-mono-metadata text-ink-faint mt-sm">
                {t("pokedex.searchHint")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-surface md:hidden flex flex-col"
          >
            <div className="flex justify-between items-center px-4 h-16 border-b border-line-soft">
               <Link to="/" className="font-headline-md text-headline-md italic text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                Pokopia
              </Link>
              <button
                className="text-primary hover:opacity-80 transition-all active:scale-95 duration-200 p-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  close
                </span>
              </button>
            </div>
            <div className="flex flex-col px-margin-mobile py-lg gap-md flex-grow overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-display-lg text-display-lg uppercase tracking-wider block transition-all duration-200 ${
                    isCurrent(link.path)
                      ? "text-primary"
                      : "text-ink-soft"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="p-margin-mobile border-t border-line-soft space-y-4">
               <button
                  onClick={openSearch}
                  className="w-full bg-bone border border-line-soft py-4 rounded-sm font-headline-sm text-headline-sm text-ink-soft flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">search</span>
                  {t("pokedex.searchRegistry")}
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-[80px] md:pt-[120px] px-margin-mobile md:px-margin-desktop max-w-[1360px] mx-auto w-full pb-lg md:pb-xl min-h-screen">
        {children}
      </main>

      <footer className="w-full bg-paper-warm border-t border-line transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md px-margin-mobile md:px-margin-desktop py-lg max-w-[1360px] mx-auto border-b border-line-soft inline-grid w-full">
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

        <div className="px-margin-mobile md:px-margin-desktop py-lg max-w-[1360px] mx-auto text-ink-mute">
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
          <p className="px-margin-mobile md:px-margin-desktop py-md max-w-[1360px] mx-auto font-mono-metadata text-mono-metadata text-ink-faint leading-relaxed">
            {t("footer.disclaimer")}
          </p>
        </div>
      </footer>
    </>
  );
}
