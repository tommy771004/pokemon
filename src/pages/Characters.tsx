import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import CharacterNetwork from "../components/CharacterNetwork";
import Seo from "../components/Seo";

type Stage = {
  id: string;
  labelEn: string;
  labelZh: string;
  summaryEn: string;
  summaryZh: string;
};

type SourceLink = {
  label: string;
  url: string;
};

type Character = {
  id: string;
  speciesId?: string;
  nameEn: string;
  nameZh: string;
  aliasEn: string;
  aliasZh: string;
  roleEn: string;
  roleZh: string;
  specialtyEn: string;
  specialtyZh: string;
  regionEn: string;
  regionZh: string;
  image: string;
  primaryStage: string;
  stageIds: string[];
  summaryEn: string;
  summaryZh: string;
  detailsEn: string;
  detailsZh: string;
  storyBeatsEn: string[];
  storyBeatsZh: string[];
  signatureSkillsEn: string[];
  signatureSkillsZh: string[];
  relatedLocationsEn: string[];
  relatedLocationsZh: string[];
  sourceLinks: SourceLink[];
};

type Relationship = {
  sourceId: string;
  targetId: string;
  type: string;
};

type RelationshipType = {
  id: string;
  labelEn: string;
  labelZh: string;
  descriptionEn: string;
  descriptionZh: string;
  color: string;
};

type CharactersData = {
  stages: Stage[];
  relationshipTypes: RelationshipType[];
  relationships: Relationship[];
  characters: Character[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 18 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

export default function Characters() {
  const { i18n } = useTranslation();
  const [data, setData] = useState<CharactersData | null>(null);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetch("/data/characters.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const en = i18n.language === "en";
  const seoTitle = en ? "Characters & Story Routes | Pokopia Chronicles" : "角色與劇情路線 | Pokopia 年代記";
  const seoDescription = en
    ? "Track Pokopia's story cast, construction allies, Dream Islands guides, and the relationship web behind each major restoration arc."
    : "追蹤 Pokopia 的劇情角色、施工夥伴、夢境引路者與各大復育章節背後的角色關係網。";

  if (!data) {
    return (
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia characters", "Pokopia story", "Peakychu", "Tinkmaster", "Chef Dente"]}
      />
    );
  }

  const filters = ["All", ...new Set(data.characters.map((char) => char.roleEn))];
  const stageMap = new Map<string, Stage>(data.stages.map((stage) => [stage.id, stage]));

  const filteredCharacters = useMemo(() => {
    if (activeFilter === "All") return data.characters;
    return data.characters.filter((char) => char.roleEn === activeFilter);
  }, [activeFilter, data.characters]);

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia characters", "Pokopia story", "Peakychu", "Tinkmaster", "Chef Dente", "Dream Islands"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: seoTitle,
          description: seoDescription,
          url: "https://pokopiachronicles.com/characters",
          inLanguage: en ? "en" : "zh-Hant",
          about: "Pokopia story characters and plot roles",
        }}
      />

      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <motion.header variants={itemVariants} className="mb-gutter">
          <div className="flex flex-col gap-md border-b border-line pb-md">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <span className="font-mono-metadata text-mono-metadata text-primary uppercase tracking-widest block mb-2">
                  {en ? "Story Archive" : "劇情檔案"}
                </span>
                <h1 className="font-display-lg text-display-lg text-ink-soft mb-sm">
                  {en ? "Characters & Story Routes" : "角色與劇情路線"}
                </h1>
                <p className="font-body-italic text-body-italic text-ink-mute max-w-3xl">
                  {en
                    ? "From Professor Tangrowth's briefings to Peakychu's construction escort, these are the named figures and support roles that hold Pokopia's rebuilding arcs together."
                    : "從巨蔓藤博士的任務導引，到 Peakychu 的施工護送，這裡整理的是支撐 Pokopia 各段重建劇情的具名角色與關鍵夥伴。"}
                </p>
              </div>
              <div className="font-mono-metadata text-mono-metadata text-ink-faint uppercase tracking-widest text-left md:text-right">
                {en ? `${data.characters.length} Story Figures Logged` : `已建檔 ${data.characters.length} 位劇情角色`}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const label = en
                  ? filter
                  : filter === "All"
                    ? "全部"
                    : filter === "Protagonist"
                      ? "主角"
                      : filter === "Mentor"
                        ? "導師"
                        : "劇情角色";
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`font-label-caps text-label-caps px-4 py-2 rounded-full transition-colors border ${
                      activeFilter === filter
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-surface border-line-soft text-ink-mute hover:text-primary hover:border-primary"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.header>

        <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-5 gap-sm mb-xl">
          {data.stages.map((stage) => (
            <article key={stage.id} className="bg-paper-warm border border-line-soft rounded-sm px-4 py-3 paper-texture ambient-shadow">
              <span className="font-label-caps text-label-caps text-primary uppercase block mb-2">
                {en ? stage.labelEn : stage.labelZh}
              </span>
              <p className="font-body-base text-body-base text-ink-soft leading-relaxed">
                {en ? stage.summaryEn : stage.summaryZh}
              </p>
            </article>
          ))}
        </motion.section>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {filteredCharacters.map((char) => {
            const primaryStage = stageMap.get(char.primaryStage);
            return (
              <motion.article
                key={char.id}
                variants={itemVariants}
                whileHover={{ scale: 1.015, y: -2 }}
                className="bg-bone border border-line-soft rounded-sm p-sm flex flex-col relative ambient-shadow paper-texture cursor-pointer"
                onClick={() => setSelectedChar(char)}
              >
                <div className="flex items-start justify-between gap-3 mb-sm">
                  <div className="min-w-0">
                    <span className="font-mono-metadata text-mono-metadata text-primary uppercase tracking-wider block mb-1">
                      {en ? char.aliasEn : char.aliasZh}
                    </span>
                    <span className="font-label-caps text-label-caps text-ink-mute uppercase">
                      {en ? char.roleEn : char.roleZh}
                    </span>
                  </div>
                  <span className="font-mono-metadata text-mono-metadata text-ink-mute bg-surface-variant border border-line-soft px-2 py-1 rounded-sm shrink-0">
                    {primaryStage ? (en ? primaryStage.labelEn : primaryStage.labelZh) : "—"}
                  </span>
                </div>

                <div className="w-full aspect-square mb-sm bg-surface-container-high rounded-sm border border-line-soft overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={char.image}
                    alt={char.nameEn}
                    className="object-contain w-full h-full mix-blend-multiply opacity-90 transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="flex flex-col gap-2 flex-grow">
                  <div>
                    <h2 className="font-headline-md text-headline-md text-ink-soft">{en ? char.nameEn : char.nameZh}</h2>
                    <p className="font-body-italic text-body-italic text-ink-mute">
                      {en ? char.regionEn : char.regionZh}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="font-mono-metadata text-mono-metadata text-ink-soft bg-surface-variant px-2 py-1 rounded-sm border border-line-soft">
                      {en ? char.specialtyEn : char.specialtyZh}
                    </span>
                    {char.signatureSkillsEn.slice(0, 2).map((skill, index) => (
                      <span
                        key={skill}
                        className="font-mono-metadata text-mono-metadata text-ink-faint bg-paper-warm px-2 py-1 rounded-sm border border-line-soft"
                      >
                        {en ? skill : char.signatureSkillsZh[index]}
                      </span>
                    ))}
                  </div>

                  <p className="font-body-base text-body-base text-ink-soft leading-relaxed line-clamp-4">
                    {en ? char.summaryEn : char.summaryZh}
                  </p>

                  <div className="mt-auto pt-sm border-t border-dashed border-line-soft">
                    <p className="font-mono-metadata text-mono-metadata text-ink-faint">
                      {en ? "Linked Areas:" : "關聯地點："} {(en ? char.relatedLocationsEn : char.relatedLocationsZh).join(" · ")}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <CharacterNetwork
          characters={data.characters}
          relationships={data.relationships}
          relationshipTypes={data.relationshipTypes}
          onNodeClick={setSelectedChar}
        />

        <AnimatePresence>
          {selectedChar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedChar(null)}
              className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink-soft/40 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                className="bg-bone border border-line rounded-2xl ambient-shadow w-[95vw] sm:w-[92vw] md:max-w-5xl max-h-[90vh] overflow-y-auto relative paper-texture mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedChar(null)}
                  className="absolute top-sm right-sm z-10 text-ink-mute hover:text-primary transition-colors bg-paper/80 backdrop-blur-md rounded-full p-1 border border-line-soft"
                  aria-label={en ? "Close" : "關閉"}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] border-b border-line-soft">
                  <div className="bg-surface-container-high border-b lg:border-b-0 lg:border-r border-line-soft flex flex-col items-center justify-center p-lg relative">
                    <img src={selectedChar.image} alt={selectedChar.nameEn} className="object-contain w-full max-h-56 mb-4" />
                    <div className="text-center">
                      <span className="font-label-caps text-label-caps text-primary uppercase block mb-2">
                        {en ? selectedChar.aliasEn : selectedChar.aliasZh}
                      </span>
                      <span className="font-mono-metadata text-mono-metadata text-ink-mute border border-line-soft px-3 py-1 rounded-full">
                        {en ? selectedChar.roleEn : selectedChar.roleZh}
                      </span>
                    </div>
                  </div>

                  <div className="p-lg">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-md">
                      <div>
                        <h2 className="font-display-md text-display-md text-ink-soft leading-tight">
                          {en ? selectedChar.nameEn : selectedChar.nameZh}
                        </h2>
                        <p className="font-body-italic text-body-italic text-ink-mute">
                          {en ? selectedChar.regionEn : selectedChar.regionZh}
                        </p>
                      </div>
                      <span className="font-mono-metadata text-mono-metadata text-ink-soft bg-surface-variant border border-line-soft px-3 py-1 rounded-full">
                        {en ? selectedChar.specialtyEn : selectedChar.specialtyZh}
                      </span>
                    </div>

                    <p className="font-body-base text-body-base text-ink-soft leading-relaxed mb-lg">
                      {en ? selectedChar.detailsEn : selectedChar.detailsZh}
                    </p>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-md">
                      <section className="bg-paper-warm border border-line-soft rounded-sm p-4">
                        <h3 className="font-label-caps text-label-caps text-ink-mute uppercase mb-3">
                          {en ? "Story Beats" : "劇情節點"}
                        </h3>
                        <ul className="space-y-3">
                          {(en ? selectedChar.storyBeatsEn : selectedChar.storyBeatsZh).map((beat) => (
                            <li key={beat} className="font-body-base text-body-base text-ink-soft leading-relaxed flex gap-2">
                              <span className="text-primary">•</span>
                              <span>{beat}</span>
                            </li>
                          ))}
                        </ul>
                      </section>

                      <section className="bg-paper-warm border border-line-soft rounded-sm p-4">
                        <h3 className="font-label-caps text-label-caps text-ink-mute uppercase mb-3">
                          {en ? "Signature Skills" : "招牌能力"}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(en ? selectedChar.signatureSkillsEn : selectedChar.signatureSkillsZh).map((skill) => (
                            <span
                              key={skill}
                              className="font-mono-metadata text-mono-metadata text-ink-soft bg-surface-container-high border border-line-soft px-2 py-1 rounded-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <h4 className="font-label-caps text-label-caps text-ink-mute uppercase mb-2">
                          {en ? "Linked Areas" : "關聯地點"}
                        </h4>
                        <p className="font-body-base text-body-base text-ink-soft leading-relaxed">
                          {(en ? selectedChar.relatedLocationsEn : selectedChar.relatedLocationsZh).join(" · ")}
                        </p>
                      </section>
                    </div>
                  </div>
                </div>

                <div className="p-lg bg-surface-dim border-b border-line-soft">
                  <h3 className="font-label-caps text-label-caps text-ink-mute uppercase mb-4">
                    {en ? "Story Timeline" : "劇情時間軸"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {data.stages.map((stage) => {
                      const isActive = selectedChar.stageIds.includes(stage.id);
                      return (
                        <article
                          key={stage.id}
                          className={`rounded-sm border p-3 transition-colors ${
                            isActive
                              ? "bg-primary/10 border-primary"
                              : "bg-bone border-line-soft"
                          }`}
                        >
                          <span className={`font-label-caps text-label-caps uppercase block mb-2 ${isActive ? "text-primary" : "text-ink-mute"}`}>
                            {en ? stage.labelEn : stage.labelZh}
                          </span>
                          <p className="font-body-base text-body-base text-ink-soft leading-relaxed">
                            {en ? stage.summaryEn : stage.summaryZh}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                </div>

                <div className="p-lg">
                  <h3 className="font-label-caps text-label-caps text-ink-mute uppercase mb-3">
                    {en ? "Sources" : "資料來源"}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedChar.sourceLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono-metadata text-mono-metadata text-ink-soft bg-paper-warm border border-line-soft px-3 py-2 rounded-sm hover:text-primary transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
