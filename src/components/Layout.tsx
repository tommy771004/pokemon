import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
    { name: t("nav.map"), path: "/map" },
    { name: t("nav.guides"), path: "/guide" },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-line-soft transition-colors glass-header">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop max-w-[1360px] mx-auto h-20">
          <Link to="/" className="font-headline-md text-headline-md italic text-primary">
            Pokopia
          </Link>
          <div className="hidden md:flex gap-sm items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-headline-sm text-headline-sm uppercase tracking-wider block py-2 transition-all duration-200 ${
                  isCurrent(link.path)
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-ink-mute hover:text-primary hover:opacity-80 active:scale-95"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-sm">
            <button
              onClick={toggleLanguage}
              className="text-label-caps font-label-caps border border-line-soft px-3 py-1 rounded-full text-ink-mute hover:text-primary hover:border-primary transition-all uppercase min-w-[64px]"
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
                className="text-primary hover:opacity-80 transition-all active:scale-95 duration-200 p-2"
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
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center pt-[15vh] px-4 bg-ink-soft/40 backdrop-blur-sm"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-bone border border-line rounded-DEFAULT ambient-shadow w-full max-w-xl p-lg relative paper-texture"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-md">
              <span className="font-label-caps text-label-caps text-ink-soft uppercase tracking-widest">
                {t("pokedex.searchRegistry")}
              </span>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-ink-mute hover:text-primary transition-colors"
                aria-label={t("pokedex.close")}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={submitSearch} className="relative">
              <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-ink-mute pointer-events-none">
                search
              </span>
              <input
                type="text"
                autoFocus
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full border-0 border-b border-ink-soft focus:border-primary focus:ring-0 font-headline-sm text-headline-sm py-sm pl-8 pr-0 transition-colors bg-transparent placeholder-ink-faint outline-none"
                placeholder={t("pokedex.searchPlaceholder")}
              />
            </form>
            <p className="font-mono-metadata text-mono-metadata text-ink-faint mt-sm">
              {t("pokedex.searchHint")}
            </p>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-surface md:hidden flex flex-col">
          <div className="flex justify-between items-center px-margin-mobile h-20 border-b border-line-soft">
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
        </div>
      )}

      <main className="flex-grow pt-[120px] px-margin-mobile md:px-margin-desktop max-w-[1360px] mx-auto w-full pb-xl min-h-screen">
        {children}
      </main>

      <footer className="w-full bg-paper-warm border-t border-line transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md px-margin-mobile md:px-margin-desktop py-lg max-w-[1360px] mx-auto">
          <div className="text-center md:text-left">
            <span className="font-headline-sm text-headline-sm text-ink-soft block mb-4">Pokopia</span>
            <p className="font-mono-metadata text-mono-metadata text-ink-soft mx-auto md:mx-0 max-w-sm">
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
      </footer>
    </>
  );
}
