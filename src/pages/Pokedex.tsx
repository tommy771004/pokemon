import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import Seo from "../components/Seo";
import ScrollFade from "../components/ScrollFade";

const PAGE_SIZE = 12;

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
  if (nameEn.includes("bulbasaur") || nameZh.includes("妙蛙種子") || 
      nameEn.includes("charmander") || nameZh.includes("小火龍") || 
      nameEn.includes("squirtle") || nameZh.includes("傑尼龜")) {
    return {
      friendship: "LV.1 (Base)",
      furnitureEn: "Standard Nesting Bed",
      furnitureZh: "新手標準睡墊",
      recipeEn: "Sweet Sunshine Nectar",
      recipeZh: "鮮甜陽光花蜜",
      descEn: "Summoned naturally by starting biome generators in Palette Town without any complex evolution processes.",
      descZh: "初始即可獲得的基礎生物。在真新鎮起步棲息地會自動生成招募，無須任何複雜的反進化配方。"
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
      descEn: "Bypasses combat level-up. Unlocks by securing the Greenhouse and supplying rich plant-based nutrients.",
      descZh: "取消傳統戰鬥升級進化。需要在屬性棲地內佈置「玻璃溫室花盆」，並餵食「甜美孢子汁」解鎖全新態相。"
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
      descEn: "Bypasses battle level-up. Requires high-temp kiln structures and heat-enhancing diets to safely morph habitats.",
      descZh: "取消傳統升級進化。需要在火焰棲地內配置「手作耐火木炭火盆」，並在陶窯中製作「香辛料烤野果」款待牠，引導其模擬重組。"
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
      descEn: "Bypasses standard levels. Triggers when placing decorative splash basins and offering premium seawater recipes.",
      descZh: "取消傳統升級進化。需要在海灘或溪流防禦網內擺放「圓潤鵝卵石噴泉」，並在自動調製機調配「汽水昆布湯」即可完美適配。"
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
      descEn: "Final sandbox tier. Requires ancient ruins items and concentrated master recipes to unleash the giant flower.",
      descZh: "沙盒終極型態。必須在特大花海群落中樹立「巨型古木藤蔓圖騰柱」，並提供「特製大師孢子茶」灌溉使花朵盛開解鎖。"
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
      descEn: "Final tier dragon shift. Smelts items at 200% rate. Summoned by lava flow structures and magma recipes.",
      descZh: "沙盒終極巨獸，能以 200% 速度高效熔解金屬。必須在火山口引流熔岩放置「高溫熔岩鍛造盆」，並款待「烈焰胡椒熔岩大餐」。"
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
      descEn: "Ultimate hydraulic engineer. Demands automated water recycling systems and premium frozen seawater drinks.",
      descZh: "終極水力工程專家。必須擺置「水力渦輪重防腐循環幫浦」並在自動攪拌機製作「深海發泡泡沫特調」以安撫高壓水砲系統。"
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
      descEn: "First encountered in Palette Town Center. Shares standard cookie formulations, serving as the entry trade specialist.",
      descZh: "在真新鎮寶可夢中心無條件遇見。做為終端沙盒貿易與物資評估的核心，不需要任何複雜進化條件。"
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
      descEn: "Unlock condition: build 10 water-type habitats in Palette Town to unlock the Ice Cream Soda recipe, drawing Vaporeon.",
      descZh: "解鎖條件：在真新鎮內建設達 10 個水系棲息地，使自動調製機解鎖「澄澈冰淇淋汽水」配方，將其放置在 1 桌 1 椅旁召喚。"
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
      descEn: "Unlock condition: lay 100 electrical facility blocks in Palette Town to unlock the French Fries recipe, drawing Jolteon.",
      descZh: "解鎖條件：在城鎮內佈置累計達 100 個電力設施方塊以導電，使系統解鎖「香酥炸薯條」配方，雷伊布隨之被香氣吸引入住。"
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
      descEn: "Unlock condition: commission Pokémon to assist in construction tasks 15 times to unlock the Pizza recipe, drawing Flareon.",
      descZh: "解鎖條件：委派手下寶可夢協助城建施工累計達 15 次，解鎖「窯烤岩漿培根披薩」食譜。在棲地放置披薩與耐火爐即可召喚。"
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
      descEn: "Unlock condition: have a Pokémon roommate living with you in your custom residence during Daytime hours.",
      descZh: "解鎖條件：此進化僅限白天生成。需在玩家個人別墅配置一間專屬臥房並與其同居，配置「優雅紅木精雕茶几」與一份「精緻英式下午茶套組」。"
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
      descEn: "Unlock condition: lay 300 physical road blocks across town. Appears exclusively during Nighttime hours.",
      descZh: "解鎖條件：極具挑戰性的夜行個體。城鎮總鋪路方塊數須超過 300 塊，且必須在夜間使用「手工黑巧克力烤餅乾」誘捕引導。"
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
      descEn: "Unlock condition: harvest 100 crops across Palette Town's farm plots to unlock the Sandwich recipe, drawing Leafeon.",
      descZh: "解鎖條件：累計收穫超過 100 株溫室作物，藉此解鎖「草本元氣蔬菜三明治」配方，隨後與青苔擺件配合誘吸葉伊布。"
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
      descEn: "Unlock condition: reach the highest elevation point of Palette Town's peak to unlock the Shaved Ice recipe, drawing Glaceon.",
      descZh: "解鎖條件：登上真新鎮空島最頂端的海拔頂點以凝聚寒氣，解鎖「煉乳紅豆刨冰」配方。在家具旁擺放即可呼喚其進化而來。"
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
      descEn: "Unlock condition: encounter 10 different species within Palette Town to unlock the Ribbon Cake recipe, drawing Sylveon.",
      descZh: "解鎖條件：圖記解鎖登記超過 10 種不同屬性的生物，以習得「香甜奶油緞帶蛋糕」烘焙術。擺在粉紅地毯上即可吸引仙子伊布。"
    };
  }

  // If role is Eeveelution or ID > 3 (not a pure starter base shape)
  if (pkmn.roleEn === "Eeveelution" || (pkmn.id && parseInt(pkmn.id, 10) > 3 && pkmn.id !== "132")) {
    return {
      friendship: "LV.5 - LV.8",
      furnitureEn: "SOSS Specialty Modular Appliance",
      furnitureZh: "SOSS 專用屬性模組家具",
      recipeEn: "Advanced Habitat Consumable",
      recipeZh: "高階主題調和膳食",
      descEn: "Does not evolve via standard leveling. Triggers entirely by meeting Friendship ratings, building localized home units, and offering required snack dishes.",
      descZh: "不靠升級進化。只要將友情等級調和至規定水準，並在領地內裝置對應屬性裝飾家具與特色小喫食譜，即可使其在低溫下安適蛻變。"
    };
  }

  // Standard or Ditto No.132
  return {
    friendship: "LV.1 (Base)",
    furnitureEn: "Basic Wooden Sandbox Crate",
    furnitureZh: "簡易手工木製沙架",
    recipeEn: "Wild Razz Berry Juice",
    recipeZh: "天然麥果搗製汁",
    descEn: "This is a base-form starter species. Standard low-level biome cells attract them naturally. Check evolved database entries to review downstream evolution formulae!",
    descZh: "這是基礎活動個體。配置初創級生態區即可自然吸引安頓。若欲解鎖更高級型態，歡迎在本圖鑑查閱其對應進化個體的反進化條件配方！"
  };
};

const getEcoConflict = (pkmn: any) => {
  if (!pkmn) return null;
  const nameEn = pkmn.nameEn ? pkmn.nameEn.toLowerCase() : "";
  const nameZh = pkmn.nameZh ? pkmn.nameZh : "";

  if (nameEn.includes("squirtle") || nameZh.includes("傑尼龜") || 
      nameEn.includes("wartortle") || nameZh.includes("卡咪龜") || 
      nameEn.includes("blastoise") || nameZh.includes("水箭龜")) {
    return {
      hasConflict: true,
      rivalsEn: "Onix (大岩蛇) & Geodude family (小拳石家族)",
      rivalsZh: "大岩蛇 & 小拳石家族",
      reasonEn: "Rock and Ground species dry out the damp water supply! Placing Squirtle close to Onix drops regional humidity fields to zero, raising stress and locking and crashing automation yields.",
      reasonZh: "岩石與地面系會瘋狂吸取環境水源！將傑尼龜與巨大大岩蛇放置在鄰近網格時，土壤含水量會驟降至零，引發強烈生態衝突並使自動化採集產能崩潰。"
    };
  }

  if (nameEn.includes("onix") || nameZh.includes("大岩蛇")) {
    return {
      hasConflict: true,
      rivalsEn: "Squirtle family (傑尼龜家族) & Psyduck (可達鴨)",
      rivalsZh: "傑尼龜家族 & 可達鴨",
      reasonEn: "Excesswater streams degrade rock density. Mud flow collapses underground digging routes and drops comfort levels.",
      reasonZh: "過度潮濕的水流會嚴重侵蝕大岩蛇體表的岩石硬度。將其置於傑尼龜或可達鴨發電機旁，會導致其地下通道滲水坍塌，引發安全恐慌與舒適度震盪。"
    };
  }

  if (nameEn.includes("pidgey") || nameZh.includes("波波") || 
      nameEn.includes("pidgeotto") || nameZh.includes("比比鳥") || 
      nameEn.includes("pidgeot") || nameZh.includes("大比鳥")) {
    return {
      hasConflict: true,
      rivalsEn: "Rattata (小拉達) & Caterpie family (綠毛蟲家族)",
      rivalsZh: "小拉達 & 綠毛蟲家族",
      reasonEn: "Predator-Prey Instinct Tensions! High stress prevents automated gathering outputs by 40% when placed adjacent.",
      reasonZh: "天敵與獵物之間的演化本能衝突！如果在相鄰農田或森林網格同時放置波波與小拉達或綠毛蟲，高度警覺與逃生本能將使採集產量驟減 40%。"
    };
  }

  if (nameEn.includes("rattata") || nameZh.includes("小拉達") || 
      nameEn.includes("raticate") || nameZh.includes("拉達")) {
    return {
      hasConflict: true,
      rivalsEn: "Pidgey family (波波家族) & Meowth (喵喵)",
      rivalsZh: "波波家族 & 喵喵",
      reasonEn: "Predatory threat presence. Scavenging output halves as rats spend all active cycles hiding in holes.",
      reasonZh: "貓與猛禽的致命捕食威脅。將小拉達擺放在喵喵或波波的活動範圍內，會阻礙其離地搜刮物資，導致尋寶物資搬運產能直接減半。"
    };
  }

  if (nameEn.includes("caterpie") || nameZh.includes("綠毛蟲") || 
      nameEn.includes("metapod") || nameZh.includes("鐵甲蛹") || 
      nameEn.includes("butterfree") || nameZh.includes("巴大蝶")) {
    return {
      hasConflict: true,
      rivalsEn: "Pidgey family (波波家族)",
      rivalsZh: "波波家族",
      reasonEn: "Pidgeys naturally forage on bugs. High stress forces Metapod/Caterpie to harden rather than produce fertilizer spores.",
      reasonZh: "波波是綠毛蟲的天然天敵，常造成致命嚇阻。混養於同一個農牧溫室會使綠毛蟲停止吐絲，並因過度驚嚇而無法產出天然肥料。"
    };
  }

  return {
    hasConflict: false,
    reasonEn: "Ecosystem Balanced. No known predator or environmental conflicts. Free to place adjacent, sharing sandbox automation bonuses.",
    reasonZh: "與周圍居民生態契合度極佳。暫無已知的環境天敵衝突。可自由在相鄰方塊上搭配棲地共同作業，共享最高 1.25x 自動化工效加成。"
  };
};

export default function Pokedex() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [data, setData] = useState<any>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"id" | "alphabetical" | "role">("id");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [active, setActive] = useState<any>(null);
  const [expandReadMore, setExpandReadMore] = useState(false);

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

  const en = i18n.language === "en";
  const list: any[] = useMemo(() => {
    return (data?.pokemon ?? []).filter((p: any) => 
      !["Protagonist", "Story Character", "Mentor"].includes(p.roleEn)
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

  const knownCount = useMemo(() => list.filter((p) => p.known).length, [list]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = list.filter((p) => {
      const matchesType = !selectedType || (p.typesEn ?? []).includes(selectedType);
      const matchesQuery =
        !q ||
        p.nameEn?.toLowerCase().includes(q) ||
        p.nameZh?.includes(query.trim()) ||
        p.id?.includes(q);
      return matchesType && matchesQuery;
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
  }, [list, selectedType, query, sortBy, en]);

  // Reset pagination whenever the filter set or sort changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedType, query, sortBy]);

  const seoTitle = en ? "Pokédex Skills & Species Archive | Pokopia Chronicles" : "寶可夢圖鑑與技能檔案 | Pokopia 年代記";
  const seoDescription = en
    ? "Browse the Pokopia species archive with structured life, attack, and support skills, habitat roles, and story-linked entries."
    : "瀏覽 Pokopia 的寶可夢檔案，檢視每隻寶可夢的生活技能、攻擊技能、輔助技能、棲地定位與劇情關聯。";

  if (!data) {
    return (
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia", "Pokopia Pokedex", "Pokemon skills", "Pokopia guide"]}
      />
    );
  }

  const visible = filtered.slice(0, visibleCount);
  const activeSkills: PokedexSkill[] = active?.skills ?? [];

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia", "Pokopia Pokedex", "Pokemon skills", "Habitat specialties", "Pokopia guide"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: seoTitle,
          description: seoDescription,
          url: "https://pokemoninfoperfer.vercel.app/pokedex",
          inLanguage: en ? "en" : "zh-Hant",
          about: "Pokemon Pokopia species archive and skills",
        }}
      />
      <header className="mb-gutter">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-md">
          <div>
            <h1 className="font-display-lg text-display-lg text-ink-soft mb-sm">{t("pokedex.title")}</h1>
            <p className="font-body-italic text-body-italic text-ink-mute max-w-2xl">
              {t("pokedex.subtitle")}
            </p>
          </div>
          <div className="mt-md md:mt-0 font-mono-metadata text-mono-metadata text-ink-faint uppercase tracking-widest text-left md:text-right">
            {t("pokedex.speciesLogged", { count: knownCount })}
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-gutter relative">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden sticky top-[80px] z-[40] bg-surface/90 backdrop-blur-md py-4 border-b border-line-soft">
          <button
            className="w-full flex items-center justify-between bg-bone border border-line-soft px-4 py-2 rounded-sm"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <span className="font-label-caps text-label-caps text-ink-soft uppercase">
              {t("pokedex.typeClassification")} & {t("pokedex.searchRegistry")}
            </span>
            <span className="material-symbols-outlined text-ink-mute transition-transform" style={{ transform: isFiltersOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
              expand_more
            </span>
          </button>
        </div>

        {/* Filters sidebar */}
        <aside className={`w-full md:w-64 flex-shrink-0 ${isFiltersOpen ? "block" : "hidden"} md:block`}>
          <div className="sticky top-[140px] md:top-[120px]">
            <div className="mb-lg">
              <h3 className="font-label-caps text-label-caps text-ink-soft mb-sm border-b border-line-soft pb-xs">
                {t("pokedex.typeClassification")}
              </h3>
              <ul className="space-y-xs">
                <li>
                  <button
                    onClick={() => setSelectedType(null)}
                    className={`w-full text-left font-body-base text-body-base flex items-center justify-between py-xs transition-colors group p-2 rounded ${selectedType === null ? "text-primary bg-surface-container md:bg-transparent" : "text-ink-soft hover:text-primary hover:bg-surface-container-high md:hover:bg-transparent"}`}
                  >
                    <span className="flex items-center gap-xs">
                      <span className={`w-2 h-2 rounded-full transition-colors ${selectedType === null ? "bg-primary" : "bg-ink-faint group-hover:bg-primary"}`}></span>
                      {t("pokedex.allTypes")}
                    </span>
                    <span className="font-mono-metadata text-mono-metadata text-ink-mute">{knownCount}</span>
                  </button>
                </li>
                {types.map((ty) => (
                  <li key={ty.en}>
                    <button
                      onClick={() => setSelectedType(ty.en)}
                      className={`w-full text-left font-body-base text-body-base flex items-center justify-between py-xs transition-colors group p-2 rounded ${selectedType === ty.en ? "text-primary bg-surface-container md:bg-transparent" : "text-ink-soft hover:text-primary hover:bg-surface-container-high md:hover:bg-transparent"}`}
                    >
                      <span className="flex items-center gap-xs">
                        <span className={`w-2 h-2 rounded-full transition-colors ${selectedType === ty.en ? "bg-primary" : "bg-tertiary group-hover:bg-primary"}`}></span>
                        {en ? ty.en : ty.zh}
                      </span>
                      <span className="font-mono-metadata text-mono-metadata text-ink-mute">{ty.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-lg">
              <h3 className="font-label-caps text-label-caps text-ink-soft mb-sm border-b border-line-soft pb-xs">
                {t("pokedex.searchRegistry")}
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full border-0 border-b border-ink-soft focus:border-primary focus:ring-0 font-body-base text-body-base py-sm px-0 pr-6 transition-colors bg-transparent placeholder-ink-faint outline-none"
                  placeholder={t("pokedex.searchPlaceholder")}
                />
                {query ? (
                  <button
                    onClick={() => setQuery("")}
                    className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-ink-mute hover:text-primary transition-colors"
                    aria-label={t("pokedex.close")}
                  >
                    close
                  </button>
                ) : (
                  <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-ink-mute pointer-events-none">
                    search
                  </span>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-grow flex flex-col min-w-0">
          <div className="flex justify-end mb-md gap-3 items-center">
            <label htmlFor="sort-select" className="font-label-caps text-label-caps text-ink-mute">
              {en ? "Sort by:" : "排序方式："}
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="font-body-base text-body-base px-3 py-1.5 rounded-sm bg-surface-container border border-line-soft text-ink-soft cursor-pointer focus:outline-none focus:border-primary transition-all hover:border-ink-soft appearance-none min-w-[120px]"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
            >
              <option value="id">{en ? "ID (Default)" : "編號 (預設)"}</option>
              <option value="alphabetical">{en ? "Alphabetical" : "按名稱"}</option>
              <option value="role">{en ? "Role Type" : "按角色型別"}</option>
            </select>
          </div>
          {visible.length === 0 ? (
            <div className="border border-dashed border-line-soft rounded-sm py-xl flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-ink-faint text-4xl mb-sm">search_off</span>
              <p className="font-body-base text-body-base text-ink-mute">{t("pokedex.noResults")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-md relative">
              {visible.map((pkmn: any, idx: number) => (
                <ScrollFade key={pkmn.id} depth="none" delay={(idx % 5) * 0.03} className="h-full">
                  <motion.article
                    onClick={() => pkmn.known && setActive(pkmn)}
                    whileHover={pkmn.known ? { scale: 1.02, y: -2 } : {}}
                    className={`bg-bone border border-line-soft rounded-sm p-2.5 sm:p-sm flex flex-col relative ambient-shadow transition-colors transition-opacity duration-300 group paper-texture h-full ${pkmn.known ? "cursor-pointer" : "opacity-50 hover:opacity-100"}`}
                  >
                    <div className="flex justify-between items-start mb-2 sm:mb-sm">
                      <span className={`font-body-italic text-body-italic text-sm sm:text-base ${pkmn.known ? "text-primary" : "text-ink-mute"}`}>
                        {pkmn.roman}
                      </span>
                      <span className="font-mono-metadata text-mono-metadata text-ink-mute bg-surface-variant px-1.5 py-0.5 rounded-sm border border-line-soft text-[10px]">
                        #{pkmn.id}
                      </span>
                    </div>

                    <div className="w-full h-24 sm:h-32 mb-2 sm:mb-xs bg-surface-container-high rounded-sm border border-line-soft overflow-hidden relative flex items-center justify-center group/img">
                      {pkmn.known ? (
                        <img
                          src={pkmn.image}
                          alt={pkmn.nameEn}
                          loading="lazy"
                          className="object-contain max-w-[70px] max-h-[70px] sm:max-w-[100px] sm:max-h-[100px] group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-ink-faint text-3xl sm:text-4xl">visibility_off</span>
                      )}
                    </div>
                    
                    {pkmn.known && (
                      <div className="text-[9px] sm:text-[10px] text-ink-faint mb-2 sm:mb-sm flex gap-1 flex-wrap">
                        <span>{en ? "Image:" : "圖片:"}</span>
                        <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline decoration-dashed underline-offset-1" onClick={(e) => e.stopPropagation()}>PokeAPI</a>
                      </div>
                    )}

                    <div className="flex flex-col mt-auto">
                      <h2 className={`font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md mb-1 md:mb-xs transition-colors truncate ${pkmn.known ? "text-ink-soft group-hover:text-primary" : "text-ink-mute"}`}>
                        {en ? pkmn.nameEn : pkmn.nameZh}
                      </h2>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                        <div className="flex flex-wrap gap-1 sm:gap-xs">
                          {(en ? pkmn.typesEn : pkmn.typesZh).map((type: string, idx: number) => (
                            <span
                              key={idx}
                              className={`font-label-caps text-label-caps px-1 py-0.5 sm:px-2 rounded-sm border text-[9px] sm:text-[11px] ${pkmn.known ? idx === 0 ? "text-tertiary border-tertiary/30" : "text-outline border-outline/30" : "text-ink-faint border-ink-faint/30"}`}
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                        {pkmn.known && (en ? pkmn.roleEn : pkmn.roleZh) && (
                          <span className="font-mono-metadata text-mono-metadata text-ink-soft flex items-center gap-0.5 sm:gap-1 bg-surface-container-high px-1 sm:px-2 py-0.5 rounded w-fit text-[9px] sm:text-[10px]">
                            <span className="material-symbols-outlined text-[10px] sm:text-[14px]">badge</span>
                            {en ? pkmn.roleEn : pkmn.roleZh}
                          </span>
                        )}
                        {pkmn.known && pkmn.specialtyEn && pkmn.specialtyEn !== "—" && (
                          <span className="font-mono-metadata text-mono-metadata text-ink-faint flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px]">
                            <span className="material-symbols-outlined text-[10px] sm:text-[14px]">bolt</span>
                            {en ? pkmn.specialtyEn : pkmn.specialtyZh}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.article>
                </ScrollFade>
              ))}
            </div>
          )}

          {visibleCount < filtered.length && (
            <div className="mt-lg flex justify-center w-full">
              <button
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                className="bg-primary text-on-primary font-label-caps text-label-caps py-sm px-lg rounded-full hover:-translate-y-[1px] hover:shadow-[0_4px_14px_0_rgba(165,58,44,0.39)] transition-all duration-200 uppercase w-full md:w-auto"
              >
                {t("pokedex.loadMore")} ({filtered.length - visibleCount})
              </button>
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
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-bone border-t md:border border-line rounded-t-3xl md:rounded-2xl ambient-shadow w-full md:max-w-2xl lg:max-w-3xl h-[92vh] md:h-auto md:max-h-[90vh] overflow-y-auto relative paper-texture mx-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 w-full flex justify-center pt-3 pb-1 md:hidden bg-bone/80 backdrop-blur-md z-20">
              <div className="w-12 h-1.5 bg-line-soft rounded-full"></div>
            </div>
            <button
              onClick={() => {
                setActive(null);
                setExpandReadMore(false);
              }}
              className="absolute top-sm right-sm z-10 text-ink-mute hover:text-primary transition-colors bg-paper/80 backdrop-blur-md rounded-full p-1 border border-line-soft"
              aria-label={t("pokedex.close")}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-surface-container-high border-b md:border-b-0 md:border-r border-line-soft flex flex-col items-center justify-center p-4 sm:p-md h-48 md:h-auto md:aspect-square relative flex-shrink-0">
                <img src={active.image} alt={active.nameEn} className="object-contain max-w-[150px] max-h-[150px] sm:max-w-[200px] sm:max-h-[200px] mb-4" />
                <div className="absolute bottom-2 right-2 text-[10px] text-ink-faint flex gap-1 bg-surface/50 backdrop-blur-sm px-2 py-1 rounded">
                  <span>{en ? "Img Source:" : "圖片出處:"}</span>
                  <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline decoration-dashed underline-offset-2">PokeAPI</a>
                </div>
              </div>
              <div className="p-4 sm:p-6 md:p-lg flex flex-col">
                <div className="flex justify-between items-start mb-sm">
                  <span className="font-body-italic text-body-italic text-primary">{active.roman}</span>
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
                  {(en ? active.typesEn : active.typesZh).map((type: string, idx: number) => (
                    <span
                      key={idx}
                      className={`font-label-caps text-label-caps px-2 py-0.5 rounded-sm border ${idx === 0 ? "text-tertiary border-tertiary/30" : "text-outline border-outline/30"}`}
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-sm mt-4">
                  {active.roleEn && (
                    <div className="bg-paper-warm md:hairline-border border-y md:border-y-0 border-line-soft py-4 px-4 md:py-2 md:px-3 md:rounded-sm flex items-center justify-between gap-2 -mx-4 sm:-mx-6 md:mx-0 mt-[-1px] md:mt-0">
                      <span className="font-label-caps text-label-caps text-ink-mute shrink-0">{t("pokedex.role")}</span>
                      <span className="font-body-base text-body-base text-ink-soft text-right">{en ? active.roleEn : active.roleZh}</span>
                    </div>
                  )}
                  {active.specialtyEn && active.specialtyEn !== "—" && (
                    <div className="bg-paper-warm md:hairline-border border-y md:border-y-0 border-line-soft py-4 px-4 md:py-2 md:px-3 md:rounded-sm flex items-center justify-between gap-2 -mx-4 sm:-mx-6 md:mx-0 mt-[-1px] md:mt-0">
                      <span className="font-label-caps text-label-caps text-ink-mute shrink-0">{t("pokedex.specialty")}</span>
                      <span className="font-body-base text-body-base text-primary text-right">{en ? active.specialtyEn : active.specialtyZh}</span>
                    </div>
                  )}

                  {/* 「生態進化解鎖配方」 Habitat & Food formula section */}
                  {(() => {
                    const formula = getEvolutionFormula(active);
                    if (!formula) return null;
                    return (
                      <div className="bg-paper-warm md:hairline-border border-y md:border-y-0 border-line-soft py-5 px-4 md:py-4 md:px-4 md:rounded-sm md:col-span-2 -mx-4 sm:-mx-6 md:mx-0 mt-[-1px] md:mt-0 flex flex-col gap-3">
                        <div className="font-label-caps text-label-caps text-primary flex items-center gap-2 border-b border-line-soft pb-2 font-bold tracking-wider">
                          <span className="material-symbols-outlined text-[18px]">biotech</span>
                          {en ? "HABITAT & FOOD EVOLUTION FORMULA" : "「生態進化解鎖配方」"}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="bg-surface-container-high/60 p-2.5 rounded border border-line-soft/60">
                            <div className="font-mono-metadata text-[10px] text-ink-faint uppercase tracking-wider mb-1">
                              {en ? "Friendship Level" : "友情等級需求"}
                            </div>
                            <div className="text-xs font-bold text-ink-soft">
                              {formula.friendship}
                            </div>
                          </div>
                          <div className="bg-surface-container-high/60 p-2.5 rounded border border-line-soft/60">
                            <div className="font-mono-metadata text-[10px] text-ink-faint uppercase tracking-wider mb-1">
                              {en ? "Target Furniture" : "指定特化家具"}
                            </div>
                            <div className="text-xs font-bold text-primary">
                              {en ? formula.furnitureEn : formula.furnitureZh}
                            </div>
                          </div>
                          <div className="bg-surface-container-high/60 p-2.5 rounded border border-line-soft/60">
                            <div className="font-mono-metadata text-[10px] text-ink-faint uppercase tracking-wider mb-1">
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
                        <div className={`font-label-caps text-label-caps flex items-center gap-2 border-b border-line-soft pb-2 font-bold tracking-wider ${conflict.hasConflict ? "text-[#a53a2c]" : "text-emerald-700"}`}>
                          <span className="material-symbols-outlined text-[18px]">{conflict.hasConflict ? "warning" : "check_circle"}</span>
                          {en ? "ECOLOGICAL CO-HABITATION WARNING" : "「物種舒適與鄰近衝突警告」"}
                        </div>
                        {conflict.hasConflict ? (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 bg-red-50/50 border border-red-200/50 p-2 rounded">
                              <span className="font-mono-metadata text-[10px] text-[#a53a2c] font-bold uppercase shrink-0">
                                {en ? "Incompatible Nearby:" : "已知本能相剋對象:"}
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
                              <span className="material-symbols-outlined text-emerald-600 text-[16px] mt-0.5 animate-pulse">verified</span>
                              <span>{en ? conflict.reasonEn : conflict.reasonZh}</span>
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
                <p className={`font-body-base text-body-base text-ink-soft leading-relaxed transition-all ${expandReadMore ? "" : "line-clamp-3 mb-2"}`}>
                  {en ? active.descriptionEn : active.descriptionZh}
                </p>
                <button
                  onClick={() => setExpandReadMore(!expandReadMore)}
                  className="text-left font-label-caps text-label-caps text-primary hover:text-tertiary transition-colors mb-md self-start"
                >
                  {expandReadMore ? (i18n.language.startsWith('en') ? 'Show Less' : '顯示較少') : (i18n.language.startsWith('en') ? 'Read More' : '閱讀更多')}
                </button>
                <div className="mt-auto border-t border-dashed border-line-soft pt-sm">
                 <p className="font-mono-metadata text-mono-metadata text-ink-faint flex items-center justify-start gap-2 flex-wrap mb-1">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">link</span>{i18n.language === "en" ? "Source:" : "資料出處:"}</span>
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
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
