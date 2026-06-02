import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Guide() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/guide.json")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setActiveId(d.guides?.[0]?.id ?? null);
      });
  }, []);

  if (!data || !activeId) return null;

  const en = i18n.language === "en";
  const guides: any[] = data.guides ?? [];
  const guide = guides.find((g) => g.id === activeId) ?? guides[0];

  const openGuide = (id: string) => {
    setActiveId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const related = (guide.relatedIds ?? [])
    .map((id: string) => guides.find((g) => g.id === id))
    .filter(Boolean);

  return (
    <>
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
              {index === 1 && guide.image && (
                <div className="bg-bone hairline-border p-sm my-8 relative ambient-shadow rounded-sm">
                  <div className="absolute top-2 right-2 font-mono-metadata text-mono-metadata text-ink-mute">FIG. 1</div>
                  <img
                    src={guide.image.src}
                    alt="Figure 1"
                    className="w-full h-auto mb-4 rounded-sm"
                  />
                  <p className="font-mono-metadata text-mono-metadata text-ink-mute mt-4 border-t border-line-soft pt-2">
                    {en ? guide.image.captionEn : guide.image.captionZh}
                  </p>
                </div>
              )}

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
    </>
  );
}
