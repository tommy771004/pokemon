import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Cpu, Gamepad2, TrendingUp, Trophy, Award, Layers, Terminal } from "lucide-react";
import Seo from "../components/Seo";
import ScrollFade from "../components/ScrollFade";

const MotionLink = motion.create(Link);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [activeTimelineIdx, setActiveTimelineIdx] = useState<number | null>(null);
  const en = i18n.language === "en";

  useEffect(() => {
    fetch("/data/home.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const seoTitle = en ? "Pokopia Chronicles | Post-Apocalyptic Kanto Guide" : "Pokopia 年代記 | 後末日關都攻略站";
  const seoDescription = en
    ? "A Pokopia field journal covering biome restoration, Pokémon skills, legendary encounters, and the full post-apocalyptic Kanto rebuilding route."
    : "Pokopia 後末日關都的踏查與攻略站，整理生態區復育、寶可夢技能、傳說遭遇與完整重建路線。";

  // Milestones definitions based directly on docs/info3.md data
  const milestones = [
    {
      titleZh: "夢幻聯合研發",
      titleEn: "Dream Collaboration",
      subZh: "總監大森滋親自構思，Game Freak 與 Omega Force（代表作《勇者鬥惡龍創世小玩家》）聯手完美融合寶可夢魅力與沙盒土木工程。",
      subEn: "Game Freak teamed up with Koei Tecmo's Omega Force to seamlessly integrate Pokémon sandbox gameplay.",
      time: "2026 / 03",
      icon: Layers,
      highlight: true,
    },
    {
      titleZh: "NS2 霸氣首發",
      titleEn: "NS2 Launch",
      subZh: "作為新世代主機任天堂 Switch 2 (NS2) 首發主力作品全球同步登場，底層開發採用高性能 Katana 引擎運作。",
      subEn: "Released worldwide as a flagship title for the Nintendo Switch 2, utilizing the custom Katana Engine.",
      time: "2026 / 03 / 05",
      icon: Cpu,
    },
    {
      titleZh: "4天賣破 220 萬套",
      titleEn: "2.2M Sales in 4 Days",
      subZh: "僅僅四天全球銷量衝破 220 萬套（單日本市場即達 100 萬套），登頂 Switch 2 首發最速暢銷紀錄神話。",
      subEn: "Sold over 2.2 million units in just four days, cementing a record-breaking debut.",
      time: "2026 / 03 / 09",
      icon: TrendingUp,
    },
    {
      titleZh: "首月狂銷 400 萬套",
      titleEn: "4.0M Month One",
      subZh: "截至 2026 年 3 月底全球累計銷量強勢突破 400 萬套，引爆全球社交模擬與荒野建造熱潮。",
      subEn: "By the end of March 2026, global sales exceeded 4.0 million units, starting a construction phenomenon.",
      time: "2026 / 03 / 31",
      icon: Trophy,
    },
    {
      titleZh: "締造系列史上最高評分",
      titleEn: "Historic Criticial Acclaim",
      subZh: "榮獲 Metacritic 普遍好評、OpenCritic 98% 影評極力推薦，日本權威《Fami通》給出 39/40 的近滿分神級高分評價！",
      subEn: "Achieved the highest Metacritic score in franchise history, with 98% OpenCritic and 39/40 Famitsu rating.",
      time: "2026 / 03",
      icon: Award,
    },
  ];

  if (!data) {
    return (
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia", "Pokopia guide", "Pokopia Chronicles", "Pokemon restoration game"]}
      />
    );
  }

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia", "Pokopia guide", "Pokopia Chronicles", "Legendary encounters", "Pokemon skills"]}
        image={data.featured.image}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Pokopia Chronicles",
          url: "https://pokemoninfoperfer.vercel.app/",
          inLanguage: en ? "en" : "zh-Hant",
          description: seoDescription,
        }}
      />

      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <motion.header variants={itemVariants} className="mb-xl text-center md:text-left flex flex-col items-center md:items-start">
          <span className="font-mono-metadata text-mono-metadata text-primary uppercase tracking-widest mb-4">
            {t("home.vol")}
          </span>
          <h1 className="font-display-lg text-display-lg text-ink-soft mb-sm">{t("home.title")}</h1>
          <p className="font-body-italic text-body-italic text-ink-mute max-w-2xl">{t("home.subtitle")}</p>
        </motion.header>

        {/* Epic World Setting Prologue */}
        <ScrollFade depth="bg" className="mb-xl">
          <motion.div
            variants={itemVariants}
            className="bg-inverse-surface text-inverse-on-surface rounded-none sm:rounded-DEFAULT border border-line-soft border-x-0 sm:border-x -mx-4 sm:mx-0 p-6 sm:p-lg relative overflow-hidden group shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-80 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-lg items-stretch">
              {/* Left Column: World Setup Story */}
              <div className="lg:w-1/2 flex flex-col justify-between">
                <div>
                  <span className="font-mono-metadata text-xs text-primary bg-primary/15 border border-primary/30 px-3 py-1 rounded-sm uppercase tracking-widest mb-4 inline-flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-primary animate-pulse" />
                    SOSS CORE PROLOGUE • {en ? "RESTORE MODE" : "環境自維系統備份"}
                  </span>
                  <h2 className="font-display-lg text-2xl lg:text-3.5xl text-white mb-sm tracking-tight leading-tight">
                    {en ? "The Awakened Glitch: Echoes of an Abandoned World" : "後末日關都：超級電腦自維運系統與甦醒的百變怪"}
                  </h2>
                  <p className="font-body-italic text-sm text-[#DDD2B6] opacity-90 leading-relaxed italic border-l-2 border-primary pl-4 mb-md">
                    {en
                      ? "“An exodus of humanity, a sleeping database of 300 species safely stored in an endless supercomputer. Then, a single code glitch materializes our tiny copy-nature hero.”"
                      : "「由於大自然急劇乾旱與重工業垃圾污染，全人類撤離地球移居外太空……無法帶走的寶可夢與棲息地則被寫入超級電腦，直到一次未知的系統故障，開啟了復育序曲。」"}
                  </p>
                </div>

                <div className="flex gap-sm border-t border-white/10 pt-sm mt-sm">
                  <div>
                    <div className="font-mono-metadata text-[10px] text-white/40 uppercase tracking-widest">{en ? "ACTIVE SPECIMEN" : "活動個體代號"}</div>
                    <div className="text-xs font-mono text-[#fccb5a] font-semibold">{en ? "DITTO_CORE" : "NO.132 DITTO"}</div>
                  </div>
                  <div className="border-l border-white/10 pl-sm">
                    <div className="font-mono-metadata text-[10px] text-white/40 uppercase tracking-widest">{en ? "RESTORATION PLAN" : "大區生態復育計畫"}</div>
                    <div className="text-xs font-semibold text-white/80">{en ? "ACTIVE RUNTIME" : "5 大群系重組中"}</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Text & Navigation Actions */}
              <div className="lg:w-1/2 border-t lg:border-t-0 lg:border-l border-white/15 pt-md lg:pt-0 lg:pl-lg flex flex-col justify-between">
                <div>
                  <p className="text-white/80 text-sm leading-relaxed mb-md font-body-base">
                    {en
                      ? "In Pokémon Pokopia, you are not a typical trainer, but a Ditto mimicking human form. Driven by a glitch in the planetary Supercomputer, you awake alongside Doctor Tangrowth. Together, you will repair power grids, build complex automation ecosystems, master resource industrial chains, and bring Pokémon out of the system blocks back to the pristine land."
                      : "在《寶可夢 Pokopia》世界觀中，玩家扮演一隻擬態成人類的百變怪，在因系統錯誤實體化甦醒後，攜手「巨蔓藤博士」開啟生態復建征途。你必須利用模擬複製技能，從澆灌乾涸荒野、架設海灘電網，到在空島用混凝土與鐵錠重建摩天大樓，在真新鎮調和 300 種寶可夢的需求衝突，引導萬物回歸。"}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-sm">
                  <Link
                    to="/map"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-label-caps text-xs px-5 py-3 rounded-sm shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">map</span>
                    {en ? "Explore World Map" : "進入探索地圖"}
                  </Link>
                  <Link
                    to="/guide?id=meta-history"
                    className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-label-caps text-xs px-5 py-3 rounded-sm transition-all duration-300 hover:bg-white/5"
                  >
                    <span className="material-symbols-outlined text-[16px]">history_edu</span>
                    {en ? "Read Making Legend" : "閱讀開發歷史"}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </ScrollFade>

        {/* Latest Intelligence Separation Line */}
        <motion.div variants={itemVariants} className="w-full border-t border-line mb-md flex items-center pt-xs">
          <span className="font-mono-metadata text-mono-metadata text-primary mr-sm">I.</span>
          <span className="font-label-caps text-label-caps text-ink-mute uppercase tracking-widest">
            {t("home.latestIntelligence")}
          </span>
          <div className="flex-grow"></div>
          <span className="font-mono-metadata text-mono-metadata text-ink-faint">{data.featured.date}</span>
        </motion.div>

        {/* 2-Column Responsive Layout: Left content area & Right Milestone Timeline Side panel */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-md mb-xl">
          {/* Left Area (Featured large block + 2x2 secondary news stack) */}
          <div className="lg:col-span-8 flex flex-col gap-md">
            {/* Featured Article */}
            <ScrollFade depth="mid" className="w-full flex flex-col">
              <MotionLink to={data.featured.link} variants={itemVariants} className="bg-bone border border-line-soft border-x-0 sm:border-x rounded-none sm:rounded-DEFAULT -mx-4 sm:mx-0 overflow-hidden ambient-shadow transition-all group relative cursor-pointer flex flex-col min-h-[400px] flex-grow block">
                <div className="absolute top-sm right-sm z-10 bg-paper/80 backdrop-blur-md px-2 py-1 rounded-sm border border-line-soft">
                  <span className="font-mono-metadata text-mono-metadata text-ink-soft">{data.featured.tag}</span>
                </div>
                <div className="absolute top-sm left-sm z-10">
                  <span className="font-mono-metadata text-mono-metadata text-primary">★</span>
                </div>
                <div className="h-64 md:h-80 w-full overflow-hidden bg-surface-dim relative">
                  <img 
                    src={data.featured.image} 
                    alt="Featured" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bone via-bone/20 to-transparent"></div>
                </div>
                <div className="p-6 sm:p-lg flex-grow flex flex-col justify-end bg-bone relative -mt-16 z-10">
                  <h2 className="font-headline-md text-headline-md text-ink-soft mb-xs leading-tight group-hover:text-primary transition-colors">
                    {i18n.language === "en" ? data.featured.titleEn : data.featured.titleZh}
                  </h2>
                  <p className="font-body-base text-body-base text-ink-mute line-clamp-2 mb-sm">
                    {i18n.language === "en" ? data.featured.excerptEn : data.featured.excerptZh}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-sm border-t border-line-soft">
                    <span className="font-mono-metadata text-mono-metadata text-ink-faint">
                      {t("home.by", { author: data.featured.author })} • {t("home.readTime", { time: data.featured.readTime })}
                    </span>
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                      arrow_right_alt
                    </span>
                  </div>
                </div>
              </MotionLink>
            </ScrollFade>

            {/* Grid of Remaining news */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
              {data.news.map((item: any, idx: number) => (
                <ScrollFade key={item.id} depth="fg" delay={idx * 0.05} className="flex-grow">
                  <MotionLink to={item.link} variants={itemVariants} className="bg-bone border border-line-soft border-x-0 sm:border-x rounded-none sm:rounded-DEFAULT -mx-4 sm:mx-0 overflow-hidden ambient-shadow transition-all group flex flex-row h-[120px] relative cursor-pointer block">
                    <div className="w-1/3 bg-surface-dim relative overflow-hidden">
                      <img 
                        src={item.image} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                      />
                    </div>
                    <div className="p-xs flex flex-col justify-between w-2/3">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-mono-metadata text-[9.5px] leading-tight text-ink-faint">
                            {i18n.language === "en" ? item.tagEn : item.tagZh}
                          </span>
                          <span className="font-mono-metadata text-[10px] text-primary">{item.number}</span>
                        </div>
                        <h3 className="font-headline-sm text-ink-soft mb-0.5 text-sm md:text-sm leading-snug font-bold group-hover:text-primary transition-colors line-clamp-2">
                          {i18n.language === "en" ? item.titleEn : item.titleZh}
                        </h3>
                      </div>
                      <span className="font-mono-metadata text-[9px] text-ink-mute mt-1 border-t border-line-soft pt-1 inline-block">
                        {t("home.updatedAgo", { time: i18n.language === "en" ? item.updatedAgoEn : item.updatedAgoZh })}
                      </span>
                    </div>
                  </MotionLink>
                </ScrollFade>
              ))}
            </div>
          </div>

          {/* Right Column: Beautiful vertical Milestone Timeline Side Panel */}
          <aside className="lg:col-span-4 flex flex-col gap-md">
            <ScrollFade depth="fg" className="w-full h-full">
              <div className="bg-bone border border-line-soft border-x-0 sm:border-x rounded-none sm:rounded-DEFAULT -mx-4 sm:mx-0 p-sm flex flex-col gap-sm shadow-sm h-full relative overflow-hidden">
                {/* Header block with tag */}
                <div className="border-b border-line-soft pb-sm mb-xs">
                  <span className="font-mono-metadata text-mono-metadata text-primary uppercase tracking-widest block mb-1">
                    {en ? "MARKET & DEV MILESTONES" : "首發神話紀錄碑"}
                  </span>
                  <h3 className="font-display-lg text-lg text-ink-soft font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">award_star</span>
                    {en ? "Pokopia Launch Legend" : "NS2 開發與銷量里程碑"}
                  </h3>
                  <p className="text-[11px] text-ink-mute mt-1 leading-relaxed">
                    {en 
                      ? "Official game achievements and critical success following its world debut on March 5, 2026."
                      : "彙整自 Wikipedia 與 VGChartz 等權威數據，見證本作開創性的市場奇蹟，無任何捏造。"}
                  </p>
                </div>

                {/* Vertical Timeline container */}
                <div className="relative pl-6 flex flex-col gap-6 py-2">
                  {/* The vertical solid line */}
                  <div className="absolute left-3 top-0 bottom-0 w-[1.5px] bg-line-soft" />

                  {milestones.map((milestone, idx) => {
                    const IconComponent = milestone.icon;
                    const isActive = activeTimelineIdx === idx;
                    return (
                      <div
                        key={idx}
                        className="relative transition-all duration-300"
                        onMouseEnter={() => setActiveTimelineIdx(idx)}
                        onMouseLeave={() => setActiveTimelineIdx(null)}
                      >
                        {/* Dot indicator matching icon element */}
                        <div
                          className={`absolute -left-6 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 z-10 ${
                            isActive
                              ? "bg-primary border-primary scale-110 text-white shadow-sm"
                              : "bg-paper-warm border-line-soft text-ink-soft scale-100"
                          }`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>

                        {/* Title and Badge */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono-metadata text-[10px] text-primary">{milestone.time}</span>
                            {milestone.highlight && (
                              <span className="bg-[#fccb5a]/20 border border-[#fccb5a]/50 text-secondary font-mono-metadata text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                                {en ? "DREAM TEAM" : "大森滋企劃"}
                              </span>
                            )}
                          </div>
                          <h4 className={`font-headline-sm text-sm font-bold transition-colors leading-tight ${
                            isActive ? "text-primary" : "text-ink-soft"
                          }`}>
                            {en ? milestone.titleEn : milestone.titleZh}
                          </h4>
                          <p className="text-[11.5px] leading-relaxed text-ink-mute transition-colors">
                            {en ? milestone.subEn : milestone.subZh}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-auto pt-sm border-t border-line-soft flex items-center justify-between text-[10px] text-ink-faint font-mono-metadata">
                  <span>SOURCE: Wikipedia, VGChartz</span>
                  <span>v1.0.4-SOSS</span>
                </div>
              </div>
            </ScrollFade>
          </aside>
        </section>
      </motion.div>
    </>
  );
}

