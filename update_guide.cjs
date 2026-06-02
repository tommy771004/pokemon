const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/data/guide.json', 'utf8'));

// 1. Move root level images to sections
data.guides.forEach(guide => {
  if (guide.image && guide.sections.length > 1) {
    if (!guide.sections[1].image) {
      guide.sections[1].image = guide.image;
    }
  }
});

// 2. Add some more images and expand information based on docs
const newGuides = [];

// Expand beginner-tips
const beginner = data.guides.find(g => g.id === 'beginner-tips');
if (beginner) {
  beginner.sections[0].image = {
    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    captionEn: "Bulbasaur is highly recommended for starting farmers due to its Leafage skill.",
    captionZh: "妙蛙種子因具備「栽種」與「樹葉」專長，也是新手農夫非常推薦的開局選擇。"
  };
  beginner.sections[1].image = {
    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/569.png",
    captionEn: "Trubbish & Garbodor form the backbone of your automated trash-to-iron factory line.",
    captionZh: "灰塵山、長尾怪手與皮卡丘是前中期的自動化鐵礦生產三人組，能大幅提升生產效率。"
  };
  beginner.sections[1].contentZh = "初期的產線規劃決定了建設速度。建議盡早佈置長草棲息地以提升「環境等級」。當你開始面臨資源短缺時，務必設法湊齊「灰塵山＋長尾怪手＋皮卡丘」的超級自動化生產三人組。長尾怪手負責搬運，皮卡丘負責發電照明，而灰塵山與破破袋能將垃圾不斷轉化為鐵礦，解決中期鐵錠短缺的大麻煩。";
  
  beginner.sections[2].contentZh = "隱藏的 QoL 機制：只要將「收納箱」放置在距離「工作台」2 格的範圍以內，工作台就會自動讀取箱內的物資進行合成，不需手動挪到背包裡！這在巴哈姆特等社群廣受好評。此外，在進行大型整地或處理月亮伊布的 300 塊道路需求時，按住「ZR」鍵移動，即可在走過的路線上自動連續鋪設方塊。此外，你也能利用十字鍵快捷切換工作專長，來指派特定寶可夢幫忙燒礦。";
}

// Expand regional-walkthrough
const regional = data.guides.find(g => g.id === 'regional-walkthrough');
if (regional) {
  regional.sections[0].image = {
    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
    captionEn: "Squirtle's Water Gun is essential to hydrate Withered Wasteland.",
    captionZh: "傑尼龜的水槍能力是復育枯萎荒野不可或缺的核心技能。"
  };
  regional.sections[2].image = {
    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/126.png",
    captionEn: "Magmar provides the intense heat necessary to smelt Copper and forge essential tools.",
    captionZh: "鴨嘴火獸的強大火力能冶煉銅礦，對於岩石山脊的工業化開發至關重要。"
  };
  regional.sections[3].image = {
    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png",
    captionEn: "Dragonite will grant you Glide abilities after establishing a Waterside Boat habitat.",
    captionZh: "設立水邊小艇棲息地後，快龍能賦予玩家滑翔能力，橫越空島。"
  };
}

// Add Pokédex Info Guide
data.guides.push({
  id: "pokedex-ecology",
  vol: "VII",
  categoryEn: "Pokédex & Ecology",
  categoryZh: "圖鑑與生態百科",
  titleEn: "Mastering the Habitat Dex & Event Forms",
  titleZh: "深度圖鑑解析：棲息地條件與限時活動生態",
  subtitleEn: "Pokopia features over 300 Pokémon variants. This guide integrates community insights on habitat requirements, event forms, and milestone rewards.",
  subtitleZh: "Pokopia 擁有超過 300 種寶可夢型態。本篇彙整了各大社群資料庫的關鍵洞察，深度解析棲息地偏好、限時活動型態與圖鑑里程碑獎勵。",
  sections: [
    {
      "id": "habitat-dex",
      "roman": "I.",
      "titleEn": "The Habitat Dex: Precise Blueprints",
      "titleZh": "棲息地圖鑑：精密環境工程",
      "contentEn": "According to Nintendo Life's Complete Pokédex, every habitat has exact material requirements. For example, a 'Bench with Greenery' strictly requires 2 Hedges and 1 Chair. The OP.GG Pokopia Pokedex adds that Pokémon have specific environmental preferences (bright, humid, dark, dry, warm) that determine their spawn rarity from Common (C) to Very Rare (V). Knowing their \"Likes\" is crucial for raising Town Comfort Levels.",
      "contentZh": "根據 Nintendo Life 的完整棲息地圖鑑，每個棲息地都有極為精密的物件需求。例如，要吸引寶可夢至「有綠意的長椅」，你必須精準擺放 2 個樹籬與 1 張椅子。OP.GG 圖鑑進一步指出，寶可夢具備強烈的環境偏好（明亮、潮濕、黑暗、乾燥、溫暖等），這決定了牠們生成時的稀有度（C 至 V 級）。深入了解寶可夢的喜好，是提升城鎮舒適度的關鍵。",
      "image": {
        "src": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/51.png",
        "captionEn": "Dugtrio requires dry, rocky environments to spawn efficiently.",
        "captionZh": "三地鼠等寶可夢極度依賴乾燥且多岩石的環境條件。"
      }
    },
    {
      "id": "event-forms",
      "roman": "II.",
      "titleEn": "Event Forms & Seasonal Encounters",
      "titleZh": "限時活動型態與季節遭遇",
      "contentEn": "GameWith and Eurogamer maintain the 'Event Pokédex', documenting special forms tied to real-world seasons and limited-time events, such as the 'Jump Rope Challenge' or 'Limited-Time Quiz'. One notable example is the Hoppip family, which unlocks unique forms during March's 'More Spores' event. Always check the event board to ensure you don't miss these timed encounters.",
      "contentZh": "GameWith 與 Eurogamer 共同維護的「活動圖鑑」記錄了隨著現實季節推出的特殊型態。例如 GameWith 的前線資料庫，便收錄了諸如「大跳繩挑戰」或「期間限定問答」等限時活動。其中最著名的便是 3 月份的「毽子草的更多孢子」活動，能解鎖毽子草家族的獨有活動型態。這打破了單機遊戲的限制，為城鎮帶來長期的活力。"
    },
    {
      "id": "milestones",
      "roman": "III.",
      "titleEn": "Milestone Rewards & Generations",
      "titleZh": "圖鑑里程碑獎勵與世代分佈",
      "contentEn": "Pokopia.center's deep dive analysis reveals that the 300 Pokémon are carefully distributed across Gen 1 to Gen 9 regions (e.g., ~50 from Kanto, ~14 from Sinnoh). Hitting Pokédex milestones unlocks exclusive rewards: reaching 200, 250, and 300 registered Pokémon grants players special titles, advanced clothing cosmetics, and the 'Game Boy' component required for the Volcano Badge.",
      "contentZh": "Pokopia.center 的深度圖鑑分析揭示了這 300 隻寶可夢跨越了第 1 到第 9 世代（如關都約佔 50 隻，神奧約 14 隻）。達成圖鑑里程碑將解鎖限定獎勵：每收集 200、250 與 300 隻寶可夢，玩家就能獲取專屬稱號、高級訂製服飾，以及用來換取火山徽章的終極組件「Game Boy」。"
    }
  ]
});

// Write to JSON
fs.writeFileSync('public/data/guide.json', JSON.stringify(data, null, 2));

console.log('Expanded guide.json with more details and images.');
