import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Guide() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/data/guide.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return null;

  return (
    <>
      <div className="border-b border-line pb-lg mb-lg">
        <div className="font-mono-metadata text-mono-metadata text-ink-mute uppercase mb-4 tracking-widest">
          Volume {data.vol}. / {i18n.language === "en" ? data.categoryEn : data.categoryZh}
        </div>
        <h1 className="font-display-lg text-display-lg text-ink-soft mb-sm leading-tight max-w-4xl">
          {i18n.language === "en" ? data.titleEn : data.titleZh}
        </h1>
        <p className="font-body-italic text-body-italic text-ink-mute max-w-2xl">
          {i18n.language === "en" ? data.subtitleEn : data.subtitleZh}
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
              {data.sections.map((sec: any) => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`} className="font-mono-metadata text-mono-metadata text-ink-mute hover:text-primary transition-colors">
                    {sec.roman} {i18n.language === "en" ? sec.titleEn : sec.titleZh}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <article className="md:col-span-9 font-body-base text-body-base text-ink-soft leading-relaxed max-w-prose">
          {data.sections.map((sec: any, index: number) => (
            <div key={sec.id}>
              {index === 1 && (
                <div className="bg-bone hairline-border p-sm my-8 relative ambient-shadow rounded-sm">
                  <div className="absolute top-2 right-2 font-mono-metadata text-mono-metadata text-ink-mute">FIG. 1</div>
                  <img 
                    src={data.image.src} 
                    alt="Figure 1" 
                    className="w-full h-auto mb-4 mix-blend-multiply opacity-90 rounded-sm"
                  />
                  <p className="font-mono-metadata text-mono-metadata text-ink-mute mt-4 border-t border-line-soft pt-2">
                    {i18n.language === "en" ? data.image.captionEn : data.image.captionZh}
                  </p>
                </div>
              )}

              {index === 2 && (
                 <div className="grid grid-cols-2 gap-4 my-8">
                  <div className="bg-paper-warm hairline-border p-4 rounded-sm">
                    <div className="font-label-caps text-label-caps text-ink-mute mb-2">Optimal Time</div>
                    <div className="font-headline-md text-headline-md text-ink-soft">{i18n.language === "en" ? data.stats.optimalTimeEn : data.stats.optimalTimeZh}</div>
                  </div>
                  <div className="bg-paper-warm hairline-border p-4 rounded-sm">
                    <div className="font-label-caps text-label-caps text-ink-mute mb-2">Success Rate</div>
                    <div className="font-headline-md text-headline-md text-primary">{data.stats.successRate}</div>
                  </div>
                </div>
              )}

              <h2 id={sec.id} className="font-headline-sm text-headline-sm text-ink-soft mt-12 mb-6 flex items-center gap-4">
                <span className="text-primary font-mono-metadata text-sm">{sec.roman}</span> {i18n.language === "en" ? sec.titleEn : sec.titleZh}
              </h2>
              <p className="mb-6">{i18n.language === "en" ? sec.contentEn : sec.contentZh}</p>

              {sec.listEn && (
                <ul className="list-disc pl-6 space-y-4 mb-8">
                  {(i18n.language === "en" ? sec.listEn : sec.listZh).map((item: string, i: number) => {
                     const [bold, rest] = item.split(": ");
                     return (
                        <li key={i}><strong>{bold}:</strong> {rest}</li>
                     )
                  })}
                </ul>
              )}
            </div>
          ))}
        </article>
      </div>

      {/* Further Reading */}
      <div className="mt-xl pt-lg border-t border-line">
        <div className="flex justify-between items-end mb-8">
          <h3 className="font-headline-sm text-headline-sm text-ink-soft">{t("guide.furtherReading")}</h3>
          <a href="#" className="font-label-caps text-label-caps text-primary hover:opacity-80 transition-opacity flex items-center gap-1 uppercase">
            {t("guide.viewArchive")} <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {data.related.map((item: any, i: number) => (
            <a key={i} className="group bg-bone hairline-border p-sm rounded-sm ambient-shadow flex flex-col h-full" href="#">
              <div className="flex justify-between items-start mb-6 border-b border-line-soft pb-2">
                <span className="font-mono-metadata text-mono-metadata text-primary">{item.vol}</span>
                <span className="font-mono-metadata text-mono-metadata text-ink-mute">{i18n.language === "en" ? item.categoryEn : item.categoryZh}</span>
              </div>
              <h4 className="font-body-italic text-body-italic text-ink-soft group-hover:text-primary transition-colors flex-grow">
                {i18n.language === "en" ? item.titleEn : item.titleZh}
              </h4>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
