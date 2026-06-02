import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Home() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/data/home.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return null;

  return (
    <>
      <header className="mb-xl text-center md:text-left flex flex-col items-center md:items-start">
        <span className="font-mono-metadata text-mono-metadata text-primary uppercase tracking-widest mb-4">
          {t("home.vol")}
        </span>
        <h1 className="font-display-lg text-display-lg text-ink-soft mb-sm">{t("home.title")}</h1>
        <p className="font-body-italic text-body-italic text-ink-mute max-w-2xl">{t("home.subtitle")}</p>
      </header>

      <div className="w-full border-t border-line mb-md flex items-center pt-xs">
        <span className="font-mono-metadata text-mono-metadata text-primary mr-sm">I.</span>
        <span className="font-label-caps text-label-caps text-ink-mute uppercase tracking-widest">
          {t("home.latestIntelligence")}
        </span>
        <div className="flex-grow"></div>
        <span className="font-mono-metadata text-mono-metadata text-ink-faint">{data.featured.date}</span>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-md mb-xl">
        {/* Featured Article */}
        <article className="md:col-span-7 bg-bone border border-line-soft rounded-DEFAULT overflow-hidden ambient-shadow transition-all group relative cursor-pointer flex flex-col min-h-[400px]">
          <Link to={data.featured.link} className="absolute inset-0 z-20"></Link>
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
          <div className="p-lg flex-grow flex flex-col justify-end bg-bone relative -mt-16 z-10">
            <h2 className="font-headline-md text-headline-md text-ink-soft mb-xs leading-tight">
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
        </article>

        {/* Secondary News Stack */}
        <div className="md:col-span-5 flex flex-col gap-md">
          {data.news.map((item: any) => (
            <article key={item.id} className="bg-bone border border-line-soft rounded-DEFAULT overflow-hidden ambient-shadow transition-all group flex flex-row h-full relative cursor-pointer">
              <Link to={item.link} className="absolute inset-0 z-20"></Link>
              <div className="w-1/3 bg-surface-dim relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt="Thumbnail" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                />
              </div>
              <div className="p-sm flex flex-col justify-between w-2/3">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono-metadata text-mono-metadata text-ink-faint">
                      {i18n.language === "en" ? item.tagEn : item.tagZh}
                    </span>
                    <span className="font-mono-metadata text-mono-metadata text-primary">{item.number}</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-ink-soft mb-1 text-lg group-hover:text-primary transition-colors">
                    {i18n.language === "en" ? item.titleEn : item.titleZh}
                  </h3>
                </div>
                <span className="font-mono-metadata text-mono-metadata text-ink-mute mt-4 border-t border-line-soft pt-2 inline-block">
                  {t("home.updatedAgo", { time: i18n.language === "en" ? item.updatedAgoEn : item.updatedAgoZh })}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
