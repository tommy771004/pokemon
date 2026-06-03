import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import CharacterNetwork from "../components/CharacterNetwork";
import Seo from "../components/Seo";
import ScrollFade from "../components/ScrollFade";
import { 
  Sparkles, 
  MapPin, 
  Terminal, 
  Cpu, 
  Compass, 
  ChefHat, 
  Wrench, 
  Briefcase, 
  Undo,
  Image as ImageIcon
} from "lucide-react";

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

// SVG Ditto character customizer
function InteractiveDittoPreview({ 
  skinColor, 
  hairColor, 
  outfitId, 
  en 
}: { 
  skinColor: string; 
  hairColor: string; 
  outfitId: string; 
  en: boolean;
}) {
  return (
    <div className="relative w-full aspect-square md:aspect-auto md:h-[320px] bg-paper-warm/40 border border-line-soft rounded-lg overflow-hidden flex items-center justify-center p-4">
      {/* Visual Ambient effects for terminal */}
      <div className="absolute inset-0 bg-radial from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse pointer-events-none" />
      
      {/* Technical coordinate grids */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1.2px, transparent 1.2px)", backgroundSize: "16px 16px" }} />
      
      {/* SOSS hologram metadata tags */}
      <div className="absolute top-3 left-3 font-mono text-[9px] text-ink-faint border border-line-soft/40 px-2 py-0.5 rounded-sm bg-paper-warm/60 backdrop-blur-sm shadow-sm select-none">
        SYS.MODEL: DITTO_CORE v99.1
      </div>
      <div className="absolute bottom-3 right-3 font-mono text-[9px] text-primary/80 border border-primary/20 px-2 py-0.5 rounded-sm bg-primary/5 backdrop-blur-sm select-none">
        {en ? "STATUS: ACTIVE COPY_POLYMORPH" : "設定：擬態複製激活狀態"}
      </div>

      <svg viewBox="0 0 200 200" className="w-[200px] h-[200px] overflow-visible relative z-10 transition-transform duration-500 hover:scale-105">
        {/* Soft shadow below Ditto */}
        <ellipse cx="100" cy="165" rx="55" ry="9" fill="rgba(21, 20, 15, 0.08)" />

        {/* --- DUAL TWINTAILS HAIR (rendered under the body layer) --- */}
        {hairColor !== "transparent" && hairColor === "#f472b6" && (
          <g className="transition-all duration-300">
            {/* Left pink ponytail */}
            <path d="M 45 70 Q 10 75, 20 125 Q 30 115, 48 95" fill={hairColor} stroke="#3a2512" strokeWidth="3" />
            {/* Right pink ponytail */}
            <path d="M 155 70 Q 190 75, 180 125 Q 170 115, 152 95" fill={hairColor} stroke="#3a2512" strokeWidth="3" />
          </g>
        )}

        {/* --- MAIN DITTO GELATINOUS BODY --- */}
        <path
          d="M 50 110 
             C 30 90, 25 55, 60 45 
             C 95 35, 105 35, 140 45 
             C 175 55, 170 90, 150 110 
             C 130 130, 154 154, 100 160 
             C 46 154, 70 130, 50 110 Z"
          fill={skinColor}
          stroke="#3a2512"
          strokeWidth="4"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />

        {/* --- SMILEY ENCHANTED FACE --- */}
        <circle cx="85" cy="95" r="3.2" fill="#3a2512" />
        <circle cx="115" cy="95" r="3.2" fill="#3a2512" />
        
        {/* Real-time responsive mouth shape depending on outfit */}
        {outfitId === "chef" ? (
          // Playful open mouth for cook
          <path d="M 95 104 C 95 112, 105 112, 105 104 Z" fill="#ef4444" stroke="#3a2512" strokeWidth="2.5" />
        ) : outfitId === "space" ? (
          // Safe closed straight line mouth for astronaut helmet
          <line x1="94" y1="104" x2="106" y2="104" stroke="#3a2512" strokeWidth="3" strokeLinecap="round" />
        ) : (
          // Classic happy Ditto curved mouth
          <path d="M 96 104 Q 100 107, 104 104" stroke="#3a2512" strokeWidth="3" strokeLinecap="round" fill="none" />
        )}

        {/* Blush spots */}
        <ellipse cx="76" cy="99" rx="4" ry="2" fill="rgba(239, 68, 68, 0.25)" />
        <ellipse cx="124" cy="99" rx="4" ry="2" fill="rgba(239, 68, 68, 0.25)" />

        {/* --- HAIR/HAT COVERS (rendered over the body layer) --- */}
        {/* Tangrowth vines green hair with some curls */}
        {hairColor !== "transparent" && hairColor === "#16a34a" && (
          <g className="transition-all duration-300">
            <path d="M 52 50 Q 80 18, 98 42 Q 112 18, 148 50" fill="none" stroke={hairColor} strokeWidth="6" strokeLinecap="round" />
            <path d="M 72 41 Q 100 11, 115 37" fill="none" stroke={hairColor} strokeWidth="6" strokeLinecap="round" />
            <path d="M 45 74 Q 30 70, 38 85" fill="none" stroke={hairColor} strokeWidth="5" strokeLinecap="round" />
            <path d="M 155 74 Q 170 70, 162 85" fill="none" stroke={hairColor} strokeWidth="5" strokeLinecap="round" />
          </g>
        )}

        {/* Chestnut fluffed hair for Chef Dente */}
        {hairColor !== "transparent" && hairColor === "#854d0e" && (
          <path d="M 65 47 Q 100 12, 108 28 Q 118 12, 135 47 Z" fill={hairColor} stroke="#3a2512" strokeWidth="2.5" className="transition-all duration-300" />
        )}

        {/* Peakychu sharp black-tipped ears */}
        {hairColor !== "transparent" && hairColor === "#eab308" && (
          <g className="transition-all duration-300">
            {/* Left ear */}
            <path d="M 53 52 L 32 14 L 66 41 Z" fill={hairColor} stroke="#3a2512" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M 32 14 L 41 27 L 46 22 Z" fill="#1e1b18" />
            {/* Right ear */}
            <path d="M 147 52 L 168 14 L 134 41 Z" fill={hairColor} stroke="#3a2512" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M 168 14 L 159 27 L 154 22 Z" fill="#1e1b18" />
          </g>
        )}

        {/* --- COSTUME APPAREL OVERLAYS --- */}
        {/* Explorer Protective Vest */}
        {outfitId === "explorer" && (
          <g className="transition-all duration-300">
            <path d="M 59 116 C 65 136, 135 136, 141 116 C 130 113, 115 116, 100 116 C 85 116, 70 113, 59 116 Z" fill="#b5a484" stroke="#3a2512" strokeWidth="3" />
            <path d="M 59 116 L 73 138 L 88 138 L 83 116 Z" fill="#8c7a5c" stroke="#3a2512" strokeWidth="3" />
            <path d="M 141 116 L 127 138 L 112 138 L 117 116 Z" fill="#8c7a5c" stroke="#3a2512" strokeWidth="3" />
            {/* Pocket stitches */}
            <rect x="67" y="121" width="11" height="11" rx="2" fill="#5c4f34" stroke="#3a2512" strokeWidth="2" />
          </g>
        )}

        {/* Chef Apron, Tall Hat & Necktie */}
        {outfitId === "chef" && (
          <g className="transition-all duration-300">
            {/* Elegant Chef neck scarf tie */}
            <path d="M 91 122 Q 100 142, 109 122 L 105 146 L 95 146 Z" fill="#dc2626" stroke="#3a2512" strokeWidth="2.5" />
            <circle cx="100" cy="122" r="5" fill="#991b1b" stroke="#3a2512" strokeWidth="2.5" />
            {/* White Tall Chef Hat with folding lines */}
            <path d="M 68 45 C 58 8, 142 8, 132 45 Z" fill="#ffffff" stroke="#3a2512" strokeWidth="3.5" />
            <rect x="76" y="38" width="48" height="11" rx="2" fill="#e2e8f0" stroke="#3a2512" strokeWidth="3" />
          </g>
        )}

        {/* Tinkmaster Fireproof Smithing Apron */}
        {outfitId === "smithy" && (
          <g className="transition-all duration-300">
            {/* Leather texture apron */}
            <path d="M 74 116 L 126 116 L 121 152 L 79 152 Z" fill="#78350f" stroke="#3a2512" strokeWidth="3" />
            {/* Neck cord strap */}
            <path d="M 74 116 Q 100 102, 126 116" fill="none" stroke="#2a1205" strokeWidth="3.2" />
            {/* Forge hammer emblem inside */}
            <line x1="91" y1="134" x2="109" y2="134" stroke="#fef3c7" strokeWidth="3" strokeLinecap="round" />
            <line x1="100" y1="127" x2="100" y2="142" stroke="#fef3c7" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {/* SOSS Computer Vault Space Suit */}
        {outfitId === "space" && (
          <g className="transition-all duration-300">
            {/* Reinforced heavy white space suit shoulders */}
            <path d="M 53 126 C 60 162, 140 162, 147 126 Z" fill="#f1f5f9" stroke="#3a2512" strokeWidth="3.2" />
            {/* Neon indicator control box */}
            <rect x="88" y="132" width="24" height="15" rx="2" fill="#334155" stroke="#3a2512" strokeWidth="2" />
            <circle cx="94" cy="139" r="2.5" fill="#10b981" />
            <circle cx="106" cy="139" r="2.5" fill="#f43f5e" />
            {/* SOSS Glass dome helmet */}
            <circle cx="100" cy="95" r="41" fill="rgba(56, 189, 248, 0.12)" stroke="#0284c7" strokeWidth="3.2" strokeDasharray="4 2" />
            {/* Dynamic helmet light stroke */}
            <path d="M 70 75 Q 100 64, 122 74" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.65" />
          </g>
        )}
      </svg>
    </div>
  );
}

export default function Characters() {
  const { i18n } = useTranslation();
  const [data, setData] = useState<CharactersData | null>(null);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  // Console Tabs definition
  const [activeTab, setActiveTab] = useState<"cards" | "ditto" | "reshaping" | "npc">("cards");

  // Ditto custom styling states
  const [dittoSkin, setDittoSkin] = useState("#df99f7");
  const [dittoHair, setDittoHair] = useState("transparent");
  const [dittoOutfit, setDittoOutfit] = useState("none");

  useEffect(() => {
    fetch("/data/characters.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const en = i18n.language === "en";
  const seoTitle = en ? "Story & Characters Console | Pokopia Chronicles" : "劇情角色控制台 | Pokopia 年代記";
  const seoDescription = en
    ? "Discover character relationships, customize Ditto's visual outfit preview, read Tangrowth's space saga, and navigate NPC coordinates."
    : "探索角色關係網、即時套用客製百變怪外型預覽、查閱巨蔓藤博士發射相片的溫作與重要城鎮 NPC 的分工位置指引。";

  const filteredCharacters = useMemo(() => {
    if (!data) return [];
    if (activeFilter === "All") return data.characters;
    return data.characters.filter((char) => char.roleEn === activeFilter);
  }, [activeFilter, data]);

  if (!data) {
    return (
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia characters", "Pokopia story", "Tinkmaster", "Chef Dente", "Professor Tangrowth"]}
      />
    );
  }

  const filters = ["All", ...new Set(data.characters.map((char) => char.roleEn))];
  const stageMap = new Map<string, Stage>(data.stages.map((stage) => [stage.id, stage]));

  // Customizer option palettes
  const skins = [
    { id: "purple", labelZh: "元祖粉紫", labelEn: "Classic Ditto Purple", value: "#df99f7" },
    { id: "glitch-blue", labelZh: "系統障礙藍", labelEn: "Glitch Marine Blue", value: "#38bdf8" },
    { id: "tangrowth-green", labelZh: "博士藤蔓綠", labelEn: "Tangrowth Moss Green", value: "#4ade80" },
    { id: "desert-sand", labelZh: "極端旱地黃", labelEn: "Wasteland Warm Sand", value: "#fcd34d" },
    { id: "iron-grey", labelZh: "高空鋼鐵灰", labelEn: "Skylands Heavy Grey", value: "#94a3b8" }
  ];

  const hairs = [
    { id: "classic", labelZh: "不戴髮型", labelEn: "Bare head shape", color: "transparent" },
    { id: "tangrowth", labelZh: "巨蔓藤捲髮", labelEn: "Professor Curled Green", color: "#16a34a" },
    { id: "dente", labelZh: "栗鼠蓬鬆髮", labelEn: "Chef Chestnut Brown", color: "#854d0e" },
    { id: "tinkmaster", labelZh: "巨鍛匠雙髻", labelEn: "Tink Twin-taily Pink", color: "#f472b6" },
    { id: "peakychu", labelZh: "失電皮卡角", labelEn: "Peakychu Thunder Spikes", color: "#eab308" }
  ];

  const outfits = [
    { id: "none", labelZh: "不穿衣服 (無擬態裝)", labelEn: "No Costume (Default Core form)" },
    { id: "explorer", labelZh: "開荒防護背心", labelEn: "Dry Wasteland Explorer Vest" },
    { id: "chef", labelZh: "Dente 專業烘焙廚帽", labelEn: "Chef Hat & Bow Tie" },
    { id: "smithy", labelZh: "耐熱鍛造重革圍裙", labelEn: "Tinkmaster Heavy Forge Apron" },
    { id: "space", labelZh: "SOSS 觀星防護太空衣", labelEn: "SOSS Vault Sealed Suit" }
  ];

  // Specific locations & Specialties Factbook
  const npcGuides = [
    {
      id: "chef-dente-guide",
      nameZh: "主廚 Dente (Chef Dente)",
      nameEn: "Chef Dente",
      speciesZh: "貪心栗鼠 (Greedent)",
      speciesEn: "Greedent",
      specialtyZh: "小麥烘焙學、能量漢堡排製造、輔助興建巨大建築 3F",
      specialtyEn: "Wheat Baking, Strength Burger Patty preparation, Escorted Architect for Huge Building 3F",
      regionZh: "岩石山脊 (Rocky Ridges) -> 閃耀空島 (Sparkling Skylands)",
      regionEn: "Rocky Ridges -> Sparkling Skylands",
      detailsZh: "最初受困於岩石山脊遺跡。玩家需在附近的麵包爐烤製「小麥麵包」並食用獲得強力，切斷鎖鍊救出他。隨後在聚落他會烤製「漢堡排」，百變怪使用後碎巖力量提升一階，可粉碎深色金屬礦脈。後期建設摩天大樓 3F 時，系統指定需要護送主廚 Dente 與發光石一同抵達空島工地，方能順利完成重建並解鎖進階型態。",
      detailsEn: "Trapped behind steel chains in Rocky Ridges ruins. Ditto must bake Wheat Bread to gain physical power and break his bonds. Once recruited, he prepares the powerhouse 'Burger Patty' which permanently upgrades Ditto's smash power to destroy steel node-deposits. Later, he must be manually escorted to the Sparkling Skylands skyscraper on 3F to execute complex assembly.",
    },
    {
      id: "tinkmaster-guide",
      nameZh: "巨鍛匠 (Tinkmaster)",
      nameEn: "Tinkmaster",
      speciesZh: "巨鍛匠 (Tinkaton)",
      speciesEn: "Tinkaton",
      specialtyZh: "高階機械鍛造、特殊齒輪訂製、升降懸掛平臺發行",
      specialtyEn: "High-grade alloy smithing, Specialized Gear casting, Traversing Lift Platform architecture",
      regionZh: "閃耀空島 (Sparkling Skylands)",
      regionEn: "Sparkling Skylands",
      detailsZh: "閃耀空島的核心工程師，擁有一柄以回收垃圾鍛造成的巨大鐵鎚。玩家可以用在各島嶼收集、精煉的鐵錠與混凝土跟牠交互以換取『特殊齒輪（Special Gears）』。這些齒輪是架設空中大型移動升降梯、連接被深淵切開的各處垃圾漂浮島必備的材料。牠同時也是逐層重建百米高摩天大樓的大功臣，代表島嶼機械的頂峰技術。",
      detailsEn: "The hardware anchor of Sparkling Skylands. Tinkmaster wields a massive custom scrap-hammer and exchanges raw refined Iron Plates and high-density Concrete for 'Special Gears'. These unique gears are the mandatory currency to forge automated Lift Platforms that cross wide rifts. Tinkmaster guides the mechanical layout up to the skyscraper's summit.",
    },
    {
      id: "peakychu-guide",
      nameZh: "Peakychu",
      nameEn: "Peakychu",
      speciesZh: "皮卡丘 (Pike-Pikachu)",
      speciesEn: "Pikachu",
      specialtyZh: "工班集結、精準配線佈局、摩天大樓終期 4F 施工指揮",
      specialtyEn: "Construction Crew rallying, Precision circuit routing, Skyscraper 4F engineering supervisor",
      regionZh: "荒涼海灘 (Bleak Beach) -> 閃耀空島 (Sparkling Skylands)",
      regionEn: "Bleak Beach -> Sparkling Skylands",
      detailsZh: "登場於荒涼海灘、失去發電能力的特殊失電皮卡丘。需要玩家為牠構築避難所與淋浴設施以獲取認同。當空島建設邁入終局（摩天大樓 4F）時，高空的大風與閃電干擾使大樓建設停滯，玩家必須特地返回海灘，將 Peakychu 邀請並護送加入空島工班，由牠在屋頂精準配合布線，完工後即可吸引傳說寶可夢「超夢」在屋頂著陸降臨！",
      detailsEn: "An iconic, electricityless Pikachu first encountered resting near water gates in Bleak Beach. Needs clean showers and localized recycling centers to build friendship. During late-game skyscraper 4F vertical construction, heavy altitude turbulence and solar signals stall progress; Ditto must travel back, invite Peakychu, and escort it to lead the final wiring, unlocking Mewtwo's landing.",
    },
    {
      id: "drifloon-guide",
      nameZh: "飄飄球 (Drifloon)",
      nameEn: "Drifloon",
      speciesZh: "飄飄球 (Drifloon)",
      speciesEn: "Drifloon",
      specialtyZh: "夢境島引渡、洋娃娃載具託管、城都聖獸路線通行",
      specialtyEn: "Dream Island passage, Doll exchange transport, Johto Legendary beasts gateway trigger",
      regionZh: "夢境群島 (Dream Islands) 的所有門戶",
      regionEn: "Dream Islands (All portals)",
      detailsZh: "主線通關後的空間關鍵。只要前往荒涼海灘的幽暗礁石碼頭與其對話，並繳納冒險中在精靈球內搜集的各式神奇寶可夢玩偶（Dolls），牠便會帶著百變怪躍遷進入隨機的「夢境群島」！在這裡，玩家可以採集到全地圖罕見的高階化石植物、冶煉高純度水晶，並可跟著指引開啟傳說中的雷公、炎帝、水君的隱藏捉捕挑戰！",
      detailsEn: "The gateway Ferryman active in Kanto's post-game. Interacting with Drifloon at Bleak Beach's dark reef dock and giving it customizable collectible Poke-Dolls triggers dimensional shift. This transitions the player into the rare procedurally-seeded 'Dream Islands' where unique plants spawn alongside Johto's legendary Raikou, Entei, and Suicune routes.",
    }
  ];

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia characters", "Ditto custom, Tangrowth computer", "Tinkmaster gear", "Chef Dente bread", "Peakychu", "Drifloon dream"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: seoTitle,
          description: seoDescription,
          url: "https://pokemoninfoperfer.vercel.app/characters",
          inLanguage: en ? "en" : "zh-Hant",
          about: "Pokopia story characters and plot roles",
        }}
      />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto px-1 sm:px-4 md:px-0">
        <motion.header variants={itemVariants} className="mb-gutter">
          <div className="flex flex-col gap-6 border-b border-line pb-md">
            <div>
              <span className="font-mono-metadata text-mono-metadata text-primary uppercase tracking-widest block mb-1">
                {en ? "CHRONICLES JOURNAL // CHARACTERS" : "冒險手記與人物誌"}
              </span>
              <h1 className="font-display-lg text-display-lg text-ink-soft mb-sm">
                {en ? "Characters & Story Routes" : "角色與劇情控制台"}
              </h1>
              <p className="font-body-italic text-body-italic text-ink-mute max-w-3xl">
                {en
                  ? "Track Kanto's restoration cast, customize Ditto's polymorphic skins, read world supercomputer rebuilding layouts, and check NPC coordinates."
                  : "記錄關都大地在後末日的重建征途！你可以自訂百變怪的衣著預覽、探尋巨蔓藤博士發射照片到外太空的世界重組感人結局，並查找主廚 Dente 及巨鍛匠的專長引路。"}
              </p>
            </div>

            {/* HIGH-END INTERACTIVE TAB NAVIGATOR */}
            <div className="flex flex-wrap gap-2 border-b border-line-soft pb-3">
              <button
                onClick={() => setActiveTab("cards")}
                className={`flex items-center gap-2 font-label-caps text-label-caps px-4 py-2.5 rounded-sm transition-all border shrink-0 ${
                  activeTab === "cards"
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-surface border-line-soft text-ink-mute hover:text-primary hover:bg-paper-warm"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                {en ? "Characters & Network" : "登場人物與關係圖"}
              </button>

              <button
                onClick={() => setActiveTab("ditto")}
                className={`flex items-center gap-2 font-label-caps text-label-caps px-4 py-2.5 rounded-sm transition-all border shrink-0 ${
                  activeTab === "ditto"
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-surface border-line-soft text-ink-mute hover:text-primary hover:bg-paper-warm"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {en ? "Ditto Customizer" : "百變怪自訂擬態系統"}
              </button>

              <button
                onClick={() => setActiveTab("reshaping")}
                className={`flex items-center gap-2 font-label-caps text-label-caps px-4 py-2.5 rounded-sm transition-all border shrink-0 ${
                  activeTab === "reshaping"
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-surface border-line-soft text-ink-mute hover:text-primary hover:bg-paper-warm"
                }`}
              >
                <Cpu className="w-4 h-4" />
                {en ? "World Reshaping Plan" : "生態世界重塑計劃"}
              </button>

              <button
                onClick={() => setActiveTab("npc")}
                className={`flex items-center gap-2 font-label-caps text-label-caps px-4 py-2.5 rounded-sm transition-all border shrink-0 ${
                  activeTab === "npc"
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-surface border-line-soft text-ink-mute hover:text-primary hover:bg-paper-warm"
                }`}
              >
                <MapPin className="w-4 h-4" />
                {en ? "Town NPC Guides" : "關鍵城鎮 NPC 引路"}
              </button>
            </div>
          </div>
        </motion.header>

        {/* -------------------- TAB CONTENT: CARDS & RELATION NETWORK -------------------- */}
        {activeTab === "cards" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-8">
            <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-5 gap-sm mb-gutter">
              {data.stages.map((stage, idx) => (
                <ScrollFade key={stage.id} depth="fg" delay={idx * 0.04} className="h-full">
                  <article className="bg-[#fcfaf2]/60 border border-line-soft border-x-0 sm:border-x rounded-none sm:rounded-sm -mx-4 sm:mx-0 px-4 py-3 paper-texture ambient-shadow h-full flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-primary uppercase tracking-widest block mb-1">
                        STAGE 0{idx + 1}
                      </span>
                      <h4 className="font-label-caps text-sm text-ink-soft font-bold mb-1 border-b border-line-soft pb-1">
                        {en ? stage.labelEn : stage.labelZh}
                      </h4>
                      <p className="text-[12px] text-ink-mute leading-relaxed">
                        {en ? stage.summaryEn : stage.summaryZh}
                      </p>
                    </div>
                  </article>
                </ScrollFade>
              ))}
            </motion.section>

            {/* Original characters search / filter toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bone border border-line-soft border-x-0 sm:border-x rounded-none sm:rounded-sm -mx-4 sm:mx-0 px-4 py-3">
              <div className="font-mono text-xs text-ink-soft uppercase tracking-widest">
                {en ? "DATABASE CLASSIFICATION FILTERS:" : "機密人物分群篩選："}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filters.map((filter) => {
                  const label = en
                    ? filter
                    : filter === "All"
                      ? "顯示全部"
                      : filter === "Protagonist"
                        ? "主角主角"
                        : filter === "Mentor"
                          ? "任務導師"
                          : "故事NPC";
                  return (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`font-mono text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-sm transition-all border ${
                        activeFilter === filter
                          ? "bg-primary text-on-primary border-primary shadow-sm"
                          : "bg-surface border-line-soft text-ink-mute hover:text-primary"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
              {filteredCharacters.map((char, idx) => {
                const primaryStage = stageMap.get(char.primaryStage);
                return (
                  <ScrollFade key={char.id} depth="none" delay={(idx % 3) * 0.04} className="h-full">
                    <motion.article
                      variants={itemVariants}
                      whileHover={{ scale: 1.015, y: -2 }}
                      className="bg-bone border border-line-soft border-x-0 sm:border-x rounded-none sm:rounded-sm -mx-4 sm:mx-0 p-4 sm:p-sm flex flex-col relative ambient-shadow paper-texture cursor-pointer h-full hover:border-primary/40 transition-all"
                      onClick={() => setSelectedChar(char)}
                    >
                      <div className="flex items-start justify-between gap-3 mb-sm">
                        <div className="min-w-0">
                          <span className="font-mono text-[10.5px] text-primary uppercase tracking-wider block mb-0.5">
                            {en ? char.aliasEn : char.aliasZh}
                          </span>
                          <span className="font-label-caps text-[10px] text-ink-mute uppercase bg-paper-warm px-2 py-0.5 rounded-sm border border-line-soft">
                            {en ? char.roleEn : char.roleZh}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-ink-mute bg-[#f5efe2] border border-line-soft px-2 py-0.5 rounded-xs shrink-0 font-bold">
                          {primaryStage ? (en ? primaryStage.labelEn : primaryStage.labelZh) : "—"}
                        </span>
                      </div>

                      <div className="w-24 h-24 mx-auto mb-sm bg-surface-container-high rounded-full border-2 border-line-soft bg-paper-warm/80 overflow-hidden flex items-center justify-center p-2 relative">
                        <div className="absolute inset-0 bg-radial from-primary/5 to-transparent pointer-events-none" />
                        <img
                          src={char.image}
                          alt={char.nameEn}
                          className="object-contain max-w-full max-h-full mix-blend-multiply opacity-90 transition-transform duration-500 hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex flex-col gap-2 flex-grow">
                        <div className="text-center md:text-left">
                          <h2 className="font-headline-sm text-lg text-ink-soft m-0 font-bold">{en ? char.nameEn : char.nameZh}</h2>
                          <p className="font-mono text-[11px] text-ink-mute mb-2 mt-0.5">
                            📍 {en ? char.regionEn : char.regionZh}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className="font-mono text-[10px] text-ink-soft bg-surface-variant px-2 py-0.5 rounded-xs border border-line-soft">
                            {en ? char.specialtyEn : char.specialtyZh}
                          </span>
                          {char.signatureSkillsEn.slice(0, 1).map((skill, index) => (
                            <span
                              key={skill}
                              className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-xs border border-primary/20"
                            >
                              {en ? skill : char.signatureSkillsZh[index]}
                            </span>
                          ))}
                        </div>

                        <p className="text-[13px] text-ink-soft leading-relaxed line-clamp-4">
                          {en ? char.summaryEn : char.summaryZh}
                        </p>

                        <div className="mt-auto pt-2 border-t border-dashed border-line-soft flex items-center justify-between text-[10.5px]">
                          <span className="text-ink-faint font-semibold">
                            {en ? "Story Route Links:" : "故事地點:"}
                          </span>
                          <span className="text-ink-mute line-clamp-1">
                            {(en ? char.relatedLocationsEn : char.relatedLocationsZh).slice(0, 2).join(" · ")}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  </ScrollFade>
                );
              })}
            </div>

            <CharacterNetwork
              characters={data.characters}
              relationships={data.relationships}
              relationshipTypes={data.relationshipTypes}
              onNodeClick={setSelectedChar}
            />
          </motion.div>
        )}

        {/* -------------------- TAB CONTENT: DITTO CUSTOMIZER PLAYGROUND -------------------- */}
        {activeTab === "ditto" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter bg-bone border border-line-soft border-x-0 sm:border-x rounded-none sm:rounded-lg -mx-4 sm:mx-0 p-6 sm:p-lg shadow-sm">
            
            {/* Visual customization panel: LEFT SIDE */}
            <div className="lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-line-soft pb-6 lg:pb-0 lg:pr-gutter">
              <div className="space-y-4">
                <span className="font-mono text-xs text-primary bg-primary/10 border border-primary/30 px-3 py-1 rounded-sm uppercase tracking-widest inline-flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  SOSS PROFILE: DITTO_CORE
                </span>
                
                <h3 className="font-display-lg text-2xl text-ink-soft m-0 font-bold">
                  {en ? "Ditto Mimicry System" : "百變怪擬態裝扮預覽"}
                </h3>
                
                <div className="text-[13px] text-ink-soft leading-relaxed space-y-3">
                  <p>
                    {en 
                      ? "As Kanto's sole mimicry survivor, Ditto wakes and copies characters naturally. Customize its structural DNA signature below to test real-time styling parameters."
                      : "做為後末日關都大地上唯一的百變怪倖存者，玩家具備與生俱來的複製與擬態天賦。在系統控制台中設定自訂膚色、髮色與工作服裝，以驗證牠模擬各 NPC 夥伴的最佳形貌！"}
                  </p>
                  
                  {/* Factual Narrative Card Section */}
                  <div className="bg-[#f0ece1] border border-line-soft p-4 rounded-sm italic border-l-4 border-primary">
                    <span className="font-mono text-[9px] text-primary font-bold block mb-1 uppercase tracking-wider">
                      {en ? "DITTO NARRATIVE FACT" : "百變怪專屬敘事卡片"}
                    </span>
                    {en 
                      ? "Unlike standard trainers, Ditto cannot level-up or evolve in Pokopia. Instead, it completes tasks, bakes bread with Dente, collects alloy gears for Tinkmaster, and mimics essential skills directly from rescued wild Pokémon."
                      : "與傳統寶可夢系列不同，本作中百變怪完全擺脫了「經驗值與進化」機制，改為「觀察並學習」的生態模型。牠利用變身天能與 NPC（如主廚 Dente、巨鍛匠 Tinkmaster）開創工匠同盟，是全關都大地上最忙碌的土木工程奇才！"}
                  </div>
                </div>
              </div>

              {/* Reset Styling button */}
              <button
                onClick={() => {
                  setDittoSkin("#df99f7");
                  setDittoHair("transparent");
                  setDittoOutfit("none");
                }}
                className="mt-6 flex items-center justify-center gap-2 border border-line-soft hover:border-primary text-ink-soft hover:text-primary font-mono text-[11px] uppercase tracking-wider py-2.5 rounded-sm bg-surface transition-all cursor-pointer"
              >
                <Undo className="w-3.5 h-3.5" />
                {en ? "Revert to Default Ditto" : "還原為元祖百變怪外型"}
              </button>
            </div>

            {/* Simulated Live SVG preview: MIDDLE COL */}
            <div className="lg:col-span-4 flex flex-col justify-center py-4 lg:py-0">
              <InteractiveDittoPreview 
                skinColor={dittoSkin} 
                hairColor={dittoHair} 
                outfitId={dittoOutfit} 
                en={en} 
              />
            </div>

            {/* Control Interface knobs: RIGHT SIDE */}
            <div className="lg:col-span-4 flex flex-col justify-between lg:pl-gutter space-y-6">
              
              {/* Knot 1: Skin selection */}
              <div>
                <label className="font-mono text-[11.5px] text-ink-soft uppercase tracking-wider block mb-2 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {en ? "1. Select Skin Membrane" : "第一步：選擇主體膚色"}
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {skins.map((skin) => (
                    <button
                      key={skin.id}
                      onClick={() => setDittoSkin(skin.value)}
                      className={`flex items-center justify-between text-left px-3 py-1.5 rounded-sm text-[11.5px] border transition-all cursor-pointer ${
                        dittoSkin === skin.value
                          ? "bg-primary/5 border-primary text-primary font-semibold"
                          : "bg-surface border-line-soft hover:border-primary text-ink-soft"
                      }`}
                    >
                      <span>{en ? skin.labelEn : skin.labelZh}</span>
                      <span className="w-4 h-4 rounded-xs border border-line-soft" style={{ backgroundColor: skin.value }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Knot 2: Hair selection */}
              <div>
                <label className="font-mono text-[11.5px] text-ink-soft uppercase tracking-wider block mb-2 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {en ? "2. Select Mimic Hair / Cap" : "第二步：自訂模仿髮色與飾片"}
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {hairs.map((hair) => (
                    <button
                      key={hair.id}
                      onClick={() => setDittoHair(hair.color)}
                      className={`flex items-center justify-between text-left px-3 py-1.5 rounded-sm text-[11.5px] border transition-all cursor-pointer ${
                        dittoHair === hair.color
                          ? "bg-primary/5 border-primary text-primary font-semibold"
                          : "bg-surface border-line-soft hover:border-primary text-ink-soft"
                      }`}
                    >
                      <span>{en ? hair.labelEn : hair.labelZh}</span>
                      <span className="w-4 h-[3px] rounded-full" style={{ backgroundColor: hair.color === "transparent" ? "#94a3b8" : hair.color }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Knot 3: Apparel selection */}
              <div>
                <label className="font-mono text-[11.5px] text-ink-soft uppercase tracking-wider block mb-2 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {en ? "3. Apply Active Work Costume" : "第三步：穿配專屬工作裝備"}
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {outfits.map((out) => (
                    <button
                      key={out.id}
                      onClick={() => setDittoOutfit(out.id)}
                      className={`flex items-center justify-between text-left px-3 py-1.5 rounded-sm text-[11.5px] border transition-all cursor-pointer ${
                        dittoOutfit === out.id
                          ? "bg-primary/5 border-primary text-primary font-semibold"
                          : "bg-surface border-line-soft hover:border-primary text-ink-soft"
                      }`}
                    >
                      <span>{en ? out.labelEn : out.labelZh}</span>
                      <span className="text-[10px] text-ink-mute font-mono">
                        {dittoOutfit === out.id ? "ACTIVE" : ""}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* -------------------- TAB CONTENT: WORLD RESHAPING PLAN -------------------- */}
        {activeTab === "reshaping" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-8">
            <div className="bg-bone border border-line-soft border-x-0 sm:border-x rounded-none sm:rounded-lg -mx-4 sm:mx-0 p-6 sm:p-lg relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-radial from-primary/5 to-transparent pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row gap-8 items-stretch relative z-10">
                <div className="lg:w-1/3 flex flex-col justify-center items-center text-center p-md border-b lg:border-b-0 lg:border-r border-line-soft bg-paper-warm/50 rounded-sm">
                  <div className="w-28 h-28 shrink-0 rounded-full bg-primary/10 border-4 border-primary/30 flex items-center justify-center text-primary mb-4">
                    <span className="material-symbols-outlined text-[56px] text-primary">computer</span>
                  </div>
                  <span className="font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-sm uppercase tracking-wider mb-2 font-bold">
                    SOSS CORE ARCHIVE
                  </span>
                  <h3 className="font-display-lg text-lg text-ink-soft m-0 font-bold">
                    {en ? "Professor Tangrowth's Plan" : "巨蔓藤博士 SOSS 科研計劃"}
                  </h3>
                  <p className="font-mono text-[11px] text-ink-mute mt-1 leading-snug">
                    {en ? "System backup: EARTH_RESTORATION v2.6" : "備份機密檔案：大區乾地與工業自維重組"}
                  </p>
                </div>

                <div className="lg:w-2/3 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="font-mono text-[10px] text-ink-faint uppercase tracking-widest block">
                      {en ? "CENTRAL NARRATIVE DOSSIER" : "核心劇情事件簿 (無捏造之事實數據)"}
                    </span>
                    <h2 className="font-display-md text-2xl text-ink-soft font-bold tracking-tight">
                      {en ? "The Sleeping Supercomputer & The Glitch Hero" : "超級電腦生態承載 與 一張飛向星空的「珍愛照片」"}
                    </h2>
                    
                    <div className="text-[13.5px] text-ink-soft leading-relaxed space-y-4">
                      <p>
                        {en 
                          ? "Faced with terminal climate decay, mankind built a high-performance planetary mainframe to store Kanto's 300 Pokémon species in safe database blocks before evacuating to deep space. While sleeping, a system glitch materializes our copy-nature heroine Ditto into a physical humanoid form. Together with Professor Tangrowth, they launch Kanto's restoration."
                          : "故事開端敘述大自然急劇乾旱與重工業垃圾汙染，致使全人類必須移民外太空，將 300 種寶可夢儲存於一個持續自維運行的行星超級電腦中。直到一次未知的故障，使得百變怪意外被系統實體化喚醒，並在超級電腦的科研大腦「巨蔓藤博士」指引下，展開了拯救計畫。"}
                      </p>

                      <p className="italic bg-[#f5efe2] p-4 border-l-4 border-primary rounded-sm font-body-italic">
                        {en
                          ? "“A world repaired by scrap-metal, concrete mixing, and wind turbines. In the end, the system logs close with popcorn, firecrackers, and a single photo launched to outer space.”"
                          : "「當枯枯荒野下起雨，當海灘電網再度點亮，當漂浮空島的百米摩天大樓在鐵錠與混凝土澆灌下完工——博士與百變怪在高塔吹響象徵慶典的拉炮，將裝載著全體拓荒夥伴合照的『珍愛照片』，歡呼著送往太空船所在的浩瀚星野，最終穿越太空被太空船上的原訓練家尋回，完成人與寶可夢星際重逢的感人終局。」"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-line-soft pt-4 mt-6 flex justify-between items-center text-[11px] text-ink-mute font-mono">
                    <span>{en ? "DEVELOPED BY GF × OMEGA FORCE" : "開發出品：Game Freak 與 Omega Force (KOEI)"}</span>
                    <span>{en ? "ENDING MOVIE #010" : "感人過場動畫 ID: END010"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphic Timeline of World Reshaping Steps */}
            <section className="bg-bone border border-line-soft border-x-0 sm:border-x rounded-none sm:rounded-lg -mx-4 sm:mx-0 p-6 sm:p-lg shadow-sm">
              <h3 className="font-label-caps text-label-caps text-ink-soft mb-6 border-b border-line-soft pb-2">
                {en ? "Chronology of Restoration Operations" : "重塑生態系統與世界重建之核心節點"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                
                <article className="bg-[#fcfaf2]/60 border border-line-soft border-x-0 sm:border-x rounded-none sm:rounded-sm -mx-4 sm:mx-0 p-4 relative">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono text-xs font-bold mb-3">
                    01
                  </div>
                  <h4 className="font-headline-sm text-sm font-bold text-ink-soft mb-1">
                    {en ? "Core Material Recycle" : "超級電腦自維喚醒"}
                  </h4>
                  <p className="text-[12px] text-ink-mute leading-relaxed">
                    {en 
                      ? "Ditto awakens, registers the human visual frame, and uses recycled scraps to repair the local home console."
                      : "百變怪甦醒，在沒落的關都接受巨蔓藤博士的指示，透過「觀察與變身」拾起原訓練家的圖鑑，進行物資回收。"}
                  </p>
                </article>

                <article className="bg-[#fcfaf2]/60 border border-line-soft border-x-0 sm:border-x rounded-none sm:rounded-sm -mx-4 sm:mx-0 p-4 relative">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono text-xs font-bold mb-3">
                    02
                  </div>
                  <h4 className="font-headline-sm text-sm font-bold text-ink-soft mb-1">
                    {en ? "Tactical Grid Linking" : "荒野灌溉與海灘電電網"}
                  </h4>
                  <p className="text-[12px] text-ink-mute leading-relaxed">
                    {en 
                      ? "Linking windmills and water wheels to lighthouse charging stations across Bleak Beach to revive local power grids."
                      : "利用傑尼龜水槍滋潤旱地。在海灘修復風車、水車，拉起「電線桿系統」將電網連線，並喚醒苔樹卡比獸 Mosslax。"}
                  </p>
                </article>

                <article className="bg-[#fcfaf2]/60 border border-line-soft border-x-0 sm:border-x rounded-none sm:rounded-sm -mx-4 sm:mx-0 p-4 relative">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono text-xs font-bold mb-3">
                    03
                  </div>
                  <h4 className="font-headline-sm text-sm font-bold text-ink-soft mb-1">
                    {en ? "The Skyscraper Project" : "空島百米摩天樓工程"}
                  </h4>
                  <p className="text-[12px] text-ink-mute leading-relaxed">
                    {en 
                      ? "Smithing special lock-gears with Tinkmaster and pouring Concrete blocks layer by layer in real-time."
                      : "與巨鍛匠合作製作特殊齒輪，運送發光石護送主廚 Dente 與 Peakychu 入工班，逐層建造巨大摩天大樓迎來超夢。"}
                  </p>
                </article>

                <article className="bg-[#fcfaf2]/60 border border-line-soft border-x-0 sm:border-x rounded-none sm:rounded-sm -mx-4 sm:mx-0 p-4 relative">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono text-xs font-bold mb-3">
                    04
                  </div>
                  <h4 className="font-headline-sm text-sm font-bold text-ink-soft mb-1">
                    {en ? "The Infinite Space Ship" : "發射珍愛照片重逢"}
                  </h4>
                  <p className="text-[12px] text-ink-mute leading-relaxed">
                    {en 
                      ? "Paying all 8 Tower medals, celebrating with pops and launching the Precious Photo to find the lost Master."
                      : "在挑戰高塔通關中繳齊八大徽章、拉響拉炮，將裝載大夥溫暖合照的照片送入星空，令原本的訓練家尋獲並感動重聚。"}
                  </p>
                </article>

              </div>
            </section>
          </motion.div>
        )}

        {/* -------------------- TAB CONTENT: NPC GUIDES -------------------- */}
        {activeTab === "npc" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
            
            <div className="bg-bone border border-line-soft border-x-0 sm:border-x rounded-none sm:rounded-lg -mx-4 sm:mx-0 p-4 sm:p-sm shadow-sm md:p-6 mb-2">
              <span className="font-mono text-[10px] text-primary uppercase tracking-widest block mb-2">
                RECON METADATA STATS // NPC REGISTRY
              </span>
              <h2 className="font-display-lg text-xl text-ink-soft m-0 font-bold flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" />
                {en ? "Kanto Restoration Crew Specialist Directories" : "重要合作 NPC 專長、位置與指引攻略庫"}
              </h2>
              <p className="text-body-base text-ink-mute text-sm mt-1 max-w-4xl">
                {en 
                  ? "Rebuilding Kanto is an advanced engineering task. Each major story NPC has a regional location and holds the upgrade key to crucial sandbox mechanics. Use the index below to map their path."
                  : "後末世關都重建不是閉門造車——你必須與具備特定本事的具名 NPC 合作。掌握他們所屬的區域及專門技巧，能讓你迅速突破物理地表路障開創精煉工業鏈："}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {npcGuides.map((guide) => (
                <ScrollFade key={guide.id} depth="fg" className="h-full">
                  <article className="bg-[#fcfaf2]/90 border border-line-soft border-x-0 sm:border-x hover:border-primary/40 rounded-none sm:rounded-sm -mx-4 sm:mx-0 p-4 sm:p-sm paper-texture shadow-sm flex flex-col justify-between h-full transition-all">
                    
                    <div className="mb-4">
                      {/* Subtitle tag card */}
                      <div className="flex justify-between items-center mb-sm border-b border-line-soft pb-2">
                        <span className="font-mono text-[10.5px] text-primary uppercase tracking-wider font-bold">
                          {guide.id === "chef-dente-guide" ? "COFFEE & BAKING" : guide.id === "tinkmaster-guide" ? "HEAVY METAL FORGING" : guide.id === "peakychu-guide" ? "ELECTRICAL NETWORK" : "SPACE FERRYING"}
                        </span>
                        <span className="font-mono text-[9px] bg-paper px-2 py-0.5 rounded-sm border border-line-soft text-ink-mute">
                          {en ? guide.speciesEn : guide.speciesZh}
                        </span>
                      </div>

                      {/* Title block */}
                      <div className="flex items-start gap-3 mt-2">
                        <div className="w-12 h-12 rounded-full border-2 border-line-soft bg-paper-warm flex items-center justify-center text-primary shrink-0">
                          {guide.id === "chef-dente-guide" ? (
                            <ChefHat className="w-6 h-6" />
                          ) : guide.id === "tinkmaster-guide" ? (
                            <Wrench className="w-6 h-6" />
                          ) : guide.id === "peakychu-guide" ? (
                            <Cpu className="w-6 h-6" />
                          ) : (
                            <Compass className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-headline-sm text-base text-ink-soft font-bold m-0 leading-snug">
                            {en ? guide.nameEn : guide.nameZh}
                          </h3>
                          <p className="font-mono text-[10px] text-ink-mute m-0 mt-1 uppercase tracking-wider">
                            🗺️ {en ? guide.regionEn : guide.regionZh}
                          </p>
                        </div>
                      </div>

                      {/* Specialty field */}
                      <div className="mt-4 p-2 bg-paper-warm/60 border border-line-soft/60 rounded-xs text-[11.5px] text-ink-soft">
                        <strong className="text-primary font-mono block uppercase text-[9.5px] tracking-wide mb-0.5">
                          {en ? "SPECIALTY SKILL" : "NPC 獨門專長"}
                        </strong>
                        {en ? guide.specialtyEn : guide.specialtyZh}
                      </div>

                      {/* Fact Body text */}
                      <p className="text-[12.5px] text-ink-soft leading-relaxed mt-3 whitespace-pre-line border-l-2 border-primary/20 pl-3">
                        {en ? guide.detailsEn : guide.detailsZh}
                      </p>
                    </div>

                    {/* SOSS location pin tag */}
                    <div className="pt-2 border-t border-dashed border-line-soft flex items-center justify-between font-mono text-[10px] text-ink-faint uppercase select-none">
                      <span>LOCATION GRID PIN:</span>
                      <strong className="text-primary">
                        {guide.id === "chef-dente-guide" ? "ROCKY_RIDGES_H3" : guide.id === "tinkmaster-guide" ? "SKYLANDS_FL7" : guide.id === "peakychu-guide" ? "BEACH_SHOWER_B4" : "DREAM_REACTIVE_O1"}
                      </strong>
                    </div>

                  </article>
                </ScrollFade>
              ))}
            </div>
            
          </motion.div>
        )}

        {/* Selected character overview modal popup */}
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
                className="bg-bone border border-line rounded-lg ambient-shadow w-[95vw] sm:w-[92vw] md:max-w-4xl max-h-[90vh] overflow-y-auto relative paper-texture mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedChar(null)}
                  className="absolute top-sm right-sm z-10 text-ink-mute hover:text-primary transition-colors bg-paper/80 backdrop-blur-md rounded-full p-1 border border-line-soft"
                  aria-label={en ? "Close" : "關閉"}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] border-b border-line-soft">
                  <div className="bg-surface-container-high border-b lg:border-b-0 lg:border-r border-line-soft flex flex-col items-center justify-center p-lg relative bg-paper-warm/40">
                    <img 
                      src={selectedChar.image} 
                      alt={selectedChar.nameEn} 
                      className="object-contain max-h-24 max-w-[140px] mx-auto mb-4 mix-blend-multiply" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-center">
                      <span className="font-mono text-[10.5px] text-primary uppercase block mb-1">
                        {en ? selectedChar.aliasEn : selectedChar.aliasZh}
                      </span>
                      <span className="font-mono text-[9px] text-ink-mute border border-line-soft px-3 py-1 rounded-sm uppercase tracking-wider bg-paper">
                        {en ? selectedChar.roleEn : selectedChar.roleZh}
                      </span>
                    </div>
                  </div>

                  <div className="p-lg">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-md">
                      <div>
                        <h2 className="font-display-md text-2xl text-ink-soft leading-tight font-bold">
                          {en ? selectedChar.nameEn : selectedChar.nameZh}
                        </h2>
                        <p className="font-mono text-xs text-ink-mute mt-1">
                          📍 {en ? selectedChar.regionEn : selectedChar.regionZh}
                        </p>
                      </div>
                      <span className="font-mono text-[11px] text-ink-soft bg-surface-variant border border-line-soft px-3 py-1 rounded-sm shrink-0">
                        {en ? selectedChar.specialtyEn : selectedChar.specialtyZh}
                      </span>
                    </div>

                    <p className="text-[13.5px] text-ink-soft leading-relaxed mb-lg whitespace-pre-line border-l-2 border-primary/20 pl-4 bg-paper-warm/20 p-3 rounded-sm">
                      {en ? selectedChar.detailsEn : selectedChar.detailsZh}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      <section className="bg-paper-warm/40 border border-line-soft rounded-sm p-4">
                        <h3 className="font-mono text-[10px] text-ink-mute uppercase tracking-widest mb-3 font-bold border-b border-line-soft pb-1">
                          {en ? "Core Story Milestones" : "關鍵主線對話"}
                        </h3>
                        <ul className="space-y-2 text-[12.5px] text-ink-soft leading-relaxed">
                          {(en ? selectedChar.storyBeatsEn : selectedChar.storyBeatsZh).map((beat, bIdx) => (
                            <li key={bIdx} className="flex gap-2">
                              <span className="text-primary font-bold">»</span>
                              <span>{beat}</span>
                            </li>
                          ))}
                        </ul>
                      </section>

                      <section className="bg-paper-warm/40 border border-line-soft rounded-sm p-4">
                        <h3 className="font-mono text-[10px] text-ink-mute uppercase tracking-widest mb-3 font-bold border-b border-line-soft pb-1">
                          {en ? "Factual Capabilities" : "招牌能力配備"}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {(en ? selectedChar.signatureSkillsEn : selectedChar.signatureSkillsZh).map((skill) => (
                            <span
                              key={skill}
                              className="font-mono text-[9px] text-ink-soft bg-surface-container-high border border-line-soft px-2 py-0.5 rounded-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <h4 className="font-mono text-[10px] text-ink-mute uppercase mb-1 font-bold">
                          {en ? "Linked Landmarks" : "關聯拓荒地點"}
                        </h4>
                        <p className="text-[12px] text-ink-soft leading-relaxed">
                          {(en ? selectedChar.relatedLocationsEn : selectedChar.relatedLocationsZh).join(" · ")}
                        </p>
                      </section>
                    </div>
                  </div>
                </div>

                <div className="p-lg bg-surface-dim border-b border-line-soft bg-paper-warm/20">
                  <h3 className="font-mono text-[10px] text-ink-mute uppercase mb-3 font-bold">
                    {en ? "Story Timeline Linkage" : "劇情解鎖時間軸"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {data.stages.map((stage) => {
                      const isActive = selectedChar.stageIds.includes(stage.id);
                      return (
                        <article
                          key={stage.id}
                          className={`rounded-sm border p-3 transition-colors ${
                            isActive
                              ? "bg-primary/5 border-primary/40 shadow-xs"
                              : "bg-bone/40 border-line-soft opacity-60"
                          }`}
                        >
                          <span className={`font-mono text-[9px] uppercase block mb-1 font-bold ${isActive ? "text-primary" : "text-ink-mute"}`}>
                            {en ? stage.labelEn : stage.labelZh}
                          </span>
                          <p className="text-[11.5px] leading-relaxed text-ink-soft line-clamp-2">
                            {en ? stage.summaryEn : stage.summaryZh}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                </div>

                <div className="p-lg flex justify-between items-center text-[10.5px] text-ink-faint font-mono border-t border-line-soft">
                  <span>
                    {en ? "WIKIPEDIA CODENAME REF:" : "機密編號:"} DITTO_CORE-{selectedChar.id}
                  </span>
                  <span>
                    SOSS // {new Date().toISOString().split("T")[0]}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
