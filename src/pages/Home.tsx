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
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-line-soft border-t-primary rounded-full animate-spin"></div>
        <Seo
          title={seoTitle}
          description={seoDescription}
          lang={en ? "en" : "zh-Hant"}
          keywords={["Pokemon Pokopia", "Pokopia guide", "Pokopia Chronicles", "Pokemon restoration game"]}
        />
      </div>
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
        <motion.header variants={itemVariants} className="mb-md text-center md:text-left flex flex-col items-center md:items-start">
          <span className="font-mono-metadata text-mono-metadata text-primary uppercase tracking-widest mb-4">
            {t("home.vol")}
          </span>
          <h1 className="font-display-lg text-display-lg text-ink-soft mb-sm">{t("home.title")}</h1>
          <p className="font-body-italic text-body-italic text-ink-mute max-w-2xl">{t("home.subtitle")}</p>
        </motion.header>

        {/* Epic World Setting Prologue */}
        <ScrollFade depth="bg" className="mb-md">
          <motion.div
            variants={itemVariants}
            className="border-y border-line-soft py-6 lg:py-8 flex flex-col lg:flex-row gap-lg items-stretch"
          >
            <div className="relative z-10 flex flex-col lg:flex-row gap-lg items-stretch w-full">
              {/* Left Column: World Setup Story */}
              <div className="lg:w-1/2 flex flex-col justify-between">
                <div>
                  <span className="font-mono-metadata text-sm text-primary uppercase tracking-widest mb-6 inline-flex items-center gap-2">
                    {en ? "Prologue" : "序章"}
                  </span>
                  <h2 className="font-display-lg text-3xl lg:text-4xl text-ink-soft mb-sm tracking-tight leading-tight">
                    {en ? "The Awakened Glitch: Echoes of an Abandoned World" : "後末日關都：超級電腦與甦醒的百變怪"}
                  </h2>
                  <p className="font-body-italic text-lg text-ink-mute leading-relaxed italic mt-md">
                    {en
                      ? "“An exodus of humanity, a sleeping database of 300 species safely stored in an endless supercomputer. Then, a single code glitch materializes our tiny copy-nature hero.”"
                      : "「由於大自然急劇乾旱與重工業垃圾污染，全人類撤離地球移居外太空……無法帶走的寶可夢與棲息地則被寫入超級電腦，直到一次未知的系統故障，開啟了復育序曲。」"}
                  </p>
                </div>
              </div>

              {/* Right Column: Editorial Text & Navigation Actions */}
              <div className="lg:w-1/2 lg:pl-lg flex flex-col justify-between h-full">
                <div>
                  <p className="text-ink-soft text-base leading-relaxed mb-8 font-body-base">
                    {en
                      ? "In Pokémon Pokopia, you are not a typical trainer, but a Ditto mimicking human form. You awake alongside Doctor Tangrowth. Together, you will repair power grids, build ecosystems, master resource chains, and bring Pokémon back to the pristine land."
                      : "在《寶可夢 Pokopia》世界觀中，玩家扮演一隻擬態成人類的百變怪，攜手「巨蔓藤博士」開啟生態復建征途。你必須利用模擬複製技能，從澆灌荒野、架設電網，到建設摩天大樓，在真新鎮調和 300 種寶可夢的需求衝突，引導萬物回歸。"}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-8">
                  <Link
                    to="/map"
                    className="inline-flex items-center gap-2 bg-primary hover:opacity-90 text-white font-label-caps tracking-widest text-xs px-8 py-4 transition-colors duration-200"
                  >
                    <span className="material-symbols-outlined text-[16px]">map</span>
                    {en ? "Explore World Map" : "進入探索地圖"}
                  </Link>
                  <Link
                    to="/guide?id=meta-history"
                    className="inline-flex items-center gap-2 border hairline-border hover:border-ink-soft text-ink-soft font-label-caps tracking-widest text-xs px-6 py-4 transition-colors duration-200"
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
          <div className="lg:col-span-8 flex flex-col gap-12">
            {/* Featured Article */}
            <ScrollFade depth="mid" className="w-full flex flex-col">
              <MotionLink to={data.featured.link} variants={itemVariants} className="group relative cursor-pointer flex flex-col block">
                <div className="h-64 md:h-96 w-full overflow-hidden bg-surface-dim relative mb-6">
                  <img 
                    src={data.featured.image} 
                    alt="Featured" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply opacity-90"
                  />
                  <div className="absolute top-4 left-4 z-10 bg-paper/90 backdrop-blur px-3 py-1 border border-line-soft">
                    <span className="font-mono-metadata text-xs text-ink-soft tracking-widest uppercase">{data.featured.tag}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h2 className="font-headline-md text-3xl md:text-5xl text-ink-soft mb-4 leading-tight group-hover:text-ink-main transition-colors">
                    {i18n.language === "en" ? data.featured.titleEn : data.featured.titleZh}
                  </h2>
                  <p className="font-body-base text-lg text-ink-mute mb-6 line-clamp-2 leading-relaxed">
                    {i18n.language === "en" ? data.featured.excerptEn : data.featured.excerptZh}
                  </p>
                  <div className="flex items-center justify-between border-t border-line-soft pt-4">
                    <span className="font-mono-metadata text-xs text-ink-faint uppercase tracking-widest">
                      {t("home.by", { author: data.featured.author })} • {t("home.readTime", { time: data.featured.readTime })}
                    </span>
                    <span className="material-symbols-outlined text-ink-mute group-hover:translate-x-1 group-hover:text-ink-main transition-transform">
                      arrow_right_alt
                    </span>
                  </div>
                </div>
              </MotionLink>
            </ScrollFade>

            {/* Grid of Remaining news */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 border-t border-line-soft pt-8">
              {data.news.map((item: any, idx: number) => (
                <ScrollFade key={item.id} depth="fg" delay={idx * 0.05} className="flex-grow">
                  <MotionLink to={item.link} variants={itemVariants} className="group flex flex-col relative cursor-pointer block h-full">
                    <div className="w-full aspect-[16/9] bg-surface-dim relative overflow-hidden mb-4">
                      <img 
                        src={item.image} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono-metadata text-xs uppercase tracking-widest text-ink-faint">
                          {i18n.language === "en" ? item.tagEn : item.tagZh}
                        </span>
                        <span className="font-mono-metadata text-xs text-ink-mute">NO.{item.number}</span>
                      </div>
                      <h3 className="font-headline-sm text-ink-soft mb-3 text-lg leading-snug font-bold group-hover:text-primary transition-colors line-clamp-2">
                        {i18n.language === "en" ? item.titleEn : item.titleZh}
                      </h3>
                      <span className="font-mono-metadata text-xs text-ink-mute mt-auto uppercase tracking-widest">
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
              <div className="flex flex-col h-full relative">
                {/* Header block with tag */}
                <div className="border-b border-ink-soft pb-4 mb-4">
                  <span className="font-mono-metadata text-xs text-ink-soft uppercase tracking-widest block mb-2">
                    {en ? "MARKET & DEV MILESTONES" : "首發神話紀錄碑"}
                  </span>
                  <h3 className="font-display-lg text-2xl text-ink-soft font-bold flex items-center gap-2 mb-2">
                    {en ? "Pokopia Launch Legend" : "NS2 開發與銷量里程碑"}
                  </h3>
                  <p className="font-body-italic text-sm text-ink-mute leading-relaxed">
                    {en 
                      ? "Official game achievements and critical success following its world debut on March 5, 2026."
                      : "彙整自權威數據，見證本作開創性的市場奇蹟。"}
                  </p>
                </div>

                {/* Vertical Timeline container */}
                <div className="relative pl-6 flex flex-col gap-8 py-4">
                  {/* The vertical solid line */}
                  <div className="absolute left-2.5 top-2 bottom-4 w-px bg-line-soft" />

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
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 z-10 ${
                            isActive
                              ? "bg-ink-soft border-ink-soft scale-110 text-white"
                              : "bg-paper-warm border-ink-faint text-ink-faint scale-100"
                          }`}
                        >
                          <IconComponent className="w-3 h-3" />
                        </div>

                        {/* Title and Badge */}
                        <div className="flex flex-col gap-1.5 pl-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono-metadata text-xs text-ink-mute uppercase tracking-widest">{milestone.time}</span>
                            {milestone.highlight && (
                              <span className="text-secondary font-mono-metadata text-xs uppercase tracking-widest">
                                {en ? "DREAM TEAM" : "大森滋企劃"}
                              </span>
                            )}
                          </div>
                          <h4 className={`font-headline-sm text-base font-bold transition-colors leading-tight ${
                            isActive ? "text-primary" : "text-ink-soft"
                          }`}>
                            {en ? milestone.titleEn : milestone.titleZh}
                          </h4>
                          <p className={`text-sm leading-relaxed transition-colors ${
                            isActive ? "text-ink-soft" : "text-ink-mute"
                          }`}>
                            {en ? milestone.subEn : milestone.subZh}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-auto pt-4 border-t border-line-soft flex items-center justify-between text-xs text-ink-faint font-mono-metadata uppercase tracking-widest">
                  <span>SOURCE: VGChartz</span>
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

