import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import GuideDiagram from "../components/GuideDiagram";

export default function Guide() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

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
      {/* Volume switcher — the real archive index */}
      <nav className="flex flex-wrap gap-xs mb-lg">
        {guides.map((g) => (
          <button
            key={g.id}
            onClick={() => openGuide(g.id)}
            className={`font-mono-metadata text-mono-metadata uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${
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
      </div>

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
            <div key={sec.id}>
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
              <p className="mb-6">{en ? sec.contentEn : sec.contentZh}</p>

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
                  {sec.steps.map((step: any, sIdx: number) => (
                    <div key={step.id || sIdx} className="relative group">
                      {/* Timeline circular node marker */}
                      <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-paper border-2 border-primary flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-paper transition-all">
                        <span className="material-symbols-outlined text-[13px] font-bold text-primary group-hover:text-paper">
                          {step.icon || "done"}
                        </span>
                      </div>
                      
                      {/* Detailed node card */}
                      <div className="bg-bone border border-line-soft p-5 rounded-sm ambient-shadow hover:translate-x-1 hover:border-primary/50 transition-all">
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-3 border-b border-line-soft pb-2">
                          <h4 className="font-headline-sm text-[15px] font-medium text-ink-soft flex items-center gap-2 m-0 p-0">
                            <span className="font-mono-metadata text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-sm font-bold tracking-wider">
                              STEP {sIdx + 1}
                            </span>
                            {en ? step.nodeTitleEn : step.nodeTitleZh}
                          </h4>
                          {step.badgeZh && (
                            <span className="font-mono-metadata text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-primary/15 text-primary border border-primary/30">
                              {en ? (step.badgeEn || step.badgeZh) : step.badgeZh}
                            </span>
                          )}
                        </div>
                        <p className="font-body-base text-sm text-ink-main whitespace-pre-line leading-relaxed m-0">
                          {en ? step.descEn : step.descZh}
                        </p>
                      </div>
                    </div>
                  ))}
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
            </div>
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
    </>
  );
}
