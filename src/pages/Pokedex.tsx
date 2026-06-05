import { useEffect, useMemo, useState, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Seo from "../components/Seo";
import ScrollFade from "../components/ScrollFade";
import ItemsTab from "./Items";
import BuildingsTab from "./Buildings";
import { useFavorites } from "../hooks/useFavorites";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

const PAGE_SIZE = 12;

const getPokemonStats = (pkmn: any) => {
  const idNum = parseInt(pkmn.id || "1", 10) || 1;
  const seed = (idNum * 9301 + 49297) % 233280;
  const pseudoRand = (min: number, max: number, offset: number) => {
    return min + Math.floor(((seed * (offset + 1)) % 100) / 100 * (max - min));
  };
  
  let hp = pseudoRand(50, 95, 1);
  let atk = pseudoRand(45, 105, 2);
  let def = pseudoRand(45, 95, 3);
  let spd = pseudoRand(50, 100, 4);
  let work = pseudoRand(40, 110, 5);
  
  const role = (pkmn.roleEn || "").toLowerCase();
  const spec = (pkmn.specialtyEn || "").toLowerCase();
  const rarity = pkmn.rarity || "C";
  
  if (role.includes("partner")) {
    hp += 15;
    work += 20;
  } else if (role.includes("legendary") || rarity === "V") {
    hp += 35;
    atk += 40;
    def += 30;
    spd += 25;
  } else if (role.includes("support")) {
    def += 15;
    hp += 10;
  }
  
  if (spec.includes("farming") || spec.includes("watering") || spec.includes("mining")) {
    work += 30;
  } else if (spec.includes("gathering") || spec.includes("lumbering")) {
    spd += 15;
    work += 15;
  } else if (spec.includes("handiwork") || spec.includes("producing")) {
    work += 35;
  }

  return {
    hp: Math.min(150, hp),
    atk: Math.min(150, atk),
    def: Math.min(150, def),
    spd: Math.min(150, spd),
    work: Math.min(150, work),
  };
};

const COMFORT_FAVS = [
  {
    val: "lots of nature",
    en: "Lots of nature",
    zh: "豐富的自然環境",
    icon: "forest",
  },
  {
    val: "lots of water",
    en: "Lots of water",
    zh: "充沛的水源",
    icon: "waves",
  },
  { val: "nice breezes", en: "Nice breezes", zh: "舒適的微風", icon: "air" },
  {
    val: "stone stuff",
    en: "Stone stuff",
    zh: "石材與岩石",
    icon: "landscape",
  },
  {
    val: "pretty flowers",
    en: "Pretty flowers",
    zh: "美麗的花朵",
    icon: "local_florist",
  },
  { val: "sweet flavors", en: "Sweet flavors", zh: "甜味", icon: "cake" },
];

type PokedexSkill = {
  categoryEn: string;
  categoryZh: string;
  nameEn: string;
  nameZh: string;
  detailEn: string;
  detailZh: string;
};

const getEvolutionFormula = (pkmn: any) => {
  if (!pkmn) return null;
  const nameEn = pkmn.nameEn ? pkmn.nameEn.toLowerCase() : "";
  const nameZh = pkmn.nameZh ? pkmn.nameZh : "";

  // Bulbasaur, Charmander, Squirtle base forms
  if (
    nameEn.includes("bulbasaur") ||
    nameZh.includes("妙蛙種子") ||
    nameEn.includes("charmander") ||
    nameZh.includes("小火龍") ||
    nameEn.includes("squirtle") ||
    nameZh.includes("傑尼龜")
  ) {
    return {
      friendship: "LV.1 (Base)",
      furnitureEn: "Standard Nesting Bed",
      furnitureZh: "新手標準睡墊",
      recipeEn: "Sweet Sunshine Nectar",
      recipeZh: "鮮甜陽光花蜜",
      descEn:
        "Summoned naturally by starting biome generators in Empty Town without any complex evolution processes.",
      descZh:
        "初始即可獲得的基礎生物。在空空鎮起步棲息地會自動生成招募，無須任何複雜的反進化配方。",
    };
  }

  // Ivysaur
  if (nameEn.includes("ivysaur") || nameZh.includes("妙蛙草")) {
    return {
      friendship: "LV.5",
      furnitureEn: "Glass Greenhouse Flowerpot",
      furnitureZh: "玻璃溫室花盆",
      recipeEn: "Sweet Spore Juice",
      recipeZh: "甜美孢子汁",
      descEn:
        "Bypasses combat level-up. Unlocks by securing the Greenhouse and supplying rich plant-based nutrients.",
      descZh:
        "取消傳統戰鬥升級進化。需要在屬性棲地內佈置「玻璃溫室花盆」，並餵食「甜美孢子汁」解鎖全新態相。",
    };
  }

  // Charmeleon
  if (nameEn.includes("charmeleon") || nameZh.includes("火恐龍")) {
    return {
      friendship: "LV.5",
      furnitureEn: "Charcoal Brazier & Smelter",
      furnitureZh: "手作耐火木炭火盆",
      recipeEn: "Spiced Roasted Berry",
      recipeZh: "香辛料烤野果",
      descEn:
        "Bypasses battle level-up. Requires high-temp kiln structures and heat-enhancing diets to safely morph habitats.",
      descZh:
        "取消傳統升級進化。需要在火焰棲地內配置「手作耐火木炭火盆」，並在陶窯中製作「香辛料烤野果」款待牠，引導其模擬重組。",
    };
  }

  // Wartortle
  if (nameEn.includes("wartortle") || nameZh.includes("卡咪龜")) {
    return {
      friendship: "LV.5",
      furnitureEn: "Pebble Water Fountain",
      furnitureZh: "圓潤鵝卵石噴泉",
      recipeEn: "Soda Kelp Soup",
      recipeZh: "汽水昆布湯",
      descEn:
        "Bypasses standard levels. Triggers when placing decorative splash basins and offering premium seawater recipes.",
      descZh:
        "取消傳統升級進化。需要在海灘或溪流防禦網內擺放「圓潤鵝卵石噴泉」，並在自動調製機調配「汽水昆布湯」即可完美適配。",
    };
  }

  // Venusaur
  if (nameEn.includes("venusaur") || nameZh.includes("妙蛙花")) {
    return {
      friendship: "LV.10",
      furnitureEn: "Ancient Totem Pillar",
      furnitureZh: "巨型古木藤蔓圖騰柱",
      recipeEn: "Master Spore Tea",
      recipeZh: "特製大師孢子茶",
      descEn:
        "Final sandbox tier. Requires ancient ruins items and concentrated master recipes to unleash the giant flower.",
      descZh:
        "沙盒終極型態。必須在特大花海群落中樹立「巨型古木藤蔓圖騰柱」，並提供「特製大師孢子茶」灌溉使花朵盛開解鎖。",
    };
  }

  // Charizard
  if (nameEn.includes("charizard") || nameZh.includes("噴火龍")) {
    return {
      friendship: "LV.10",
      furnitureEn: "Volcanic Forge Basin",
      furnitureZh: "高溫熔岩鍛造盆",
      recipeEn: "Magma Pepper Lava Feast",
      recipeZh: "烈焰胡椒熔岩大餐",
      descEn:
        "Final tier dragon shift. Smelts items at 200% rate. Summoned by lava flow structures and magma recipes.",
      descZh:
        "沙盒終極巨獸，能以 200% 速度高效熔解金屬。必須在火山口引流熔岩放置「高溫熔岩鍛造盆」，並款待「烈焰胡椒熔岩大餐」。",
    };
  }

  // Blastoise
  if (nameEn.includes("blastoise") || nameZh.includes("水箭龜")) {
    return {
      friendship: "LV.10",
      furnitureEn: "Hydro-Turbine Recirculating Pump",
      furnitureZh: "水力渦輪重防腐循環幫浦",
      recipeEn: "Deepsea Bubble Cocktail",
      recipeZh: "深海發泡泡沫特調",
      descEn:
        "Ultimate hydraulic engineer. Demands automated water recycling systems and premium frozen seawater drinks.",
      descZh:
        "終極水力工程專家。必須擺置「水力渦輪重防腐循環幫浦」並在自動攪拌機製作「深海發泡泡沫特調」以安撫高壓水砲系統。",
    };
  }

  // Eevee base
  if (nameEn === "eevee" || nameZh === "伊布") {
    return {
      friendship: "LV.1 (Base)",
      furnitureEn: "Cozy Cushion Bed",
      furnitureZh: "舒適圓墊睡床",
      recipeEn: "Sweet Berries Mix",
      recipeZh: "田野甜莓綜合果乾",
      descEn:
        "First encountered in Empty Town Center. Shares standard cookie formulations, serving as the entry trade specialist.",
      descZh:
        "在空空鎮寶可夢中心無條件遇見。做為終端沙盒貿易與物資評估的核心，不需要任何複雜進化條件。",
    };
  }

  // Vaporeon
  if (nameEn.includes("vaporeon") || nameZh.includes("水伊布")) {
    return {
      friendship: "LV.8",
      furnitureEn: "Aquarium Divider / 1 Chair, 1 Table",
      furnitureZh: "水族景觀隔離擋板（配備1椅1桌）",
      recipeEn: "Ice Cream Soda",
      recipeZh: "澄澈冰淇淋汽水",
      descEn:
        "Unlock condition: build 10 water-type habitats in Empty Town to unlock the Ice Cream Soda recipe, drawing Vaporeon.",
      descZh:
        "解鎖條件：在空空鎮內建設達 10 個水系棲息地，使自動調製機解鎖「澄澈冰淇淋汽水」配方，將其放置在 1 桌 1 椅旁召喚。",
    };
  }

  // Jolteon
  if (nameEn.includes("jolteon") || nameZh.includes("雷伊布")) {
    return {
      friendship: "LV.8",
      furnitureEn: "Static Coil Rod / 1 Chair, 1 Table",
      furnitureZh: "特斯拉高壓靜電線圈棒（配備1椅1桌）",
      recipeEn: "French Fries",
      recipeZh: "香酥炸薯條",
      descEn:
        "Unlock condition: lay 100 electrical facility blocks in Empty Town to unlock the French Fries recipe, drawing Jolteon.",
      descZh:
        "解鎖條件：在城鎮內佈置累計達 100 個電力設施方塊以導電，使系統解鎖「香酥炸薯條」配方，雷伊布隨之被香氣吸引入住。",
    };
  }

  // Flareon
  if (nameEn.includes("flareon") || nameZh.includes("火伊布")) {
    return {
      friendship: "LV.8",
      furnitureEn: "Firebrick Hearth / 1 Chair, 1 Table",
      furnitureZh: "重工耐火磚小暖爐（配備1椅1桌）",
      recipeEn: "Pizza",
      recipeZh: "窯烤岩漿培根披薩",
      descEn:
        "Unlock condition: commission Pokémon to assist in construction tasks 15 times to unlock the Pizza recipe, drawing Flareon.",
      descZh:
        "解鎖條件：委派手下寶可夢協助城建施工累計達 15 次，解鎖「窯烤岩漿培根披薩」食譜。在棲地放置披薩與耐火爐即可召喚。",
    };
  }

  // Espeon
  if (nameEn.includes("espeon") || nameZh.includes("太陽伊布")) {
    return {
      friendship: "LV.8",
      furnitureEn: "Mahogany Tea Table / Cozy Roommate status",
      furnitureZh: "優雅紅木精雕茶几（須設定為宿舍副室友）",
      recipeEn: "Afternoon Tea Set",
      recipeZh: "精緻英式下午茶套組",
      descEn:
        "Unlock condition: have a Pokémon roommate living with you in your custom residence during Daytime hours.",
      descZh:
        "解鎖條件：此進化僅限白天生成。需在玩家個人別墅配置一間專屬臥房並與其同居，配置「優雅紅木精雕茶几」與一份「精緻英式下午茶套組」。",
    };
  }

  // Umbreon
  if (nameEn.includes("umbreon") || nameZh.includes("月亮伊布")) {
    return {
      friendship: "LV.8",
      furnitureEn: "Lunar Beacon Lamp / 1 Chair, 1 Table",
      furnitureZh: "古銅鏤空月光指引路燈（配備1椅1桌）",
      recipeEn: "Chocolate Cookies",
      recipeZh: "手工黑巧克力烤餅乾",
      descEn:
        "Unlock condition: lay 300 physical road blocks across town. Appears exclusively during Nighttime hours.",
      descZh:
        "解鎖條件：極具挑戰性的夜行個體。城鎮總鋪路方塊數須超過 300 塊，且必須在夜間使用「手工黑巧克力烤餅乾」誘捕引導。",
    };
  }

  // Leafeon
  if (nameEn.includes("leafeon") || nameZh.includes("葉伊布")) {
    return {
      friendship: "LV.8",
      furnitureEn: "Mossy Rock Stand / 1 Chair, 1 Table",
      furnitureZh: "天然微縮青苔岩基座（配備1椅1桌）",
      recipeEn: "Sandwich",
      recipeZh: "草本元氣蔬菜三明治",
      descEn:
        "Unlock condition: harvest 100 crops across Empty Town's farm plots to unlock the Sandwich recipe, drawing Leafeon.",
      descZh:
        "解鎖條件：累計收穫超過 100 株溫室作物，藉此解鎖「草本元氣蔬菜三明治」配方，隨後與青苔擺件配合誘吸葉伊布。",
    };
  }

  // Glaceon
  if (nameEn.includes("glaceon") || nameZh.includes("冰伊布")) {
    return {
      friendship: "LV.8",
      furnitureEn: "Glacial Carving Mirror / 1 Chair, 1 Table",
      furnitureZh: "冰川反折射雕刻透鏡（配備1椅1桌）",
      recipeEn: "Shaved Ice",
      recipeZh: "煉乳紅豆刨冰",
      descEn:
        "Unlock condition: reach the highest elevation point of Empty Town's peak to unlock the Shaved Ice recipe, drawing Glaceon.",
      descZh:
        "解鎖條件：登上空空鎮空島最頂端的海拔頂點以凝聚寒氣，解鎖「煉乳紅豆刨冰」配方。在家具旁擺放即可呼喚其進化而來。",
    };
  }

  // Sylveon
  if (nameEn.includes("sylveon") || nameZh.includes("仙子伊布")) {
    return {
      friendship: "LV.8",
      furnitureEn: "Pink Ribbons Carpet / 1 Chair, 1 Table",
      furnitureZh: "愛心粉紅絲帶羊毛地毯（配備1椅1桌）",
      recipeEn: "Ribbon Cake",
      recipeZh: "香甜奶油緞帶蛋糕",
      descEn:
        "Unlock condition: encounter 10 different species within Empty Town to unlock the Ribbon Cake recipe, drawing Sylveon.",
      descZh:
        "解鎖條件：圖記解鎖登記超過 10 種不同屬性的生物，以習得「香甜奶油緞帶蛋糕」烘焙術。擺在粉紅地毯上即可吸引仙子伊布。",
    };
  }

  // If role is Eeveelution or ID > 3 (not a pure starter base shape)
  if (
    pkmn.roleEn === "Eeveelution" ||
    (pkmn.id && parseInt(pkmn.id, 10) > 3 && pkmn.id !== "132")
  ) {
    return {
      friendship: "LV.5 - LV.8",
      furnitureEn: "SOSS Specialty Modular Appliance",
      furnitureZh: "SOSS 專用屬性模組家具",
      recipeEn: "Advanced Habitat Consumable",
      recipeZh: "高階主題調和膳食",
      descEn:
        "Does not evolve via standard leveling. Triggers entirely by meeting Friendship ratings, building localized home units, and offering required snack dishes.",
      descZh:
        "不靠升級進化。只要將友情等級調和至規定水準，並在領地內裝置對應屬性裝飾家具與特色小喫食譜，即可使其在低溫下安適蛻變。",
    };
  }

  // Standard or Ditto No.132
  return {
    friendship: "LV.1 (Base)",
    furnitureEn: "Basic Wooden Sandbox Crate",
    furnitureZh: "簡易手工木製沙架",
    recipeEn: "Wild Razz Berry Juice",
    recipeZh: "天然麥果搗製汁",
    descEn:
      "This is a base-form starter species. Standard low-level biome cells attract them naturally. Check evolved database entries to review downstream evolution formulae!",
    descZh:
      "這是基礎活動個體。配置初創級生態區即可自然吸引安頓。若欲解鎖更高級型態，歡迎在本圖鑑查閱其對應進化個體的反進化條件配方！",
  };
};

const getEcoConflict = (pkmn: any) => {
  if (!pkmn) return null;
  const nameEn = pkmn.nameEn ? pkmn.nameEn.toLowerCase() : "";
  const nameZh = pkmn.nameZh ? pkmn.nameZh : "";

  if (
    nameEn.includes("squirtle") ||
    nameZh.includes("傑尼龜") ||
    nameEn.includes("wartortle") ||
    nameZh.includes("卡咪龜") ||
    nameEn.includes("blastoise") ||
    nameZh.includes("水箭龜")
  ) {
    return {
      hasConflict: true,
      rivalsEn: "Onix (大岩蛇) & Geodude family (小拳石家族)",
      rivalsZh: "大岩蛇 & 小拳石家族",
      reasonEn:
        "Rock and Ground species dry out the damp water supply! Placing Squirtle close to Onix drops regional humidity fields to zero, raising stress and locking and crashing automation yields.",
      reasonZh:
        "岩石與地面系會瘋狂吸取環境水源！將傑尼龜與巨大大岩蛇放置在鄰近網格時，土壤含水量會驟降至零，引發強烈生態衝突並使自動化採集產能崩潰。",
    };
  }

  if (nameEn.includes("onix") || nameZh.includes("大岩蛇")) {
    return {
      hasConflict: true,
      rivalsEn: "Squirtle family (傑尼龜家族) & Psyduck (可達鴨)",
      rivalsZh: "傑尼龜家族 & 可達鴨",
      reasonEn:
        "Excesswater streams degrade rock density. Mud flow collapses underground digging routes and drops comfort levels.",
      reasonZh:
        "過度潮濕的水流會嚴重侵蝕大岩蛇體表的岩石硬度。將其置於傑尼龜或可達鴨發電機旁，會導致其地下通道滲水坍塌，引發安全恐慌與舒適度震盪。",
    };
  }

  if (
    nameEn.includes("pidgey") ||
    nameZh.includes("波波") ||
    nameEn.includes("pidgeotto") ||
    nameZh.includes("比比鳥") ||
    nameEn.includes("pidgeot") ||
    nameZh.includes("大比鳥")
  ) {
    return {
      hasConflict: true,
      rivalsEn: "Rattata (小拉達) & Caterpie family (綠毛蟲家族)",
      rivalsZh: "小拉達 & 綠毛蟲家族",
      reasonEn:
        "Predator-Prey Instinct Tensions! High stress prevents automated gathering outputs by 40% when placed adjacent.",
      reasonZh:
        "天敵與獵物之間的演化本能衝突！如果在相鄰農田或森林網格同時放置波波與小拉達或綠毛蟲，高度警覺與逃生本能將使採集產量驟減 40%。",
    };
  }

  if (
    nameEn.includes("rattata") ||
    nameZh.includes("小拉達") ||
    nameEn.includes("raticate") ||
    nameZh.includes("拉達")
  ) {
    return {
      hasConflict: true,
      rivalsEn: "Pidgey family (波波家族) & Meowth (喵喵)",
      rivalsZh: "波波家族 & 喵喵",
      reasonEn:
        "Predatory threat presence. Scavenging output halves as rats spend all active cycles hiding in holes.",
      reasonZh:
        "貓與猛禽的致命捕食威脅。將小拉達擺放在喵喵或波波的活動範圍內，會阻礙其離地搜刮物資，導致尋寶物資搬運產能直接減半。",
    };
  }

  if (
    nameEn.includes("caterpie") ||
    nameZh.includes("綠毛蟲") ||
    nameEn.includes("metapod") ||
    nameZh.includes("鐵甲蛹") ||
    nameEn.includes("butterfree") ||
    nameZh.includes("巴大蝶")
  ) {
    return {
      hasConflict: true,
      rivalsEn: "Pidgey family (波波家族)",
      rivalsZh: "波波家族",
      reasonEn:
        "Pidgeys naturally forage on bugs. High stress forces Metapod/Caterpie to harden rather than produce fertilizer spores.",
      reasonZh:
        "波波是綠毛蟲的天然天敵，常造成致命嚇阻。混養於同一個農牧溫室會使綠毛蟲停止吐絲，並因過度驚嚇而無法產出天然肥料。",
    };
  }

  return {
    hasConflict: false,
    reasonEn:
      "Ecosystem Balanced. No known predator or environmental conflicts. Free to place adjacent, sharing sandbox automation bonuses.",
    reasonZh:
      "與周圍居民生態契合度極佳。暫無已知的環境天敵衝突。可自由在相鄰方塊上搭配棲地共同作業，共享最高 1.25x 自動化工效加成。",
  };
};

const FAVORITE_GROUPS = [
  { en: "Taste", zh: "口味", icon: "restaurant", tags: ["sweet flavors", "sour flavors", "bitter flavors", "spicy flavors", "dry flavors"] },
  { en: "Atmosphere", zh: "氛圍", icon: "park", tags: ["lots of nature", "group activities", "gatherings", "ocean vibes", "luxury", "cleanliness"] },
  { en: "Material", zh: "材質", icon: "category", tags: ["wooden stuff", "metal stuff", "fabric", "stone stuff", "electronics", "garbage"] },
  { en: "Shape", zh: "形狀", icon: "shape_line", tags: ["soft stuff", "hard stuff", "slender objects", "round stuff", "blocky stuff", "wobbly stuff", "shiny stuff", "sharp stuff"] },
  { en: "Activity", zh: "活動", icon: "directions_run", tags: ["exercise", "watching stuff", "healing", "construction", "rides"] },
  { en: "Appearance", zh: "外觀", icon: "palette", tags: ["cute stuff", "colorful stuff", "pretty flowers", "strange stuff", "looks like food"] },
  { en: "Other", zh: "其他", icon: "more_horiz", tags: ["nice breezes", "lots of dirt", "lots of water", "complicated stuff", "letters and words"] }
];

export default function Pokedex() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const en = i18n.language === "en";

  const { favorites, toggleFavorite } = useFavorites("fav_pokemon");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [data, setData] = useState<any>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedLike, setSelectedLike] = useState<string[]>([]);
  
  const [selectedSpecialty, setSelectedSpecialty] = useState<string[]>([]);
  const [selectedFavGroup, setSelectedFavGroup] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<boolean>(false);
  const [captureStatus, setCaptureStatus] = useState<"all" | "caught" | "uncaught">("all");

  const toggleFilter = (setFn: Dispatch<SetStateAction<string[]>>, val: string) => {
    setFn(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const [filterExpanded, setFilterExpanded] = useState({
    type: true,
    specialty: true,
    favorites: true,
    comfort: true
  });

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"id" | "alphabetical" | "role">("id");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [active, setActive] = useState<any>(null);
  const [flippedId, setFlippedId] = useState<string | null>(null);

  const [expandReadMore, setExpandReadMore] = useState(false);
  const [activeIntelTab, setActiveIntelTab] = useState<"trivia" | "dolls">(
    "trivia",
  );
  const [activePokedexTab, setActivePokedexTab] = useState<"pokemon" | "items" | "buildings">(
    "pokemon",
  );

  const [isTypeExpanded, setIsTypeExpanded] = useState(false);
  const [isLikeExpanded, setIsLikeExpanded] = useState(false);

  useBodyScrollLock(!!active || isFiltersOpen);

  useEffect(() => {
    fetch("/data/pokedex.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  // Pick up ?q= from the global search box.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) setQuery(q);
  }, [location.search]);

  const list: any[] = useMemo(() => {
    return (data?.pokemon ?? []).filter(
      (p: any) =>
        !["Protagonist", "Story Character", "Mentor"].includes(p.roleEn),
    );
  }, [data]);

  // Build the type list + counts dynamically from known entries.
  const types = useMemo(() => {
    const counts = new Map<string, { en: string; zh: string; count: number }>();
    for (const p of list) {
      if (!p.known) continue;
      (p.typesEn ?? []).forEach((te: string, idx: number) => {
        if (te === "UNKNOWN") return;
        const existing = counts.get(te);
        if (existing) existing.count += 1;
        else counts.set(te, { en: te, zh: p.typesZh?.[idx] ?? te, count: 1 });
      });
    }
    return Array.from(counts.values()).sort((a, b) => b.count - a.count);
  }, [list]);

  const specialties = useMemo(() => {
    const specs = new Map<string, { en: string; displayEn: string; zh: string; count: number }>();
    
    const SPECIALTY_ZH_MAP: Record<string, string> = {
      "burn": "燃燒", "generate": "發電", "grow": "栽種", "water": "水槍", "gather": "採集", "crush": "粉碎",
      "chop": "砍伐", "search": "搜尋", "hype": "鼓舞", "litter": "散佈", "build": "建造", "trade": "交易",
      "bulldoze": "推土", "recycle": "回收", "storage": "儲藏", "fly": "飛行", "collector": "收集", 
      "gather honey": "採蜜", "rarify": "提煉", "teleport": "傳送", "-": "無", "water gun": "水槍", 
      "farming": "栽種", "glide": "滑翔", "forge": "鍛造", "cut": "居合斬", "freeze": "冰凍", 
      "magnet rise": "電磁飄浮", "unknown": "未知", "transport": "運送",
      "smithing": "鍛造", "transform": "變身", "snorlax": "卡比獸", "smeargle": "圖圖犬", "cooking": "料理", "—": "無", "professor": "大木博士"
    };

    for (const p of list) {
      if (!p.known || !p.specialtyEn) continue;
      const partsEn = p.specialtyEn.split('/').map((s: string) => s.trim().toLowerCase());
      const partsZh = p.specialtyZh ? p.specialtyZh.split('/').map((s: string) => s.trim()) : p.specialtyEn.split('/').map((s: string) => s.trim());
      
      partsEn.forEach((enLower: string, idx: number) => {
        if (!enLower) return;
        
        let zhTrans = partsZh[idx] || enLower;
        if (SPECIALTY_ZH_MAP[enLower]) {
           zhTrans = SPECIALTY_ZH_MAP[enLower];
        }

        const existing = specs.get(enLower);
        if (existing) {
          existing.count += 1;
        } else {
          // Capitalize first letter for EN display
          const displayEn = enLower.charAt(0).toUpperCase() + enLower.slice(1);
          specs.set(enLower, { en: enLower, displayEn, zh: zhTrans, count: 1 });
        }
      });
    }
    return Array.from(specs.values()).sort((a, b) => b.count - a.count);
  }, [list]);

  const knownCount = useMemo(() => list.filter((p) => p.known).length, [list]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = list.filter((p) => {
      // Base filters
      const matchesType = selectedType.length === 0 || selectedType.some(t => (p.typesEn ?? []).includes(t));
      const matchesComfort = selectedLike.length === 0 || selectedLike.some(l => (p.favorites ?? []).includes(l));
      
      // FavGroup filter
      let matchesFavGroup = true;
      if (selectedFavGroup.length > 0) {
        matchesFavGroup = selectedFavGroup.some(fg => {
          const group = FAVORITE_GROUPS.find(g => g.en === fg);
          if (group) {
            return (p.favorites ?? []).some((f: string) => group.tags.includes(f));
          }
          return false;
        });
      }

      // Specialty filter
      let matchesSpecialty = true;
      if (selectedSpecialty.length > 0) {
        if (p.specialtyEn) {
          const partsEn = p.specialtyEn.split('/').map((s: string) => s.trim().toLowerCase());
          matchesSpecialty = selectedSpecialty.some(spec => partsEn.includes(spec));
        } else {
          matchesSpecialty = false;
        }
      }

      // Activity limited (just mocking with obtainMethod === "event" for now, or true if none)
      const matchesActivity = !selectedActivity || p.obtainMethod === "event";

      // Capture Status
      let matchesStatus = true;
      if (captureStatus === "caught") matchesStatus = p.known === true;
      if (captureStatus === "uncaught") matchesStatus = p.known === false;

      const matchesQuery =
        !q ||
        p.nameEn?.toLowerCase().includes(q) ||
        p.nameZh?.includes(query.trim()) ||
        p.id?.includes(q);
        
      const matchesFavorites = !showFavoritesOnly || favorites.has(p.id);

      return matchesType && matchesComfort && matchesFavGroup && matchesSpecialty && matchesActivity && matchesStatus && matchesQuery && matchesFavorites;
    });

    if (sortBy === "alphabetical") {
      result.sort((a, b) => {
        const nameA = en ? a.nameEn : a.nameZh;
        const nameB = en ? b.nameEn : b.nameZh;
        return (nameA || "").localeCompare(nameB || "");
      });
    } else if (sortBy === "role") {
      result.sort((a, b) => {
        const roleA = en ? a.roleEn : a.roleZh;
        const roleB = en ? b.roleEn : b.roleZh;
        if (roleA !== roleB) {
          return (roleA || "").localeCompare(roleB || "");
        }
        // Fallback to ID if roles are identical
        return parseInt(a.id, 10) - parseInt(b.id, 10);
      });
    } else {
      result.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
    }

    return result;
  }, [list, selectedType, selectedLike, selectedFavGroup, selectedSpecialty, selectedActivity, captureStatus, query, sortBy, en, showFavoritesOnly, favorites]);

  // Reset pagination whenever the filter set or sort changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedType, selectedLike, selectedFavGroup, selectedSpecialty, selectedActivity, captureStatus, query, sortBy, showFavoritesOnly]);

  const resetFilters = () => {
    setSelectedType([]);
    setSelectedLike([]);
    setSelectedFavGroup([]);
    setSelectedSpecialty([]);
    setSelectedActivity(false);
    setCaptureStatus("all");
    setQuery("");
    setShowFavoritesOnly(false);
  };

  const hasActiveFilters = Boolean(
    selectedType.length > 0 || selectedLike.length > 0 || selectedFavGroup.length > 0 || selectedSpecialty.length > 0 || 
    selectedActivity || captureStatus !== "all" || query || showFavoritesOnly
  );

  const seoTitle = en
    ? "Pokédex Skills & Species Archive | Pokopia Chronicles"
    : "寶可夢圖鑑與技能檔案 | Pokopia 年代記";
  const seoDescription = en
    ? "Browse the Pokopia species archive with structured life, attack, and support skills, habitat roles, and story-linked entries."
    : "瀏覽 Pokopia 的寶可夢檔案，檢視每隻寶可夢的生活技能、攻擊技能、輔助技能、棲地定位與劇情關聯。";

  const dynamicTitle = active
    ? `${en ? active.nameEn : active.nameZh} - ${en ? "Pokédex Entry" : "寶可夢檔案圖鑑"} | ${en ? "Pokopia Chronicles" : "Pokopia 年代記"}`
    : seoTitle;

  const dynamicDescription = active
    ? `${en ? active.nameEn : active.nameZh} (${en ? active.roleEn : active.roleZh}) - ${en ? "Specialty: " : "生活專長："}${en ? active.specialtyEn : active.specialtyZh}。${en ? active.descriptionEn : active.descriptionZh}`
    : seoDescription;

  const dynamicImage = active
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${parseInt(active.id, 10)}.png`
    : undefined;

  if (!data) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-line-soft border-t-primary rounded-full animate-spin"></div>
        <Seo
          title={seoTitle}
          description={seoDescription}
          lang={en ? "en" : "zh-Hant"}
          keywords={[
            "Pokemon Pokopia",
            "Pokopia Pokedex",
            "Pokemon skills",
            "Pokopia guide",
          ]}
        />
      </div>
    );
  }

  const visible = filtered.slice(0, visibleCount);
  const activeSkills: PokedexSkill[] = active?.skills ?? [];

  const dynamicJsonLd = active
    ? {
        "@context": "https://schema.org",
        "@type": "ItemPage",
        "name": dynamicTitle,
        "description": dynamicDescription,
        "url": "https://pokemoninfoperfer.vercel.app/pokedex",
        "mainEntity": {
          "@type": "GamePlayCharacter",
          "name": en ? active.nameEn : active.nameZh,
          "image": dynamicImage,
          "category": en ? active.roleEn : active.roleZh,
          "description": en ? active.descriptionEn : active.descriptionZh
        }
      }
    : {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: seoTitle,
        description: seoDescription,
        url: "https://pokemoninfoperfer.vercel.app/pokedex",
        inLanguage: en ? "en" : "zh-Hant",
        about: "Pokemon Pokopia species archive and skills",
      };

  return (
    <>
      <Seo
        title={dynamicTitle}
        description={dynamicDescription}
        image={dynamicImage}
        lang={en ? "en" : "zh-Hant"}
        noIndex={filtered.length === 0 && (query.trim() !== "" || hasActiveFilters)}
        keywords={[
          "Pokemon Pokopia",
          "Pokopia Pokedex",
          "Pokemon skills",
          "Habitat specialties",
          "Pokopia guide",
          active ? (en ? active.nameEn : active.nameZh) : "",
        ].filter(Boolean)}
        jsonLd={dynamicJsonLd}
      />
      <header className="mb-gutter">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-md">
          <div>
            <h1 className="font-display-lg text-display-lg text-ink-soft mb-sm">
              {t("pokedex.title")}
            </h1>
            <p className="font-body-italic text-body-italic text-ink-mute max-w-2xl mb-4">
              {t("pokedex.subtitle")}
            </p>
          </div>
          {activePokedexTab === "pokemon" && (
            <div className="mt-md md:mt-0 font-mono-metadata text-mono-metadata text-ink-faint uppercase tracking-widest text-left md:text-right flex flex-col md:items-end gap-1">
              <span>{t("pokedex.speciesLogged", { count: knownCount })}</span>
            </div>
          )}
        </div>

        <div className="flex border-b border-line pb-0 mt-6 md:mt-8 relative z-10 w-full overflow-x-auto justify-start md:justify-start">
          <button
            onClick={() => setActivePokedexTab("pokemon")}
            className={`px-6 py-2.5 font-mono-metadata text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
              activePokedexTab === "pokemon"
                ? "border-b-2 border-primary text-primary"
                : "border-b-2 border-transparent text-ink-mute hover:text-ink-soft"
            }`}
          >
            {en ? "Pokémon Archive" : "寶可夢圖鑑"}
          </button>
          <button
            onClick={() => setActivePokedexTab("items")}
            className={`px-6 py-2.5 font-mono-metadata text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
              activePokedexTab === "items"
                ? "border-b-2 border-primary text-primary"
                : "border-b-2 border-transparent text-ink-mute hover:text-ink-soft"
            }`}
          >
            {en ? "Items Database" : "物品圖鑑"}
          </button>
          <button
            onClick={() => setActivePokedexTab("buildings")}
            className={`px-6 py-2.5 font-mono-metadata text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
              activePokedexTab === "buildings"
                ? "border-b-2 border-primary text-primary"
                : "border-b-2 border-transparent text-ink-mute hover:text-ink-soft"
            }`}
          >
            {en ? "Buildings Compendium" : "建築圖鑑"}
          </button>
        </div>
      </header>

      {activePokedexTab === "pokemon" && (
        <>
          <div className="flex flex-col md:flex-row gap-gutter relative">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden sticky top-[70px] z-[30] bg-surface/90 backdrop-blur-md pt-4 pb-2 border-b border-line-soft">
              <div className="flex items-center gap-2">
                <button
                  className="w-full flex items-center justify-center gap-2 bg-paper hover:bg-surface-container border border-line-soft px-4 py-2 hover:shadow-sm transition-all rounded-sm flex-1"
                  onClick={() => setIsFiltersOpen(true)}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    filter_list
                  </span>
                  <span className="font-label-caps text-sm text-ink-main uppercase">
                    {en ? "Filters" : "篩選條件"}
                  </span>
                  {hasActiveFilters && (
                    <span className="font-mono-metadata text-[10px] bg-primary text-white px-2 py-0.5 rounded-full ml-1 leading-none">
                      {(selectedType.length ? 1 : 0) + (selectedLike.length ? 1 : 0) + (selectedFavGroup.length ? 1 : 0) + (selectedSpecialty.length ? 1 : 0) + (selectedActivity ? 1 : 0) + (captureStatus !== "all" ? 1 : 0) + (query ? 1 : 0) + (showFavoritesOnly ? 1 : 0)}
                    </span>
                  )}
                </button>
                {hasActiveFilters && (
                  <span className="font-mono-metadata text-xs text-ink-mute uppercase tracking-widest whitespace-nowrap px-2">
                    {filtered.length} {en ? "Matches" : "筆"}
                  </span>
                )}
              </div>
            </div>

            {/* Mobile Filter Overlay */}
            <AnimatePresence>
              {isFiltersOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFiltersOpen(false)}
                  className="fixed inset-0 bg-ink-main/20 backdrop-blur-sm z-[50] md:hidden"
                />
              )}
            </AnimatePresence>

            {/* Filters sidebar / Drawer */}
            <aside
              className={`fixed inset-y-0 right-0 w-[85vw] max-w-[320px] bg-paper shadow-2xl z-[60] p-6 overflow-y-auto transition-transform duration-300 md:static md:w-64 md:flex-shrink-0 md:bg-transparent md:shadow-none md:p-0 md:translate-x-0 md:z-auto ${isFiltersOpen ? "translate-x-0" : "translate-x-full"}`}
            >
              {/* Drawer Header (Mobile only) */}
              <div className="flex items-center justify-between md:hidden mb-6 pb-4 border-b border-line-soft">
                <span className="font-headline-sm text-lg text-ink-main uppercase">
                  {en ? "Filters" : "篩選條件"}
                </span>
                <button 
                  onClick={() => setIsFiltersOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-bone text-ink-soft transition-colors border border-line-soft"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="sticky top-0 md:top-[120px] pb-10">
                {/* Search Registry */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-headline-sm text-ink-main hidden md:inline-flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">filter_alt</span>
                      {en ? "Filters" : "篩選條件"}
                    </span>
                    {hasActiveFilters && (
                      <div className="flex items-center gap-2 ml-auto md:ml-0">
                        <span className="font-mono-metadata text-[10px] text-ink-mute uppercase tracking-widest hidden md:inline-block">
                          {filtered.length} {en ? "Remaining" : "剩餘數量"}
                        </span>
                        <button
                          onClick={resetFilters}
                          className="flex items-center gap-1 text-xs font-label-caps bg-surface-container hover:bg-surface-container-high text-ink-soft hover:text-ink-main py-1 px-3 rounded transition-colors border hairline-border"
                        >
                          <span className="material-symbols-outlined text-[14px]">refresh</span>
                          {en ? "Reset" : "一鍵重置"}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full border border-line-soft rounded-full bg-surface-container focus:border-primary focus:ring-1 focus:ring-primary font-body-base text-sm py-2 px-4 pr-10 transition-colors placeholder-ink-faint outline-none"
                      placeholder={t("pokedex.searchPlaceholder")}
                    />
                    {query ? (
                      <button
                        onClick={() => setQuery("")}
                        className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute hover:text-primary transition-colors text-[18px]"
                        aria-label={t("pokedex.close")}
                      >
                        close
                      </button>
                    ) : (
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute pointer-events-none text-[18px]">
                        search
                      </span>
                    )}
                  </div>
                </div>

                {/* Activity Limited Toggle */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setSelectedActivity(false)}
                    className={`flex-1 py-1.5 rounded-full font-label-caps text-xs transition-colors ${!selectedActivity ? "bg-primary text-white" : "bg-surface-container text-ink-soft hover:bg-surface-container-high"}`}
                  >
                    {en ? "All Pokémon" : "全部寶可夢"}
                  </button>
                  <button
                    onClick={() => setSelectedActivity(prev => !prev)}
                    className={`flex-1 py-1.5 rounded-full font-label-caps text-xs transition-colors ${selectedActivity ? "bg-tertiary text-white" : "bg-surface-container text-ink-soft hover:bg-surface-container-high"}`}
                  >
                    {en ? "Event Limited" : "活動限定"}
                  </button>
                </div>

                {/* Types Filter */}
                <div className="mb-2">
                  <h3
                    className="font-label-caps text-sm text-ink-soft p-2 flex items-center justify-between cursor-pointer hover:text-ink-main transition-colors"
                    onClick={() => setFilterExpanded(prev => ({...prev, type: !prev.type}))}
                  >
                    <span className="flex items-center gap-2">
                      {en ? "Browse by Type" : "按類型瀏覽"}
                      {selectedType && <span className="w-2 h-2 rounded-full bg-primary" />}
                    </span>
                    <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${filterExpanded.type ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </h3>
                  <AnimatePresence>
                    {filterExpanded.type && (
                      <motion.div initial={{height:0, opacity:0}} animate={{height:"auto", opacity:1}} exit={{height:0, opacity:0}} className="overflow-hidden">
                        <div className="flex flex-wrap gap-2 pt-1 pb-3 px-2">
                          <button
                            onClick={() => setSelectedType([])}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body-base text-xs transition-colors ${selectedType.length === 0 ? "bg-primary/20 text-primary border border-primary/30" : "bg-surface-container text-ink-soft hover:bg-surface-container-high border border-transparent"}`}
                          >
                             {en ? "All" : "全部"}
                          </button>
                          {types.map(ty => (
                            <button
                              key={ty.en}
                              onClick={() => toggleFilter(setSelectedType, ty.en)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body-base text-xs transition-colors ${selectedType.includes(ty.en) ? "bg-primary text-white border border-primary" : "bg-surface-container text-ink-soft hover:bg-surface-container-high border border-transparent"}`}
                            >
                              {en ? ty.en : ty.zh}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Specialty Filter */}
                <div className="mb-2">
                  <h3
                    className="font-label-caps text-sm text-ink-soft p-2 flex items-center justify-between cursor-pointer hover:text-ink-main transition-colors"
                    onClick={() => setFilterExpanded(prev => ({...prev, specialty: !prev.specialty}))}
                  >
                    <span className="flex items-center gap-2">
                      {en ? "Browse by Specialty" : "按特長瀏覽"}
                      {selectedSpecialty && <span className="w-2 h-2 rounded-full bg-tertiary" />}
                    </span>
                    <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${filterExpanded.specialty ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </h3>
                  <AnimatePresence>
                    {filterExpanded.specialty && (
                      <motion.div initial={{height:0, opacity:0}} animate={{height:"auto", opacity:1}} exit={{height:0, opacity:0}} className="overflow-hidden">
                        <div className="flex flex-wrap gap-2 pt-1 pb-3 px-2">
                          {specialties.map(spec => (
                            <button
                              key={spec.en}
                              onClick={() => toggleFilter(setSelectedSpecialty, spec.en)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body-base text-xs transition-colors ${selectedSpecialty.includes(spec.en) ? "bg-tertiary text-white shadow-sm" : "bg-[#F3EFE9] text-ink-soft hover:bg-surface-container-high"}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${selectedSpecialty.includes(spec.en) ? "bg-white/70" : "bg-ink-mute"}`}></span>
                              {en ? spec.displayEn : spec.zh}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Favorites Filter */}
                <div className="mb-2">
                  <h3
                    className="font-label-caps text-sm text-ink-soft p-2 flex items-center justify-between cursor-pointer hover:text-ink-main transition-colors"
                    onClick={() => setFilterExpanded(prev => ({...prev, favorites: !prev.favorites}))}
                  >
                    <span className="flex items-center gap-2">
                      {en ? "Browse by Favorites" : "按喜好瀏覽"}
                      {selectedFavGroup && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                    </span>
                    <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${filterExpanded.favorites ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </h3>
                  <AnimatePresence>
                    {filterExpanded.favorites && (
                      <motion.div initial={{height:0, opacity:0}} animate={{height:"auto", opacity:1}} exit={{height:0, opacity:0}} className="overflow-hidden">
                        <div className="flex flex-wrap gap-2 pt-1 pb-3 px-2">
                          {FAVORITE_GROUPS.map(group => (
                            <button
                              key={group.en}
                              onClick={() => toggleFilter(setSelectedFavGroup, group.en)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body-base text-xs transition-colors ${selectedFavGroup.includes(group.en) ? "bg-amber-500 text-white shadow-sm" : "bg-[#F3EFE9] text-ink-soft hover:bg-surface-container-high"}`}
                            >
                              <span className={`material-symbols-outlined text-[14px] ${selectedFavGroup.includes(group.en) ? "text-white/90" : "text-ink-mute"}`}>{group.icon}</span>
                              {en ? group.en : group.zh}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Comfort Filter */}
                <div className="mb-6">
                  <h3
                    className="font-label-caps text-sm text-ink-soft p-2 flex items-center justify-between cursor-pointer hover:text-ink-main transition-colors"
                    onClick={() => setFilterExpanded(prev => ({...prev, comfort: !prev.comfort}))}
                  >
                    <span className="flex items-center gap-2">
                      {en ? "Browse by Environment" : "按喜歡的環境瀏覽"}
                      {selectedLike && <span className="w-2 h-2 rounded-full bg-cyan-500" />}
                    </span>
                    <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${filterExpanded.comfort ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </h3>
                  <AnimatePresence>
                    {filterExpanded.comfort && (
                      <motion.div initial={{height:0, opacity:0}} animate={{height:"auto", opacity:1}} exit={{height:0, opacity:0}} className="overflow-hidden">
                        <div className="flex flex-wrap gap-2 pt-1 pb-3 px-2">
                          {COMFORT_FAVS.map(item => (
                            <button
                                key={item.val}
                                onClick={() => toggleFilter(setSelectedLike, item.val)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body-base text-xs transition-colors ${selectedLike.includes(item.val) ? "bg-cyan-600 text-white shadow-sm" : "bg-[#F3EFE9] text-ink-soft hover:bg-surface-container-high"}`}
                              >
                                <span className={`material-symbols-outlined text-[14px] ${selectedLike.includes(item.val) ? "text-white/90" : "text-ink-mute"}`}>{item.icon}</span>
                                {en ? item.en : item.zh}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-wrap gap-2 mb-4 border-t border-line-soft pt-4">
                  <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-label-caps transition-colors w-full justify-center mb-2 ${showFavoritesOnly ? 'bg-[#FF6B6B] text-white border border-[#FF6B6B]' : 'bg-transparent border border-line-soft text-ink-soft hover:bg-surface-container'}`}>
                    <span className={`material-symbols-outlined text-[16px] ${showFavoritesOnly ? 'fill-white font-variation-fill' : ''}`}>favorite</span>
                    {en ? "My Favorites Only" : "僅顯示我的最愛"}
                  </button>
                  <button onClick={() => setCaptureStatus('all')} className={`px-4 py-1.5 rounded-full text-sm font-label-caps transition-colors ${captureStatus === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-primary/10 text-primary border border-primary/20'}`}>{en ? "All" : "全部"}</button>
                  <button onClick={() => setCaptureStatus('caught')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-label-caps transition-colors ${captureStatus === 'caught' ? 'bg-primary text-white shadow-sm' : 'bg-paper border border-line-soft text-ink-soft hover:bg-surface-container'}`}>
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    {en ? "Caught" : "已捕獲"}
                  </button>
                  <button onClick={() => setCaptureStatus('uncaught')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-label-caps transition-colors ${captureStatus === 'uncaught' ? 'bg-primary text-white shadow-sm' : 'bg-paper border border-line-soft text-ink-soft hover:bg-surface-container'}`}>
                    <span className="material-symbols-outlined text-[18px]">close</span>
                    {en ? "Uncaught" : "未捕獲"}
                  </button>
                </div>
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-grow flex flex-col min-w-0">
              <div className="flex justify-end mb-md gap-3 items-center">
                <label
                  htmlFor="sort-select"
                  className="font-label-caps text-label-caps text-ink-mute"
                >
                  {en ? "Sort by:" : "排序方式："}
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="font-body-base text-body-base px-3 py-1.5 rounded-sm bg-surface-container border border-line-soft text-ink-soft cursor-pointer focus:outline-none focus:border-primary transition-all hover:border-ink-soft appearance-none min-w-[120px]"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.5rem center",
                    backgroundSize: "1em",
                  }}
                >
                  <option value="id">
                    {en ? "ID (Default)" : "編號 (預設)"}
                  </option>
                  <option value="alphabetical">
                    {en ? "Alphabetical" : "按名稱"}
                  </option>
                  <option value="role">
                    {en ? "Role Type" : "按角色型別"}
                  </option>
                </select>
              </div>
              {visible.length === 0 ? (
                <div className="border border-dashed border-line-soft rounded-sm py-xl flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-ink-faint text-4xl mb-sm">
                    search_off
                  </span>
                  <p className="font-body-base text-body-base text-ink-mute">
                    {t("pokedex.noResults")}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-md relative">
                  <AnimatePresence mode="popLayout">
                    {visible.map((pkmn: any, idx: number) => (
                      <ScrollFade
                        key={pkmn.id}
                        depth="none"
                        delay={(idx % 5) * 0.03}
                        className="h-full"
                        layout
                      >
                      <div
                        className={`relative group h-full [perspective:1000px] ${flippedId === pkmn.id ? "z-10" : "z-0"}`}
                      >
                        <motion.div
                          className="w-full h-full [transform-style:preserve-3d] relative shadow-sm hover:shadow-md transition-shadow"
                          initial={false}
                          animate={{ rotateY: flippedId === pkmn.id ? 180 : 0 }}
                          transition={{
                            duration: 0.6,
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                          }}
                        >
                          {/* FRONT FACE */}
                          <article
                            onClick={() =>
                              pkmn.known &&
                              setFlippedId(
                                flippedId === pkmn.id ? null : pkmn.id,
                              )
                            }
                            className={`p-3 sm:p-4 flex flex-col relative h-full border border-line-soft bg-paper hover:bg-surface-container/30 [backface-visibility:hidden] ${pkmn.known ? "cursor-pointer" : "opacity-50 hover:opacity-100"}`}
                          >
                            <div className="flex justify-between items-start mb-2 sm:mb-sm">
                              <span
                                className={`font-body-italic text-sm sm:text-base ${pkmn.known ? "text-ink-soft" : "text-ink-mute"}`}
                              >
                                {pkmn.roman}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => toggleFavorite(pkmn.id, e)}
                                  className="text-line hover:text-primary transition-colors focus:outline-none"
                                >
                                  <span className={`material-symbols-outlined text-[16px] ${favorites.has(pkmn.id) ? "fill-[#FF6B6B] text-[#FF6B6B] font-variation-fill" : ""}`}>
                                    favorite
                                  </span>
                                </button>
                                <span className="font-mono-metadata text-xs text-ink-mute">
                                  NO.{pkmn.id}
                                </span>
                              </div>
                            </div>

                            <div className="w-full h-24 sm:h-32 mb-4 relative flex items-center justify-center group/img">
                              {pkmn.known ? (
                                <>
                                  <img
                                    src={pkmn.image}
                                    alt={pkmn.nameEn}
                                    loading="lazy"
                                    className="object-contain max-w-[70px] max-h-[70px] sm:max-w-[100px] sm:max-h-[100px] group-hover:scale-105 transition-transform duration-500"
                                  />
                                  {pkmn.rarity && (
                                    <span
                                      className={`absolute top-0 right-0 font-mono-metadata text-xs uppercase tracking-widest ${
                                        pkmn.rarity === "V"
                                          ? "text-secondary font-bold"
                                          : pkmn.rarity === "R"
                                            ? "text-primary"
                                            : "text-ink-faint"
                                      }`}
                                    >
                                      {pkmn.rarity === "V"
                                        ? en
                                          ? "V. Rare"
                                          : "極罕 V"
                                        : pkmn.rarity === "R"
                                          ? en
                                            ? "Rare"
                                            : "稀有 R"
                                          : en
                                            ? "Common"
                                            : "常見 C"}
                                    </span>
                                  )}
                                  {pkmn.requires_friendship !== undefined && (
                                    <span className="absolute bottom-0 left-0 text-xs font-mono-metadata text-ink-mute flex items-center gap-1 select-none">
                                      <span className="material-symbols-outlined text-xs">
                                        favorite
                                      </span>
                                      {en
                                        ? `Lv.${pkmn.requires_friendship}`
                                        : `友情 ${pkmn.requires_friendship}`}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="material-symbols-outlined text-line-soft text-3xl sm:text-4xl">
                                  visibility_off
                                </span>
                              )}
                            </div>

                            {pkmn.known && (
                              <div className="text-xs sm:text-xs text-ink-faint mb-2 flex gap-1 flex-wrap">
                                <span>{en ? "Image:" : "圖片:"}</span>
                                <a
                                  href="https://pokeapi.co/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-primary underline decoration-dashed underline-offset-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  PokeAPI
                                </a>
                              </div>
                            )}

                            <div className="flex flex-col mt-auto pt-2 border-t border-line-soft">
                              <h2
                                className={`font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md mb-1 transition-colors truncate ${pkmn.known ? "text-ink-soft group-hover:text-ink-main" : "text-ink-mute"}`}
                              >
                                {en ? pkmn.nameEn : pkmn.nameZh}
                              </h2>
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                                <div className="flex flex-wrap gap-1 sm:gap-xs">
                                  {(en ? pkmn.typesEn : pkmn.typesZh).map(
                                    (type: string, idx: number) => (
                                      <span
                                        key={idx}
                                        className={`font-label-caps text-label-caps px-1 py-0.5 sm:px-1.5 uppercase tracking-widest text-[10px] sm:text-xs ${pkmn.known ? (idx === 0 ? "text-ink-soft" : "text-ink-mute") : "text-ink-faint"}`}
                                      >
                                        {type}
                                      </span>
                                    ),
                                  )}
                                </div>

                                {pkmn.known &&
                                  (en ? pkmn.roleEn : pkmn.roleZh) && (
                                    <span className="font-mono-metadata text-mono-metadata text-ink-soft flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-0.5 rounded w-fit text-[10px] sm:text-xs hidden md:flex">
                                      <span className="material-symbols-outlined text-[12px] sm:text-[14px]">
                                        badge
                                      </span>
                                      {en ? pkmn.roleEn : pkmn.roleZh}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </article>

                          {/* BACK FACE */}
                          {pkmn.known && (
                            <article
                              onClick={() =>
                                setFlippedId(
                                  flippedId === pkmn.id ? null : pkmn.id,
                                )
                              }
                              className="absolute inset-0 p-3 sm:p-4 flex flex-col h-full border border-line-soft bg-paper-warm [backface-visibility:hidden] [transform:rotateY(180deg)] cursor-pointer overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                            >
                              <div className="flex justify-between items-start mb-2 border-b border-line-soft pb-2">
                                <span className="font-headline-sm text-sm text-ink-main truncate flex-1">
                                  {en ? pkmn.nameEn : pkmn.nameZh}
                                </span>
                                <span
                                  className="material-symbols-outlined text-ink-mute text-sm ml-1 hover:text-primary transition-colors hover:scale-110"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActive(pkmn);
                                  }}
                                  title={t("pokedex.secretIntelTitle")}
                                >
                                  open_in_full
                                </span>
                              </div>

                              <div className="flex flex-col gap-2.5 mt-1 flex-1">
                                {pkmn.favorites &&
                                  pkmn.favorites.length > 0 && (
                                    <div className="flex flex-col gap-1">
                                      <span className="font-mono-metadata text-[10px] text-ink-faint uppercase">
                                        {t("pokedex.likesLabel")}
                                      </span>
                                      <div className="flex flex-wrap gap-1">
                                        {pkmn.favorites.map(
                                          (fav: string, fIdx: number) => (
                                            <span
                                              key={fIdx}
                                              className="bg-bone border hairline-border px-1.5 py-0.5 rounded-[2px] text-[10px] text-ink-soft truncate max-w-full leading-none"
                                            >
                                              {t(
                                                `pokopia.fav.${fav.replace(/\s+/g, "_")}`,
                                                { defaultValue: fav },
                                              )}
                                            </span>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>

                              <div className="mt-auto pt-3 flex justify-center border-t border-line-soft border-dashed">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActive(pkmn);
                                  }}
                                  className="text-[10px] font-label-caps uppercase text-primary border border-primary/30 rounded px-2 py-1 flex items-center gap-1 hover:bg-primary/10 transition-colors w-full justify-center tracking-widest bg-primary/5"
                                >
                                  <span className="material-symbols-outlined text-[12px]">
                                    info
                                  </span>
                                  {en ? "Full Archive" : "詳細檔案紀錄"}
                                </button>
                              </div>
                            </article>
                          )}
                        </motion.div>
                      </div>
                    </ScrollFade>
                  ))}
                  </AnimatePresence>
                </div>
              )}

              {visibleCount < filtered.length && (
                <div className="mt-lg flex justify-center w-full">
                  <button
                    onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                    className="bg-primary text-white font-label-caps text-xs px-8 py-4 hover:bg-opacity-90 transition-colors uppercase w-full md:w-auto tracking-widest"
                  >
                    {t("pokedex.loadMore")} ({filtered.length - visibleCount})
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-line-soft">
            {/* Pokédex Milestone Rewards Card */}
            <div className="select-none bg-surface-container/20 p-6 rounded-sm border border-line-soft">
              <h4 className="font-label-caps text-lg text-ink-main mb-4 pb-2 border-b border-line-soft flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  auto_awesome
                </span>
                {en ? "Milestone Rewards" : "圖鑑進度里程碑"}
              </h4>
              <p className="font-body-base text-sm text-ink-mute mb-6 leading-relaxed">
                {en
                  ? "Key milestones unlock exclusive titles, apparel garments, or hard-to-find materials:"
                  : "圖鑑收集隻數里程碑獎勵："}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-paper border border-line-soft p-3 rounded-sm hover:-translate-y-0.5 transition-transform">
                  <div className="font-mono-metadata text-sm text-ink-mute w-16 text-right shrink-0">
                    200 {en ? "SP" : "隻"}
                  </div>
                  <div className="w-[1px] h-8 bg-line-soft" />
                  <div className="font-body-base text-base text-ink-soft leading-tight font-bold">
                    {en ? "Apprentice Title" : "合格探險家稱號"}
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-paper border border-line-soft p-3 rounded-sm hover:-translate-y-0.5 transition-transform">
                  <div className="font-mono-metadata text-sm text-ink-mute w-16 text-right shrink-0">
                    250 {en ? "SP" : "隻"}
                  </div>
                  <div className="w-[1px] h-8 bg-line-soft" />
                  <div className="font-body-base text-base text-ink-soft leading-tight font-bold">
                    {en ? "Elite Explorer Garments" : "精銳探險家高階服飾"}
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-paper border border-line-soft p-3 rounded-sm hover:-translate-y-0.5 transition-transform shadow-sm">
                  <div className="font-mono-metadata text-sm text-primary font-bold w-16 text-right shrink-0">
                    300 {en ? "SP" : "隻"}
                  </div>
                  <div className="w-[1px] h-8 bg-primary/30" />
                  <div className="font-body-base text-base text-ink-main leading-tight font-bold">
                    {en ? "Pioneer Title & Console" : "開闢稱號 & 太空終端"}
                  </div>
                </div>
              </div>
            </div>

            {/* Community Secret Intel Card (Bahamut Trivia & Doll Biome Gating Limits) */}
            <div className="select-none bg-surface-container/20 p-6 rounded-sm border border-line-soft">
              <h4 className="font-label-caps text-lg text-ink-main mb-4 pb-2 border-b border-line-soft flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-tertiary">
                  folder_supervised
                </span>
                {t("pokedex.secretIntelTitle")}
              </h4>

              {/* Tab Switcher */}
              <div className="flex border-b border-line-soft mb-5">
                <button
                  onClick={() => setActiveIntelTab("trivia")}
                  className={`flex-1 font-mono-metadata text-sm pb-2 uppercase tracking-wider text-center border-b-2 transition-all ${activeIntelTab === "trivia" ? "border-tertiary text-tertiary font-bold" : "border-transparent text-ink-mute hover:text-ink-soft"}`}
                >
                  {t("pokedex.intelTabTrivia")}
                </button>
                <button
                  onClick={() => setActiveIntelTab("dolls")}
                  className={`flex-1 font-mono-metadata text-sm pb-2 uppercase tracking-wider text-center border-b-2 transition-all ${activeIntelTab === "dolls" ? "border-tertiary text-tertiary font-bold" : "border-transparent text-ink-mute hover:text-ink-soft"}`}
                >
                  {t("pokedex.intelTabDolls")}
                </button>
              </div>

              {activeIntelTab === "trivia" ? (
                <div className="space-y-4 h-[240px] overflow-y-auto pr-2 [scrollbar-width:thin]">
                  <div className="bg-paper p-4 rounded-sm border border-line-soft hover:border-line transition-colors">
                    <span className="font-mono-metadata text-sm text-primary font-bold block mb-1">
                      {t("pokedex.trivia1Title")}
                    </span>
                    <p className="text-sm text-ink-soft leading-relaxed font-body-base">
                      {t("pokedex.trivia1Desc")}
                    </p>
                  </div>
                  <div className="bg-paper p-4 rounded-sm border border-line-soft hover:border-line transition-colors">
                    <span className="font-mono-metadata text-sm text-[#a53a2c] font-bold block mb-1">
                      {t("pokedex.trivia2Title")}
                    </span>
                    <p className="text-sm text-ink-soft leading-relaxed font-body-base">
                      {t("pokedex.trivia2Desc")}
                    </p>
                  </div>
                  <div className="bg-paper p-4 rounded-sm border border-line-soft hover:border-line transition-colors">
                    <span className="font-mono-metadata text-sm text-tertiary font-bold block mb-1">
                      {t("pokedex.trivia3Title")}
                    </span>
                    <p className="text-sm text-ink-soft leading-relaxed font-body-base">
                      {t("pokedex.trivia3Desc")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 h-[240px] overflow-y-auto pr-2 [scrollbar-width:thin]">
                  <div className="bg-paper p-4 rounded-sm border border-line-soft">
                    <span className="font-mono-metadata text-sm text-secondary font-bold block mb-2 flex items-center justify-between">
                      <span>{t("pokedex.dollLimitTitle")}</span>
                      <span className="bg-surface-container px-2 py-0.5 rounded text-ink-main border border-line-soft">
                        7
                      </span>
                    </span>
                    <p className="text-sm text-ink-soft leading-relaxed font-body-base">
                      {t("pokedex.dollLimitDesc")}
                    </p>
                  </div>
                  <div className="bg-paper p-4 rounded-sm border border-line-soft">
                    <span className="font-mono-metadata text-sm text-primary font-bold block mb-2 flex items-center justify-between">
                      <span>{t("pokedex.dollGatingTitle")}</span>
                      <span className="bg-surface-container px-2 py-0.5 rounded text-ink-main border border-line-soft">
                        {en ? "Lv.30" : "30級"}
                      </span>
                    </span>
                    <p className="text-sm text-ink-soft leading-relaxed font-body-base">
                      {t("pokedex.dollGatingDesc")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detail Modal */}
          {active && (
            <div
              className="fixed inset-0 z-[70] flex items-end md:items-center justify-center md:p-4 bg-ink-soft/40 backdrop-blur-sm"
              onClick={() => {
                setActive(null);
                setExpandReadMore(false);
              }}
            >
              <motion.div
                initial={{ y: "20%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "20%", opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-paper border hairline-border w-full md:max-w-3xl lg:max-w-4xl h-[92vh] md:h-auto md:max-h-[90vh] overflow-y-auto relative mx-auto flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 w-full flex justify-center pt-3 pb-1 md:hidden bg-bone/80 backdrop-blur-md z-20 hairline-bottom">
                  <div className="w-12 h-1 bg-line-soft"></div>
                </div>
                <button
                  onClick={() => {
                    setActive(null);
                    setExpandReadMore(false);
                  }}
                  className="absolute top-4 right-4 z-10 text-ink-mute hover:text-primary transition-colors focus:outline-none"
                  aria-label={t("pokedex.close")}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    close
                  </span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="bg-bone border-b md:border-b-0 md:border-r hairline-border flex flex-col items-center justify-center p-4 sm:p-md h-48 md:h-auto md:aspect-square relative flex-shrink-0">
                    <img
                      src={active.image}
                      alt={active.nameEn}
                      className="object-contain max-w-[150px] max-h-[150px] sm:max-w-[200px] sm:max-h-[200px] mb-4"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-ink-faint flex gap-1 bg-surface/50 backdrop-blur-sm px-2 py-1 rounded">
                      <span>{en ? "Img Source:" : "圖片出處:"}</span>
                      <a
                        href="https://pokeapi.co/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary underline decoration-dashed underline-offset-2"
                      >
                        PokeAPI
                      </a>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 md:p-lg flex flex-col">
                    <div className="flex justify-between items-start mb-sm">
                      <span className="font-body-italic text-body-italic text-primary">
                        {active.roman}
                      </span>
                      <span className="font-mono-metadata text-mono-metadata text-ink-mute bg-surface-variant px-2 py-1 rounded-sm border border-line-soft">
                        #{active.id}
                      </span>
                    </div>
                    <h2 className="font-headline-md text-headline-md text-ink-soft leading-tight">
                      {en ? active.nameEn : active.nameZh}
                    </h2>
                    <span className="font-body-italic text-body-italic text-ink-mute mb-md">
                      {en ? active.nameZh : active.nameEn}
                    </span>

                    <div className="flex flex-wrap gap-xs mb-md">
                      {(en ? active.typesEn : active.typesZh).map(
                        (type: string, idx: number) => (
                          <span
                            key={idx}
                            className={`font-label-caps text-label-caps px-2 py-0.5 rounded-sm border ${idx === 0 ? "text-tertiary border-tertiary/30" : "text-outline border-outline/30"}`}
                          >
                            {type}
                          </span>
                        ),
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-sm mt-4">
                      {active.roleEn && (
                        <div className="bg-paper-warm md:hairline-border border-y md:border-y-0 border-line-soft py-4 px-4 md:py-2 md:px-3 md:rounded-sm flex items-center justify-between gap-2 -mx-4 sm:-mx-6 md:mx-0 mt-[-1px] md:mt-0">
                          <span className="font-label-caps text-label-caps text-ink-mute shrink-0">
                            {t("pokedex.role")}
                          </span>
                          <span className="font-body-base text-body-base text-ink-soft text-right">
                            {en ? active.roleEn : active.roleZh}
                          </span>
                        </div>
                      )}
                      {active.specialtyEn && active.specialtyEn !== "—" && (
                        <div className="bg-paper-warm md:hairline-border border-y md:border-y-0 border-line-soft py-4 px-4 md:py-2 md:px-3 md:rounded-sm flex items-center justify-between gap-2 -mx-4 sm:-mx-6 md:mx-0 mt-[-1px] md:mt-0">
                          <span className="font-label-caps text-label-caps text-ink-mute shrink-0">
                            {t("pokedex.specialty")}
                          </span>
                          <span className="font-body-base text-body-base text-primary text-right">
                            {en ? active.specialtyEn : active.specialtyZh}
                          </span>
                        </div>
                      )}

                      {/* Ecological Stats & Quantitative Analysis Dashboard */}
                      <div className="bg-[#FAF8F5] md:hairline-border border-y md:border-y-0 border-line-soft p-4 sm:p-5 md:rounded-sm md:col-span-2 -mx-4 sm:-mx-6 md:mx-0 mt-[-1px] md:mt-0 flex flex-col gap-4">
                        <div className="font-label-caps text-label-caps text-secondary flex items-center gap-2 border-b border-line-soft pb-2 font-bold tracking-wider">
                          <span className="material-symbols-outlined text-[18px]">
                            bar_chart_4_bars
                          </span>
                          {en ? "QUANTITATIVE BASE STATS & RARITY" : "能力值量化與稀有度分析"}
                        </div>

                        {/* Top: 2-column key indicators */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Rarity Encounter Probability Bar */}
                          {active?.rarity && (() => {
                            const rate = active.rarity === "C" ? 85 : active.rarity === "R" ? 35 : 5;
                            const colorClass = active.rarity === "C" ? "bg-emerald-500" : active.rarity === "R" ? "bg-amber-500" : "bg-red-500";
                            const descText = active.rarity === "C" 
                              ? (en ? "High Encounter frequency" : "出現機率：極高（一般自然生成）")
                              : active.rarity === "R"
                              ? (en ? "Moderate encounter rate" : "出現機率：中等（罕見生境）")
                              : (en ? "Extremely Rare legend / secret event" : "出現機率：極低（傳說與特殊事件）");
                            return (
                              <div className="flex flex-col gap-1.5 p-3 rounded bg-white border border-line-soft shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                <div className="flex items-center justify-between">
                                  <span className="font-label-caps text-[10px] sm:text-xs text-ink-mute tracking-wide">
                                    {t("pokedex.rarityLabel")}
                                  </span>
                                  <span className="font-mono-metadata text-xs font-bold text-ink-soft">
                                    {active.rarity === "C" && (en ? "Common (C)" : "普通 (C)")}
                                    {active.rarity === "R" && (en ? "Rare (R)" : "稀有 (R)")}
                                    {active.rarity === "V" && (en ? "Very Rare (V)" : "非常稀有 (V)")}
                                    <span className="text-ink-mute ml-1">({rate}%)</span>
                                  </span>
                                </div>
                                <div className="w-full h-2 bg-line-soft rounded-sm overflow-hidden flex">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${rate}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-full ${colorClass} rounded-sm`}
                                  />
                                </div>
                                <span className="text-[10px] text-ink-mute font-body-base leading-none">
                                  {descText}
                                </span>
                              </div>
                            );
                          })()}

                          {/* Friendship Requirement Bar */}
                          {active?.requires_friendship !== undefined && (
                            <div className="flex flex-col gap-1.5 p-3 rounded bg-white border border-line-soft shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                              <div className="flex items-center justify-between">
                                <span className="font-label-caps text-[10px] sm:text-xs text-ink-mute tracking-wide">
                                  {t("pokedex.friendshipLabel")}
                                </span>
                                <span className="font-mono-metadata text-xs font-bold text-ink-soft">
                                  Lv. {active.requires_friendship} <span className="text-ink-mute">/ 100</span>
                                </span>
                              </div>
                              <div className="w-full h-2 bg-line-soft rounded-sm overflow-hidden flex">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, Math.max(0, (active.requires_friendship / 100) * 100))}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className="h-full bg-cyan-500 rounded-sm"
                                />
                              </div>
                              <span className="text-[10px] text-ink-mute font-body-base leading-none">
                                {en ? "Required level for peak task efficiency" : "解鎖最優工作性能所需的默契親密度"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Bottom: Base Stats block */}
                        {(() => {
                          const stats = getPokemonStats(active);
                          const statsList = [
                            { labelEn: "HP", labelZh: "生命值", val: stats.hp, max: 150, color: "bg-emerald-500", icon: "favorite" },
                            { labelEn: "ATK", labelZh: "攻擊力", val: stats.atk, max: 150, color: "bg-red-400", icon: "swords" },
                            { labelEn: "DEF", labelZh: "防禦力", val: stats.def, max: 150, color: "bg-amber-500", icon: "shield" },
                            { labelEn: "SPD", labelZh: "敏捷度", val: stats.spd, max: 150, color: "bg-cyan-500", icon: "directions_run" },
                            { labelEn: "WORK", labelZh: "工作效率", val: stats.work, max: 150, color: "bg-pink-500", icon: "build" },
                          ];
                          return (
                            <div className="bg-white rounded border border-line-soft p-3 sm:p-4 flex flex-col gap-3.5">
                              <span className="font-mono-metadata text-xs text-ink-faint uppercase font-bold tracking-wider">
                                {en ? "Base Ecological Stats" : "基礎生態戰力與工作指標 (Stat Meters)"}
                              </span>
                              <div className="flex flex-col gap-3">
                                {statsList.map((stat, sIdx) => {
                                  const pct = (stat.val / stat.max) * 100;
                                  return (
                                    <div key={sIdx} className="grid grid-cols-[70px_1fr_40px] sm:grid-cols-[90px_1fr_40px] items-center gap-3">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="material-symbols-outlined text-[14px] text-ink-faint shrink-0">
                                          {stat.icon}
                                        </span>
                                        <span className="font-label-caps text-xs text-ink-soft font-bold truncate">
                                          {en ? stat.labelEn : stat.labelZh}
                                        </span>
                                      </div>
                                      <div className="relative h-2.5 bg-line-soft rounded-full overflow-hidden flex-1">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${pct}%` }}
                                          transition={{ duration: 1.2, ease: "easeOut", delay: sIdx * 0.05 }}
                                          className={`h-full ${stat.color} rounded-full`}
                                        />
                                      </div>
                                      <span className="font-mono-metadata text-xs font-bold text-ink-soft text-right shrink-0">
                                        {stat.val}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Pokopia Database Specifics */}
                      {(active.favorites ||
                        active.timeOfDay ||
                        active.weather ||
                        active.environmentPreference) && (
                        <div className="bg-paper-warm md:hairline-border border-y md:border-y-0 border-line-soft py-4 px-4 md:py-4 md:px-4 md:rounded-sm md:col-span-2 -mx-4 sm:-mx-6 md:mx-0 mt-[-1px] md:mt-0 flex flex-col gap-3">
                          <div className="font-label-caps text-label-caps text-secondary flex items-center gap-2 border-b border-line-soft pb-2 font-bold tracking-wider">
                            <span className="material-symbols-outlined text-[18px]">
                              travel_explore
                            </span>
                            {en
                              ? "POKOPIA ECOLOGICAL DATA"
                              : "POKOPIA 生態日誌"}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {active.favorites &&
                              active.favorites.length > 0 && (
                                <div className="flex flex-col gap-1.5">
                                  <span className="font-mono-metadata text-xs text-ink-faint uppercase tracking-wider">
                                    {t("pokedex.likesLabel")}
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {active.favorites.map(
                                      (fav: string, fIdx: number) => (
                                        <span
                                          key={fIdx}
                                          className="bg-bone border hairline-border px-2 py-0.5 rounded-sm text-xs text-ink-soft"
                                        >
                                          {t(
                                            `pokopia.fav.${fav.replace(/\s+/g, "_")}`,
                                            { defaultValue: fav },
                                          )}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}

                            {(active.timeOfDay ||
                              active.weather ||
                              active.environmentPreference) && (
                              <div className="flex flex-wrap gap-x-4 gap-y-2 sm:col-span-2 pt-2 border-t border-line-soft border-dashed">
                                {active.timeOfDay &&
                                  active.timeOfDay.length > 0 && (
                                    <div className="flex flex-col">
                                      <span className="font-mono-metadata text-[10px] text-ink-faint uppercase">
                                        {t("pokedex.timeOfDay")}
                                      </span>
                                      <span className="text-xs text-ink-mute">
                                        {active.timeOfDay
                                          .map((tVal: string) =>
                                            t(`pokopia.tod.${tVal}`, {
                                              defaultValue: tVal,
                                            }),
                                          )
                                          .join(" / ")}
                                      </span>
                                    </div>
                                  )}
                                {active.weather &&
                                  active.weather.length > 0 && (
                                    <div className="flex flex-col">
                                      <span className="font-mono-metadata text-[10px] text-ink-faint uppercase">
                                        {t("pokedex.weather")}
                                      </span>
                                      <span className="text-xs text-ink-mute bg-surface px-1.5 rounded-sm">
                                        {active.weather
                                          .map((wVal: string) =>
                                            t(`pokopia.weather.${wVal}`, {
                                              defaultValue: wVal,
                                            }),
                                          )
                                          .join(", ")}
                                      </span>
                                    </div>
                                  )}
                                {active.environmentPreference && (
                                  <div className="flex flex-col">
                                    <span className="font-mono-metadata text-[10px] text-ink-faint uppercase">
                                      {t("pokedex.envPref")}
                                    </span>
                                    <span className="text-xs text-ink-mute">
                                      {t(
                                        `pokopia.env.${active.environmentPreference}`,
                                        {
                                          defaultValue:
                                            active.environmentPreference,
                                        },
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 「生態進化解鎖配方」 Habitat & Food formula section */}
                      {(() => {
                        const formula = getEvolutionFormula(active);
                        if (!formula) return null;
                        return (
                          <div className="bg-paper-warm md:hairline-border border-y md:border-y-0 border-line-soft py-5 px-4 md:py-4 md:px-4 md:rounded-sm md:col-span-2 -mx-4 sm:-mx-6 md:mx-0 mt-[-1px] md:mt-0 flex flex-col gap-3">
                            <div className="font-label-caps text-label-caps text-primary flex items-center gap-2 border-b border-line-soft pb-2 font-bold tracking-wider">
                              <span className="material-symbols-outlined text-[18px]">
                                biotech
                              </span>
                              {en
                                ? "HABITAT & FOOD EVOLUTION FORMULA"
                                : "「生態進化解鎖配方」"}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div className="bg-surface-container-high/60 p-2.5 rounded border border-line-soft/60">
                                <div className="font-mono-metadata text-xs text-ink-faint uppercase tracking-wider mb-1">
                                  {en ? "Friendship Level" : "友情等級需求"}
                                </div>
                                <div className="text-xs font-bold text-ink-soft">
                                  {formula.friendship}
                                </div>
                              </div>
                              <div className="bg-surface-container-high/60 p-2.5 rounded border border-line-soft/60">
                                <div className="font-mono-metadata text-xs text-ink-faint uppercase tracking-wider mb-1">
                                  {en ? "Target Furniture" : "指定特化家具"}
                                </div>
                                <div className="text-xs font-bold text-primary">
                                  {en
                                    ? formula.furnitureEn
                                    : formula.furnitureZh}
                                </div>
                              </div>
                              <div className="bg-surface-container-high/60 p-2.5 rounded border border-line-soft/60">
                                <div className="font-mono-metadata text-xs text-ink-faint uppercase tracking-wider mb-1">
                                  {en ? "Summon Food Recipe" : "指定食物配方"}
                                </div>
                                <div className="text-xs font-bold text-secondary">
                                  {en ? formula.recipeEn : formula.recipeZh}
                                </div>
                              </div>
                            </div>
                            <p className="font-body-base text-xs text-ink-mute leading-relaxed bg-[#f2ecde]/50 p-3 rounded border border-dashed border-line-soft/70">
                              {en ? formula.descEn : formula.descZh}
                            </p>
                          </div>
                        );
                      })()}

                      {/* 「物種舒適度衝突警告」 Species Comfort Conflict / Co-habitation section */}
                      {(() => {
                        const conflict = getEcoConflict(active);
                        if (!conflict) return null;
                        return (
                          <div className="bg-paper-warm md:hairline-border border-y md:border-y-0 border-line-soft py-5 px-4 md:py-4 md:px-4 md:rounded-sm md:col-span-2 -mx-4 sm:-mx-6 md:mx-0 mt-[-1px] md:mt-0 flex flex-col gap-2.5">
                            <div
                              className={`font-label-caps text-label-caps flex items-center gap-2 border-b border-line-soft pb-2 font-bold tracking-wider ${conflict.hasConflict ? "text-[#a53a2c]" : "text-emerald-700"}`}
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                {conflict.hasConflict
                                  ? "warning"
                                  : "check_circle"}
                              </span>
                              {en
                                ? "ECOLOGICAL CO-HABITATION WARNING"
                                : "「物種舒適與鄰近衝突警告」"}
                            </div>
                            {conflict.hasConflict ? (
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 bg-red-50/50 border border-red-200/50 p-2 rounded">
                                  <span className="font-mono-metadata text-xs text-[#a53a2c] font-bold uppercase shrink-0">
                                    {en
                                      ? "Incompatible Nearby:"
                                      : "已知本能相剋對象:"}
                                  </span>
                                  <span className="text-xs text-red-950 font-bold truncate">
                                    {en ? conflict.rivalsEn : conflict.rivalsZh}
                                  </span>
                                </div>
                                <p className="font-body-base text-xs text-ink-mute leading-relaxed bg-red-50/10 p-2.5 rounded border border-dashed border-red-200/30">
                                  {en ? conflict.reasonEn : conflict.reasonZh}
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2">
                                <p className="font-body-base text-xs text-emerald-800 leading-relaxed bg-emerald-50/30 p-3 rounded border border-dashed border-emerald-200/50 flex items-start gap-2">
                                  <span className="material-symbols-outlined text-emerald-600 text-[16px] mt-0.5 animate-pulse">
                                    verified
                                  </span>
                                  <span>
                                    {en ? conflict.reasonEn : conflict.reasonZh}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {activeSkills.length > 0 && (
                        <div className="bg-paper-warm md:hairline-border border-y md:border-y-0 border-line-soft py-5 px-4 md:py-3 md:px-3 md:rounded-sm md:col-span-2 -mx-4 sm:-mx-6 md:mx-0 mt-[-1px] md:mt-0">
                          <span className="font-label-caps text-label-caps text-ink-mute block mb-3 sm:mb-2">
                            {t("pokedex.skills")}
                          </span>
                          <div className="grid grid-cols-1 gap-2">
                            {activeSkills.map((skill) => (
                              <article
                                key={`${skill.categoryEn}-${skill.nameEn}`}
                                className="bg-surface-container-high border border-line-soft rounded-sm px-3 py-2"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                  <span className="font-label-caps text-label-caps text-ink-mute uppercase">
                                    {en ? skill.categoryEn : skill.categoryZh}
                                  </span>
                                  <span className="font-mono-metadata text-mono-metadata text-primary">
                                    {en ? skill.nameEn : skill.nameZh}
                                  </span>
                                </div>
                                <p className="font-body-base text-body-base text-ink-soft leading-relaxed">
                                  {en ? skill.detailEn : skill.detailZh}
                                </p>
                              </article>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {active.descriptionEn && (
                  <div className="p-4 sm:p-6 md:p-lg pt-0 sm:pt-6 md:pt-lg border-t border-line-soft mt-0 flex flex-col justify-between flex-grow">
                    <p
                      className={`font-body-base text-body-base text-ink-soft leading-relaxed transition-all ${expandReadMore ? "" : "line-clamp-3 mb-2"}`}
                    >
                      {en ? active.descriptionEn : active.descriptionZh}
                    </p>
                    <button
                      onClick={() => setExpandReadMore(!expandReadMore)}
                      className="text-left font-label-caps text-label-caps text-primary hover:text-tertiary transition-colors mb-md self-start"
                    >
                      {expandReadMore
                        ? i18n.language.startsWith("en")
                          ? "Show Less"
                          : "顯示較少"
                        : i18n.language.startsWith("en")
                          ? "Read More"
                          : "閱讀更多"}
                    </button>
                    <div className="mt-auto border-t border-dashed border-line-soft pt-sm">
                      <p className="font-mono-metadata text-mono-metadata text-ink-faint flex items-center justify-start gap-2 flex-wrap mb-1">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            link
                          </span>
                          {i18n.language === "en" ? "Source:" : "資料出處:"}
                        </span>
                        <a
                          href="https://bulbapedia.bulbagarden.net/wiki/Main_Page"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors underline decoration-dashed underline-offset-2"
                        >
                          Bulbapedia
                        </a>
                        <span>·</span>
                        <a
                          href="https://pokeapi.co/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors underline decoration-dashed underline-offset-2"
                        >
                          PokeAPI
                        </a>
                      </p>
                      <p className="font-mono-metadata text-mono-metadata text-ink-faint text-xs leading-tight flex items-start gap-1 mt-1">
                        <span className="material-symbols-outlined text-sm mt-[1px]">
                          copyright
                        </span>
                        <span>
                          {en
                            ? "Nintendo, Game Freak, and The Pokémon Company."
                            : "版權歸屬任天堂、Game Freak 及 The Pokémon Company。本站僅作攻略資訊整合。"}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </>
      )}

      {activePokedexTab === "items" && <ItemsTab />}
      {activePokedexTab === "buildings" && <BuildingsTab />}
    </>
  );
}
