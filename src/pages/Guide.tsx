import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from "recharts";
import Seo from "../components/Seo";
import GuideDiagram from "../components/GuideDiagram";
import ScrollFade from "../components/ScrollFade";

function GuideDataChart({ en }: { en: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"encounter" | "resource">("encounter");

  const encounterData = en ? [
    { name: "Wasteland", Common: 65, Rare: 30, Legendary: 5 },
    { name: "Beach", Common: 55, Rare: 35, Legendary: 10 },
    { name: "Ridges", Common: 50, Rare: 40, Legendary: 10 },
    { name: "Skylands", Common: 40, Rare: 45, Legendary: 15 },
    { name: "Palette Town", Common: 30, Rare: 50, Legendary: 20 },
  ] : [
    { name: "枯萎荒野", Common: 65, Rare: 30, Legendary: 5 },
    { name: "荒涼海灘", Common: 55, Rare: 35, Legendary: 10 },
    { name: "岩石山脊", Common: 50, Rare: 40, Legendary: 10 },
    { name: "閃耀空島", Common: 40, Rare: 45, Legendary: 15 },
    { name: "調色板鎮", Common: 30, Rare: 50, Legendary: 20 },
  ];

  const resourceData = en ? [
    { name: "Wasteland", Lumber: 30, Brick: 85, Metals: 40 },
    { name: "Beach", Lumber: 20, Brick: 75, Metals: 50 },
    { name: "Ridges", Lumber: 10, Brick: 30, Metals: 95 },
    { name: "Skylands", Lumber: 60, Brick: 40, Metals: 80 },
    { name: "Palette Town", Lumber: 90, Brick: 80, Metals: 85 },
  ] : [
    { name: "枯萎荒野", Lumber: 30, Brick: 85, Metals: 40 },
    { name: "荒涼海灘", Lumber: 20, Brick: 75, Metals: 50 },
    { name: "岩石山脊", Lumber: 10, Brick: 30, Metals: 95 },
    { name: "閃耀空島", Lumber: 60, Brick: 40, Metals: 80 },
    { name: "調色板鎮", Lumber: 90, Brick: 80, Metals: 85 },
  ];

  const colors = {
    Common: "#5c6238",     // Tertiary (Olive Green)
    Rare: "#a53a2c",       // Primary (Warm Coral Red)
    Legendary: "#d29910",  // Gold / Yellow
    Lumber: "#8b716d",     // Copper / Brown-Grey
    Brick: "#a53a2c",      // Terracotta
    Metals: "#795900",     // Secondary Bronze
  };

  return (
    <div className="mb-8 bg-bone border border-line-soft rounded-sm p-4 sm:p-6 tracking-wide select-none">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">bar_chart</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-base text-ink-soft m-0 group-hover:text-primary transition-colors flex items-center gap-2">
              {en ? "Eco-Metrics Database Analyzer" : "區域生態與物資產出智能數據分析儀"}
              <span className="font-mono-metadata text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-sm uppercase tracking-wider font-bold">
                PRO TOOL
              </span>
            </h3>
            <p className="font-mono-metadata text-ink-mute text-[11px] m-0 mt-0.5 leading-tight">
              {en 
                ? "Compare Pokémon encounter distribution and refinery resource efficiency across regions" 
                : "跨區域對比普通/稀有/傳說遭遇分佈，與木材/磚塊/高階金屬三大資產的產出權重評分"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-ink-mute pl-4">
          <span className="font-mono-metadata text-[11px] uppercase tracking-widest hidden sm:inline-block">
            {isOpen 
              ? (en ? "COLLAPSE" : "收縮數據圖表") 
              : (en ? "EXPAND" : "展開數據圖表")}
          </span>
          <motion.span 
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="material-symbols-outlined text-[20px]"
          >
            expand_more
          </motion.span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 24 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="overflow-hidden border-t border-line-soft pt-4"
          >
            {/* Tab switchers */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveTab("encounter")}
                className={`font-mono-metadata text-xs uppercase tracking-wider px-4 py-2 rounded-sm border transition-all ${
                  activeTab === "encounter"
                    ? "bg-primary text-on-primary border-primary cursor-pointer"
                    : "bg-paper-warm text-ink-mute border-line-soft hover:text-primary hover:border-primary cursor-pointer"
                }`}
              >
                📊 {en ? "Encounter Probabilities (%)" : "遭遇機率對比 (%)"}
              </button>
              <button
                onClick={() => setActiveTab("resource")}
                className={`font-mono-metadata text-xs uppercase tracking-wider px-4 py-2 rounded-sm border transition-all ${
                  activeTab === "resource"
                    ? "bg-primary text-on-primary border-primary cursor-pointer"
                    : "bg-paper-warm text-ink-mute border-line-soft hover:text-primary hover:border-primary cursor-pointer"
                }`}
              >
                ⚒️ {en ? "Refining Resource Weights" : "精煉物資產出權重"}
              </button>
            </div>

            {/* Explanatory subtitle */}
            <p className="font-body-italic text-sm text-ink-mute mb-6 max-w-3xl leading-relaxed">
              {activeTab === "encounter"
                ? (en 
                    ? "Shows the probability of encounters in regular habitats. In Palette Town, the environment's micro-climate elevates rare migrations by up to 50% compared to starting regions."
                    : "數據反映常規棲地的原生出沒分佈。隨著環境修護與等級提高，終局「調色板鎮」的稀有與傳說個體移民比率可比初期荒地提高數倍。")
                : (en
                    ? "Evaluates resource yield potentials on a 0-100 efficiency matrix. Perfect for optimizing colony placement of production trio specialists (Wooper/Timburr/Scyther)."
                    : "依據 0-100 的基礎效率矩陣，評估各區域採掘及精煉效率。這能極佳輔助玩家調遣「烏波（黏土）、飛天螳螂（木材）與修繕老匠（混凝土）」至最匹配的區域打工。")
              }
            </p>

            {/* Recharts container */}
            <div className="w-full h-[320px] bg-paper-warm/40 p-2 sm:p-4 rounded-sm border border-line-soft font-mono-metadata text-[11px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={(activeTab === "encounter" ? encounterData : resourceData) as any[]}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(21, 20, 15, 0.05)" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "#5A5448" }} 
                    axisLine={{ stroke: "rgba(21, 20, 15, 0.15)" }}
                    tickLine={{ stroke: "rgba(21, 20, 15, 0.15)" }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fill: "#5A5448" }}
                    axisLine={{ stroke: "rgba(21, 20, 15, 0.15)" }}
                    tickLine={{ stroke: "rgba(21, 20, 15, 0.15)" }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#F7F1DE", 
                      borderColor: "rgba(21, 20, 15, 0.15)",
                      borderRadius: "2px",
                      color: "#2A2620"
                    }} 
                  />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  {activeTab === "encounter" ? (
                    <>
                      <Bar dataKey="Common" name={en ? "Common" : "普通級"} fill={colors.Common} radius={[2, 2, 0, 0]} />
                      <Bar dataKey="Rare" name={en ? "Rare" : "稀有級"} fill={colors.Rare} radius={[2, 2, 0, 0]} />
                      <Bar dataKey="Legendary" name={en ? "Legendary" : "傳說級"} fill={colors.Legendary} radius={[2, 2, 0, 0]} />
                    </>
                  ) : (
                    <>
                      <Bar dataKey="Lumber" name={en ? "Lumbering" : "木材採伐效率"} fill={colors.Lumber} radius={[2, 2, 0, 0]} />
                      <Bar dataKey="Brick" name={en ? "Clay/Brick Clay" : "黏土燒製效率"} fill={colors.Brick} radius={[2, 2, 0, 0]} />
                      <Bar dataKey="Metals" name={en ? "Metal Mining/Refining" : "金屬冶煉效率"} fill={colors.Metals} radius={[2, 2, 0, 0]} />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-[10px] text-ink-faint font-mono-metadata uppercase">
              <span>* Data Normalized to 100% Core Index</span>
              <span>Source: GameWith DB Analytics</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DocumentArchiveCard({ section, en, index }: { section: any; en: boolean; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const title = en ? section.titleEn : section.titleZh;
  const content = en ? section.contentEn : section.contentZh;

  return (
    <div className="mb-8">
      <div 
        onClick={() => setIsOpen(true)} 
        className="cursor-pointer group relative bg-bone border border-line-soft p-5 rounded-sm ambient-shadow w-full max-w-[500px] mx-auto overflow-hidden transition-all hover:translate-y-[-2px] hover:border-primary/50 hover:shadow-md"
      >
        <div className="absolute top-2 right-2 font-mono-metadata text-[10px] text-ink-mute bg-paper/80 px-2 py-0.5 rounded-sm backdrop-blur-sm z-10">
          DOC. {index + 1}
        </div>
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 text-primary flex items-center justify-center bg-paper-warm group-hover:bg-primary/5 transition-colors shrink-0">
            <span className="material-symbols-outlined text-[24px]">description</span>
          </div>
          <div>
            <div className="font-mono-metadata text-[10px] text-primary mb-1 tracking-wider uppercase flex items-center gap-1">
               <span className="material-symbols-outlined text-[12px] opacity-70">lock</span>
               CLASSIFIED ARCHIVE
            </div>
            <h4 className="font-headline-sm text-[15px] text-ink-soft leading-snug m-0 group-hover:text-primary transition-colors">
              {title}
            </h4>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-line-soft flex items-center justify-between text-ink-mute font-mono-metadata uppercase tracking-widest text-[10px]">
           <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">touch_app</span> {en ? "Extract Dossier" : "點擊查閱附屬文檔"}</span>
           <span>Game Freak × Omega Force</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-paper border border-line-soft rounded-sm p-6 sm:p-8 max-w-[600px] w-full relative z-10 ambient-shadow"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-paper-warm text-ink-mute hover:text-ink hover:bg-line-soft transition-colors"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
              
              <div className="flex items-start gap-4 mb-6 border-b border-line-soft pb-6">
                <div className="w-12 h-12 shrink-0 rounded-full border-2 border-primary flex items-center justify-center bg-primary/5 text-primary">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
                <div className="pr-6">
                  <div className="font-mono-metadata text-[10px] text-primary mb-1 tracking-wider uppercase">
                    CLASSIFIED ARCHIVE · {en ? "ACCESS GRANTED" : "權限解鎖"}
                  </div>
                  <h3 className="font-headline-sm text-[18px] text-ink leading-snug">{title}</h3>
                </div>
              </div>
              
              <div className="font-body-base text-[15px] text-ink-soft leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {content}
              </div>
              
              <div className="mt-8 pt-4 border-t border-line-soft flex justify-between items-center text-ink-mute">
                <span className="font-mono-metadata text-[10px] uppercase">META REPORT // {section.id.toUpperCase()}</span>
                <span className="font-mono-metadata text-[10px] uppercase">{new Date().toISOString().split('T')[0]}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Guide() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("pokopia_completed_steps");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const toggleStep = (guideId: string, secId: string, stepIdx: number) => {
    const key = `${guideId}_${secId}_${stepIdx}`;
    setCompletedSteps((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("pokopia_completed_steps", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    fetch("/data/guide.json")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        const params = new URLSearchParams(location.search);
        const idParam = params.get("id");
        if (idParam && d.guides?.find((g: any) => g.id === idParam)) {
          setActiveId(idParam);
        } else {
          setActiveId(d.guides?.[0]?.id ?? null);
        }
      });
  }, [location.search]);

  const en = i18n.language === "en";
  const fallbackTitle = en ? "Guides & Walkthroughs | Pokopia Chronicles" : "戰術指南與攻略檔案 | Pokopia 年代記";
  const fallbackDescription = en
    ? "Read Pokopia walkthroughs for regional restoration, resource refining, legendary routes, and endgame habitat planning."
    : "閱讀 Pokopia 的區域復育、資源精煉、傳說路線與終局棲地規劃指南。";

  if (!data || !activeId) {
    return (
      <Seo
        title={fallbackTitle}
        description={fallbackDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia guide", "Pokopia walkthrough", "legendary encounters", "resource refining"]}
      />
    );
  }

  const guides: any[] = data.guides ?? [];
  const guide = guides.find((g) => g.id === activeId) ?? guides[0];
  const seoTitle = `${en ? guide.titleEn : guide.titleZh} | ${en ? "Pokopia Chronicles" : "Pokopia 年代記"}`;
  const seoDescription = en ? guide.subtitleEn : guide.subtitleZh;

  const openGuide = (id: string) => {
    setActiveId(id);
    navigate(`/guide?id=${id}`, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const related = (guide.relatedIds ?? [])
    .map((id: string) => guides.find((g) => g.id === id))
    .filter(Boolean);

  // Count total and completed steps for the active guide
  const totalSteps = guide.sections.reduce((acc: number, sec: any) => acc + (sec.steps?.length ?? 0), 0);
  const completedStepsInGuide = guide.sections.reduce((acc: number, sec: any) => {
    if (!sec.steps) return acc;
    return acc + sec.steps.filter((_: any, idx: number) => {
      const key = `${guide.id}_${sec.id}_${idx}`;
      return !!completedSteps[key];
    }).length;
  }, 0);

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia guide", "Pokopia walkthrough", guide.titleEn, guide.categoryEn]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: en ? guide.titleEn : guide.titleZh,
          description: seoDescription,
          inLanguage: en ? "en" : "zh-Hant",
          url: `https://pokemoninfoperfer.vercel.app/guide?id=${guide.id}`,
          author: {
            "@type": "Organization",
            name: "Pokopia Chronicles",
          },
          about: en ? guide.categoryEn : guide.categoryZh,
        }}
      />
      {/* Volume switcher — the real archive index (Hidden on Mobile, handled via Classical Floating Academic Directory) */}
      <nav className="hidden md:flex flex-wrap gap-xs mb-lg">
        {guides.map((g) => (
          <button
            key={g.id}
            onClick={() => openGuide(g.id)}
            className={`font-mono-metadata text-mono-metadata uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              g.id === activeId
                ? "bg-primary text-on-primary border-primary"
                : "text-ink-mute border-line-soft hover:text-primary hover:border-primary"
            }`}
          >
            Vol {g.vol} · {en ? g.categoryEn : g.categoryZh}
          </button>
        ))}
      </nav>

      <div className="border-b border-line pb-lg mb-lg">
        <div className="font-mono-metadata text-mono-metadata text-ink-mute uppercase mb-4 tracking-widest">
          Volume {guide.vol}. / {en ? guide.categoryEn : guide.categoryZh}
        </div>
        <h1 className="font-display-lg text-display-lg text-ink-soft mb-sm leading-tight max-w-4xl">
          {en ? guide.titleEn : guide.titleZh}
        </h1>
        <p className="font-body-italic text-body-italic text-ink-mute max-w-2xl">
          {en ? guide.subtitleEn : guide.subtitleZh}
        </p>

        {totalSteps > 0 && (
          <div className="mt-6 p-4 bg-bone border border-line-soft rounded-sm ambient-shadow max-w-2xl select-none">
            <div className="flex justify-between items-center mb-1.5 font-mono-metadata text-xs">
              <span className="text-ink-mute flex items-center gap-1.5 font-bold">
                <span className="material-symbols-outlined text-[16px] text-primary">task_alt</span>
                {en ? "TASK COMPLETION RATE" : "任務復育達成度"}
              </span>
              <span className="text-primary font-bold">
                {completedStepsInGuide} / {totalSteps} ({Math.round((completedStepsInGuide / totalSteps) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-paper border border-line-soft h-3 rounded-full overflow-hidden p-0.5">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(completedStepsInGuide / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <GuideDataChart en={en} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Table of Contents */}
        <aside className="hidden md:block md:col-span-3">
          <div className="sticky top-[120px]">
            <div className="font-label-caps text-label-caps text-ink-soft mb-6 border-b border-line-soft pb-2">
              {t("guide.contents")}
            </div>
            <ul className="space-y-4">
              {guide.sections.map((sec: any) => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`} className="font-mono-metadata text-mono-metadata text-ink-mute hover:text-primary transition-colors">
                    {sec.roman} {en ? sec.titleEn : sec.titleZh}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <article className="md:col-span-9 font-body-base text-body-base text-ink-soft leading-relaxed max-w-prose">
          {guide.sections.map((sec: any, index: number) => (
            <ScrollFade key={sec.id} depth="none" className="mb-12">
              {index === 2 && guide.stats && (
                 <div className="grid grid-cols-2 gap-4 my-8">
                  <div className="bg-paper-warm hairline-border p-4 rounded-sm">
                    <div className="font-label-caps text-label-caps text-ink-mute mb-2">{t("guide.optimalTime")}</div>
                    <div className="font-headline-md text-headline-md text-ink-soft">{en ? guide.stats.optimalTimeEn : guide.stats.optimalTimeZh}</div>
                  </div>
                  <div className="bg-paper-warm hairline-border p-4 rounded-sm">
                    <div className="font-label-caps text-label-caps text-ink-mute mb-2">{t("guide.successRate")}</div>
                    <div className="font-headline-md text-headline-md text-primary">{guide.stats.successRate}</div>
                  </div>
                </div>
              )}

              <h2 id={sec.id} className="font-headline-sm text-headline-sm text-ink-soft mt-12 mb-6 flex items-center gap-4 scroll-mt-28">
                <span className="text-primary font-mono-metadata text-sm">{sec.roman}</span> {en ? sec.titleEn : sec.titleZh}
              </h2>
              {sec.link && (
                <div className="mb-6 -mt-2">
                  <a href={sec.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono-metadata text-[11px] text-primary hover:text-primary/80 transition-colors uppercase tracking-wider bg-primary/5 px-3 py-1.5 rounded-sm border border-primary/20">
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    {en ? "External Resource" : "前往外部網站"}
                  </a>
                </div>
              )}
              {guide.id === "meta-history" ? (
                <DocumentArchiveCard section={sec} en={en} index={index} />
              ) : (
                <p className="mb-6">{en ? sec.contentEn : sec.contentZh}</p>
              )}

              {sec.listEn && (
                <ul className="list-disc pl-6 space-y-4 mb-8">
                  {(en ? sec.listEn : sec.listZh).map((item: string, i: number) => {
                     const m = item.match(/^(.*?)(：|:\s)(.*)$/);
                     return m ? (
                        <li key={i}><strong>{m[1]}{m[2].trim()}</strong> {m[3]}</li>
                     ) : (
                        <li key={i}>{item}</li>
                     );
                  })}
                </ul>
              )}

              {sec.steps && (
                <div className="my-8 relative pl-6 border-l-2 border-primary/20 space-y-8">
                  {sec.steps.map((step: any, sIdx: number) => {
                    const isStepDone = !!completedSteps[`${guide.id}_${sec.id}_${sIdx}`];
                    return (
                      <div key={step.id || sIdx} className="relative group">
                        {/* Timeline circular node marker acting as interactive button */}
                        <button 
                          onClick={() => toggleStep(guide.id, sec.id, sIdx)}
                          className={`absolute -left-[35px] top-1.5 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center shadow-sm cursor-pointer z-10 ${
                            isStepDone 
                              ? "bg-primary border-primary text-paper hover:opacity-90" 
                              : "bg-paper border-primary text-primary hover:bg-primary hover:text-paper"
                          }`}
                          title={isStepDone ? (en ? "Mark Incomplete" : "標記為未完成") : (en ? "Mark Completed" : "標記為完成")}
                        >
                          <span className="material-symbols-outlined text-[13px] font-bold">
                            {isStepDone ? "check" : (step.icon || "done")}
                          </span>
                        </button>
                        
                        {/* Detailed node card */}
                        <div className={`border p-5 rounded-sm ambient-shadow transition-all ${
                          isStepDone 
                            ? "bg-primary/[0.02] border-primary/40 opacity-80 hover:opacity-100" 
                            : "bg-bone border-line-soft hover:translate-x-1 hover:border-primary/50"
                        }`}>
                          <div className="flex flex-wrap justify-between items-center gap-2 mb-3 border-b border-line-soft pb-2">
                            <h4 className="font-headline-sm text-[15px] font-medium text-ink-soft flex items-center gap-2 m-0 p-0">
                              <button
                                onClick={() => toggleStep(guide.id, sec.id, sIdx)}
                                className="focus:outline-none flex items-center justify-center shrink-0 text-primary hover:scale-105 transition-transform cursor-pointer"
                                aria-label={isStepDone ? (en ? "Mark Incomplete" : "標記為未完成") : (en ? "Mark Completed" : "標記為完成")}
                              >
                                <span className="material-symbols-outlined text-[20px] select-none">
                                  {isStepDone ? "check_box" : "check_box_outline_blank"}
                                </span>
                              </button>
                              <span className="font-mono-metadata text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-sm font-bold tracking-wider">
                                STEP {sIdx + 1}
                              </span>
                              <span className={isStepDone ? "line-through text-ink-mute/70" : ""}>
                                {en ? step.nodeTitleEn : step.nodeTitleZh}
                              </span>
                            </h4>
                            {step.badgeZh && (
                              <span className="font-mono-metadata text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-primary/15 text-primary border border-primary/30">
                                {en ? (step.badgeEn || step.badgeZh) : step.badgeZh}
                              </span>
                            )}
                          </div>
                          <p className={`font-body-base text-sm leading-relaxed m-0 whitespace-pre-line ${
                            isStepDone ? "text-ink-mute/70" : "text-ink-main"
                          }`}>
                            {en ? step.descEn : step.descZh}
                          </p>
                          {step.link && (
                            <div className="mt-4 pt-3 border-t border-line-soft">
                              <a href={step.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono-metadata text-[11px] text-primary hover:text-primary/80 transition-colors uppercase tracking-wider bg-primary/5 px-3 py-1.5 rounded-sm border border-primary/20">
                                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                {en ? "External Resource" : "前往外部網站"}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <GuideDiagram section={sec} index={index} en={en} />
              {sec.image && (
                <p className="font-mono-metadata text-mono-metadata text-ink-mute text-center max-w-[520px] mx-auto -mt-4 mb-8 leading-relaxed">
                  {en ? sec.image.captionEn : sec.image.captionZh}
                </p>
              )}

              <div className="mt-8 border-t border-dashed border-line-soft pt-sm mb-12">
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
            </ScrollFade>
          ))}
        </article>
      </div>

      {/* Further Reading */}
      {related.length > 0 && (
        <div className="mt-xl pt-lg border-t border-line">
          <div className="flex justify-between items-end mb-8">
            <h3 className="font-headline-sm text-headline-sm text-ink-soft">{t("guide.furtherReading")}</h3>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="font-label-caps text-label-caps text-primary hover:opacity-80 transition-opacity flex items-center gap-1 uppercase"
            >
              {t("guide.viewArchive")} <span className="material-symbols-outlined text-sm">arrow_upward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {related.map((item: any) => (
              <button
                key={item.id}
                onClick={() => openGuide(item.id)}
                className="group bg-bone hairline-border p-sm rounded-sm ambient-shadow flex flex-col h-full text-left hover:-translate-y-[2px] transition-transform"
              >
                <div className="flex justify-between items-start mb-6 border-b border-line-soft pb-2">
                  <span className="font-mono-metadata text-mono-metadata text-primary">Vol. {item.vol}</span>
                  <span className="font-mono-metadata text-mono-metadata text-ink-mute">{en ? item.categoryEn : item.categoryZh}</span>
                </div>
                <h4 className="font-body-italic text-body-italic text-ink-soft group-hover:text-primary transition-colors flex-grow">
                  {en ? item.titleEn : item.titleZh}
                </h4>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Guide sources citation from info4.md, info1.md, info3.md */}
      <div className="mt-xl pt-lg border-t border-line">
        <h3 className="font-headline-sm text-headline-sm text-ink-soft mb-sm">
          {en ? "References & Source Citations" : "資料來源與引用"}
        </h3>
        <p className="font-body-base text-body-base text-ink-mute mb-md">
          {en 
            ? "The strategies, structural blueprints, and habitat data compiled in these guides are sourced from the following comprehensive databases and community wikis:"
            : "本攻略所彙編之戰術指南、建構藍圖與棲息地細節等資料，皆參考自以下強大的資料庫與社群站點："}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <a href="https://pokopia.gamertw.com/zh-TW/guide/beginner" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">GamerTW</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">Pokemon Pokopia 新手指南</p>
          </a>
          
          <a href="https://tw.pogoskill.com/game-app/pokemon-pokopia-game-strategy.html" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">PoGoskill</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">Pokemon Pokopia 攻略（新手玩法與主線流程）</p>
          </a>
          
          <a href="https://forum.gamer.com.tw/C.php?bsn=1647&snA=128424" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">巴哈姆特哈啦板</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">【討論】一人一個 Pokopia 小知識！</p>
          </a>
          
          <a href="https://gamewith.jp/pocoapokemon/" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">GameWith</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">ぽこあポケモン攻略｜ぽこポケ</p>
          </a>
          
          <a href="https://pokopia.center/posts/pokopia-evolution-guide-2026/" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">Pokopia.center</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">Habitat & Milestone Database</p>
          </a>
          
          <a href="https://www.nintendolife.com/guides/pokemon-pokopia-sparkling-skylands-rebuild-the-huge-building-guide-how-to-help-tinkmaster" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">Nintendo Life</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">Complete Pokédex & Habitat Dex</p>
          </a>
          
          <a href="https://www.eurogamer.net/pokemon-pokopia-walkthrough" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">Eurogamer</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">Pokémon Pokopia Pokédex & Walkthrough</p>
          </a>
          
          <a href="https://games.gg/pokemon-pokopia/guides/pokemon-pokopia-how-to-get-eevee-and-all-eeveelutions/" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">Games.gg</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">How to Get Eevee and All Eeveelutions</p>
          </a>

          <a href="https://gametyrant.com/news/pokmon-pokopia-team-initiation-challenge-guide" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">GameTyrant</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">Team Initiation Challenge Guide</p>
          </a>

          <a href="https://www.reddit.com/r/Pokopia/comments/1rqh19y/grid_size_of_altar_of_the_flame/" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">Reddit r/Pokopia</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">Grid Size of Altar of the Flame & Community Encyclopedia</p>
          </a>
        </div>
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="scroll-to-top-btn"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-primary text-on-primary rounded-full shadow-lg hover:brightness-110 active:scale-95 focus:outline-none transition-all flex items-center justify-center cursor-pointer border border-primary/20 aspect-square group"
            title={en ? "Scroll to Top" : "回到頂部"}
            aria-label={en ? "Scroll to top" : "回到頂部"}
          >
            <span className="material-symbols-outlined text-[24px] font-bold group-hover:-translate-y-0.5 transition-transform">
              arrow_upward
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Floating Academic Directory (Classical Newspaper Style, Proposal 2) */}
      <div className="md:hidden">
        {/* Backdrop overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-ink/30 backdrop-blur-xs z-[80]"
            />
          )}
        </AnimatePresence>

        {/* Floating Active Handle (The Trigger) */}
        <div 
          className="fixed right-4 top-[55%] -translate-y-1/2 z-[90] flex flex-col items-end gap-2 pointer-events-auto"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-14 h-14 rounded-full bg-bone border border-[#D2C5A9] text-ink-soft cursor-pointer select-none flex flex-col items-center justify-center shadow-md border-t-2 border-t-primary relative"
            aria-label="Navigation Menu"
            id="floating-archive-trigger"
          >
            {/* Spinning/pulsating active seal motif */}
            <span className="material-symbols-outlined text-[22px] text-primary">
              menu_book
            </span>
            <span className="font-mono-metadata text-[8px] uppercase tracking-wider text-ink-mute -mt-0.5 font-semibold">
              Vol.{guide.vol}
            </span>
            
            {/* Tiny closed book symbol bookmark strip or aesthetic seal detail hanging from bottom */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-4 bg-primary rounded-b-xs opacity-90 shadow-xs" />
          </motion.button>
        </div>

        {/* Directory Content Panel */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.93, x: "-50%", y: "-47%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.93, x: "-50%", y: "-47%" }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="fixed left-1/2 top-1/2 z-[85] w-[88vw] max-w-[310px] pointer-events-auto"
              id="floating-archive-panel"
            >
              {/* Outer paper border container */}
              <div className="bg-[#FAF6EC] border-2 border-[#D2C5A9] rounded-sm p-4 relative shadow-[0_12px_40px_-8px_rgba(21,20,15,0.3)] paper-texture">
                {/* 4 Corner classical star decorations */}
                <span className="absolute top-1 left-1 font-mono text-[9px] text-[#A53A2C]/45 leading-none pointer-events-none select-none">✦</span>
                <span className="absolute top-1 right-1 font-mono text-[9px] text-[#A53A2C]/45 leading-none pointer-events-none select-none">✦</span>
                <span className="absolute bottom-1 left-1 font-mono text-[9px] text-[#A53A2C]/45 leading-none pointer-events-none select-none">✦</span>
                <span className="absolute bottom-1 right-1 font-mono text-[9px] text-[#A53A2C]/45 leading-none pointer-events-none select-none">✦</span>

                {/* Header title */}
                <div className="border-b-2 border-double border-[#D2C5A9] pb-2 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">auto_stories</span>
                    <span className="font-body-italic text-[13px] font-bold tracking-wide text-ink-soft italic uppercase">
                      {en ? "Classified Archives" : "機密學術年鑑"}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-5 h-5 flex items-center justify-center rounded-full bg-paper-warm text-ink-mute hover:text-ink active:scale-95 transition-transform"
                    aria-label="Close"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>

                {/* Sub-panels inside scroll container */}
                <div className="max-h-[50vh] overflow-y-auto pr-1 flex flex-col gap-4 custom-scrollbar select-none">
                  
                  {/* Category 1: Chronological Volume Selection */}
                  <div>
                    <h4 className="font-mono-metadata text-[10px] text-primary/70 uppercase tracking-widest font-bold mb-2 flex items-center gap-1">
                      <span>■</span>
                      <span>{en ? "Volume Index" : "編年卷軸目錄"}</span>
                    </h4>
                    <div className="flex flex-col gap-1 max-h-[22vh] overflow-y-auto pr-0.5 custom-scrollbar">
                      {guides.map((g) => {
                        const isCurrent = g.id === activeId;
                        return (
                          <button
                            key={g.id}
                            onClick={() => {
                              openGuide(g.id);
                              setIsMenuOpen(false);
                            }}
                            className={`text-left w-full font-mono-metadata text-[11px] px-2 py-1.5 rounded-sm flex items-start gap-1 transition-colors cursor-pointer ${
                              isCurrent
                                ? "bg-primary text-on-primary font-bold shadow-xs border border-primary"
                                : "text-ink-soft hover:bg-primary/5 active:bg-primary/10 border border-transparent"
                            }`}
                          >
                            <span className="font-bold shrink-0">Vol.{g.vol}</span>
                            <span className="truncate border-l border-current/25 pl-1.5 ml-1">
                              {en ? g.categoryEn : g.categoryZh}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Aesthetic Separation Line */}
                  <div className="border-t border-dashed border-[#D2C5A9] my-1" />

                  {/* Category 2: Section Table of Contents of active volume */}
                  <div>
                    <h4 className="font-mono-metadata text-[10px] text-primary/70 uppercase tracking-widest font-bold mb-2 flex items-center gap-1">
                      <span>■</span>
                      <span>{en ? "Dossier Contents" : "本卷專題精選"}</span>
                    </h4>
                    
                    <div className="flex flex-col gap-1 max-h-[24vh] overflow-y-auto pr-0.5 custom-scrollbar">
                      {guide.sections.map((sec: any) => (
                        <a
                          key={sec.id}
                          href={`#${sec.id}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="font-body-base text-[11px] text-ink-mute hover:text-primary active:text-primary hover:bg-primary/5 transition-colors duration-200 py-1 px-1.5 rounded-sm leading-snug flex items-start gap-1 cursor-pointer border-b border-line-soft/40 last:border-0"
                        >
                          <span className="text-primary font-mono-metadata text-[10px] scale-90 translate-y-[1px] font-bold shrink-0">{sec.roman}</span>
                          <span className="truncate">{en ? sec.titleEn : sec.titleZh}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                  
                </div>

                {/* Footer seal detail */}
                <div className="mt-3 pt-2 border-t border-dashed border-[#D2C5A9] flex items-center justify-between text-[8px] font-mono-metadata text-ink-faint uppercase font-semibold">
                  <span>ID: {guide.id.toUpperCase()}</span>
                  <span>© COMPASS v1.2</span>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
