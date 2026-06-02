import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import CharacterNetwork from "../components/CharacterNetwork";

const STAGES = [
  { id: 'intro', labelEn: 'Awakening', labelZh: '甦醒 (序章)', chars: ['132', '465'] },
  { id: 'early', labelEn: 'Town Building', labelZh: '聚落發展', chars: ['235', '479'] },
  { id: 'mid', labelEn: 'Power Restoration', labelZh: '電力復原', chars: ['143'] },
  { id: 'late', labelEn: 'Skylands Ascent', labelZh: '空島登頂', chars: [] },
  { id: 'end', labelEn: 'Final Ascent', labelZh: '最終告別', chars: [] }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function Characters() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [selectedChar, setSelectedChar] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  useEffect(() => {
    fetch("/data/pokedex.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return null;

  const baseCharacters = data.pokemon.filter((pkmn: any) => 
    ["Protagonist", "Story Character", "Mentor"].includes(pkmn.roleEn)
  );

  const filteredCharacters = activeFilter === "All"
    ? baseCharacters
    : baseCharacters.filter((pkmn: any) => pkmn.roleEn === activeFilter);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <motion.header variants={itemVariants} className="mb-gutter">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-md">
          <div>
            <h1 className="font-display-lg text-display-lg text-ink-soft mb-sm">
              {i18n.language === "en" ? "Characters & Story" : "角色與劇情人物"}
            </h1>
            <p className="font-body-italic text-body-italic text-ink-mute max-w-2xl">
              {i18n.language === "en" 
                ? "Key figures shaping the restoration of Kanto." 
                : "塑造關都復興之路的關鍵靈魂人物。"}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {["All", "Protagonist", "Mentor", "Story Character"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`font-label-caps text-label-caps px-4 py-2 rounded-full transition-colors border ${
                  activeFilter === f
                    ? "bg-primary text-paper-warm border-primary"
                    : "bg-surface border-line-soft text-ink-mute hover:text-primary hover:border-primary cursor-pointer"
                }`}
              >
                {i18n.language === "en" 
                  ? f 
                  : (f === "All" ? "全部" : f === "Protagonist" ? "主角" : f === "Mentor" ? "導師" : "劇情角色")}
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        {filteredCharacters.map((char: any) => (
          <motion.article 
            key={char.id} 
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            className="bg-bone border border-line-soft rounded-sm p-sm flex flex-col relative ambient-shadow paper-texture cursor-pointer"
            onClick={() => setSelectedChar(char)}
          >
            <div className="flex justify-between items-start mb-sm">
              <span className="font-mono-metadata text-mono-metadata text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
                {i18n.language === "en" ? char.roleEn : char.roleZh}
              </span>
            </div>
            
            <div className="w-full aspect-square mb-xs bg-surface-container-high rounded-sm border border-line-soft overflow-hidden relative flex items-center justify-center p-4">
              <img 
                src={char.image} 
                alt={char.nameEn} 
                className="object-contain w-full h-full mix-blend-multiply opacity-90 transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="text-[10px] text-ink-faint mb-sm flex gap-1 flex-wrap">
              <span>{i18n.language === "en" ? "Img Source:" : "圖片出處:"}</span>
              <a href="https://bulbapedia.bulbagarden.net/wiki/Main_Page" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline decoration-dashed underline-offset-2">Bulbapedia</a>
            </div>

            <div className="flex flex-col mt-auto flex-grow">
              <h2 className="font-headline-md text-headline-md mb-xs text-ink-soft">
                {i18n.language === "en" ? char.nameEn : char.nameZh}
              </h2>
              <div className="mb-md">
                <span className="font-label-caps text-label-caps text-ink-mute uppercase">
                  {t("pokedex.specialty")}: 
                </span>
                <span className="font-mono-metadata text-mono-metadata ml-2 text-ink-soft bg-surface-variant px-1 rounded-sm">
                  {i18n.language === "en" ? char.specialtyEn : char.specialtyZh}
                </span>
              </div>
              <p className="font-body-base text-body-base text-ink-soft line-clamp-4 hover:line-clamp-none transition-all mb-4">
                {i18n.language === "en" ? char.descriptionEn : char.descriptionZh}
              </p>
              <div className="mt-auto pt-sm border-t border-dashed border-line-soft">
                 <p className="font-mono-metadata text-mono-metadata text-ink-faint flex items-center justify-start gap-2 flex-wrap mb-1">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">link</span>{i18n.language === "en" ? "Source:" : "資料出處:"}</span>
                    <a href="https://bulbapedia.bulbagarden.net/wiki/Main_Page" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline decoration-dashed underline-offset-2" onClick={(e) => e.stopPropagation()}>
                       Bulbapedia
                    </a>
                    <span>·</span>
                    <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline decoration-dashed underline-offset-2" onClick={(e) => e.stopPropagation()}>
                       PokeAPI
                    </a>
                 </p>
                 <p className="font-mono-metadata text-mono-metadata text-ink-faint text-[11px] leading-tight flex items-start gap-1 mt-1">
                    <span className="material-symbols-outlined text-[12px] mt-[1px]">copyright</span>
                    <span>{i18n.language === "en" ? "Nintendo, Game Freak, and The Pokémon Company." : "版權歸屬任天堂、Game Freak 及 The Pokémon Company。本站僅作攻略資訊整合。"}</span>
                 </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <CharacterNetwork characters={baseCharacters} onNodeClick={setSelectedChar} />

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
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-bone border border-line rounded-lg sm:rounded-xl md:rounded-2xl ambient-shadow w-[95vw] sm:w-[90vw] md:max-w-2xl max-h-[90vh] overflow-y-auto relative paper-texture mx-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedChar(null)}
                className="absolute top-sm right-sm z-10 text-ink-mute hover:text-primary transition-colors bg-paper/80 backdrop-blur-md rounded-full p-1 border border-line-soft"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <div className="flex flex-col md:flex-row border-b border-line-soft">
                <div className="bg-surface-container-high border-b md:border-b-0 md:border-r border-line-soft flex flex-col items-center justify-center p-lg md:w-1/3 aspect-square md:aspect-auto relative">
                    <img src={selectedChar.image} alt={selectedChar.nameEn} className="object-contain w-full h-full max-h-48 mb-4" />
                    <div className="absolute bottom-2 right-2 text-[10px] text-ink-faint flex gap-1 bg-surface/50 backdrop-blur-sm px-2 py-1 rounded">
                      <span>{i18n.language === "en" ? "Img Source:" : "圖片出處:"}</span>
                      <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline decoration-dashed underline-offset-2">PokeAPI</a>
                    </div>
                </div>
                <div className="p-lg md:w-2/3">
                  <span className="font-mono-metadata text-mono-metadata text-primary bg-primary/10 px-2 py-0.5 rounded-sm inline-block mb-3">
                    {i18n.language === "en" ? selectedChar.roleEn : selectedChar.roleZh}
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-ink-soft mb-2">
                    {i18n.language === "en" ? selectedChar.nameEn : selectedChar.nameZh}
                  </h2>
                  <p className="font-body-base text-body-base text-ink-soft leading-relaxed mb-4">
                    {i18n.language === "en" ? selectedChar.descriptionEn : selectedChar.descriptionZh}
                  </p>
                </div>
              </div>
              
              <div className="p-lg bg-surface-dim">
                <h3 className="font-label-caps text-label-caps text-ink-mute mb-md uppercase">
                  {i18n.language === "en" ? "Story Introduction Timeline" : "劇情登場時間軸"}
                </h3>
                
                <div className="relative pt-2 pb-6">
                  {/* Horizontal Line behind */}
                  <div className="absolute top-[14px] left-[10%] right-[10%] h-0.5 bg-line-soft z-0"></div>
                  
                  <div className="flex justify-between relative z-10">
                    {STAGES.map((stage) => {
                      const isActive = stage.chars.includes(selectedChar.id);
                      return (
                        <div key={stage.id} className="flex flex-col items-center w-1/5 relative group">
                          <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 mb-2 transition-all duration-300 ${isActive ? 'bg-primary border-primary ring-4 ring-primary/20 scale-110' : 'bg-surface border-line-soft group-hover:border-primary/50'}`}>
                          </div>
                          <span className={`text-[10px] sm:text-xs font-mono-metadata text-center leading-tight ${isActive ? 'text-primary font-bold' : 'text-ink-mute'}`}>
                            {i18n.language === "en" ? stage.labelEn : stage.labelZh}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
