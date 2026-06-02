const fs = require('fs');

const homePath = 'public/data/home.json';
const guidePath = 'public/data/guide.json';

const homeData = JSON.parse(fs.readFileSync(homePath, 'utf8'));
const oldFeatured = homeData.featured;

// Set new featured
homeData.featured = {
  date: "03/10",
  tag: "歷史軌跡 | META REPORT",
  image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/250.png",
  titleEn: "Pokopia's Historic Launch: Breaking All Metacritic & Sales Records",
  titleZh: "打破歷史紀錄的奇蹟：《Pokopia》開發背景與 NS2 銷量神話",
  excerptEn: "A behind-the-scenes look at the unprecedented collaboration between Game Freak and Omega Force. See how they achieved a record-breaking 2.2 million sales in just 4 days and claimed the highest Metacritic score in franchise history.",
  excerptZh: "深入剖析 Game Freak 與 Koei Tecmo 旗下 Omega Force 團隊的史詩級合作。本作不但創下 NS2 首發四天賣破 220 萬套、單月突破 400 萬套的銷售奇蹟，更在 Metacritic 奪下寶可夢系列史上最高評分。",
  author: "Game Freak × Omega Force",
  readTime: 5,
  link: "/guide?id=meta-history"
};

// Add old featured to news as the first item
homeData.news.unshift({
  id: 0,
  tagEn: "WORLD REPORT",
  tagZh: "世界觀",
  number: "00",
  titleEn: oldFeatured.titleEn,
  titleZh: oldFeatured.titleZh,
  image: oldFeatured.image,
  updatedAgoEn: "3/5",
  updatedAgoZh: "3 月 5 日",
  link: oldFeatured.link
});

// Update id and numbers in news
homeData.news.forEach((item, index) => {
  item.id = index + 1;
  item.number = String(index + 1).padStart(2, '0');
});

fs.writeFileSync(homePath, JSON.stringify(homeData, null, 2), 'utf8');

const guideData = JSON.parse(fs.readFileSync(guidePath, 'utf8'));

// Add new guide
guideData.guides.unshift({
  id: "meta-history",
  vol: "VIII",
  categoryEn: "Meta History",
  categoryZh: "歷史與開發秘辛",
  titleEn: "The Sales Miracle & Meta-Achievements of NS2 Launch",
  titleZh: "NS2 首發神話：跨界聯手與打破歷史的評價紀錄",
  subtitleEn: "An analytical report on the groundbreaking collaboration that birthed Pokémon Pokopia, detailing its record sales and critical acclaim.",
  subtitleZh: "《寶可夢 Pokopia》作為任天堂 Switch 2 (NS2) 平臺首發陣容的重磅衍生作，不僅達成了商業空前成功，更在評價上締造傳奇。",
  stats: {
    "optimalTimeEn": "Launch Window (March 2026)",
    "optimalTimeZh": "2026 年 3 月首發期",
    "successRate": "98% OpenCritic"
  },
  relatedIds: [],
  sections: [
    {
      id: "development",
      roman: "I.",
      titleEn: "The Dream Team: Game Freak x Omega Force",
      titleZh: "夢幻聯手：Game Freak 與 Omega Force",
      contentEn: "Conceived directly by Shigeru Ohmori, the game merged traditional Pokémon charm with the acclaimed sandbox expertise of Koei Tecmo's Omega Force (creators of Dragon Quest Builders).",
      contentZh: "本作由《寶可夢 朱／紫》總監大森滋（Shigeru Ohmori）親自構思，並由 Game Freak 與具備豐富沙盒建造遊戲經驗的 Koei Tecmo 旗下 Omega Force 團隊（曾操刀《勇者鬥惡龍 創世小玩家》）共同開發，碰撞出前所未有的火花。",
      steps: []
    },
    {
      id: "sales",
      roman: "II.",
      titleEn: "Record-Breaking NS2 Launch",
      titleZh: "NS2 平臺首發銷售奇蹟",
      contentEn: "Released on March 5, 2026, it sold over 2.2 million copies in just four days, cementing itself as one of the fastest-selling titles in the console's history.",
      contentZh: "於 2026 年 3 月 5 日隨 NS2 全球發行後，短短四天銷量便突破 220 萬套（日本單一市場即佔 100 萬套），並於當月全球突破 400 萬套，成為 Switch 2 平臺的現象級大作。",
      steps: []
    },
    {
      id: "critical-acclaim",
      roman: "III.",
      titleEn: "History's Highest Metacritic Score",
      titleZh: "突破寶可夢歷史的超高評價",
      contentEn: "With universal critical acclaim, it achieved the highest Metacritic score of any Pokémon title ever, backed by a 98% recommendation rate on OpenCritic.",
      contentZh: "在評價方面，本作在評價網站 Metacritic 與 OpenCritic 上獲得了「普遍好評」，打破了寶可夢系列歷史上的最高分數紀錄，並且高達 98% 的影評人一致推薦此作。",
      steps: []
    }
  ]
});

fs.writeFileSync(guidePath, JSON.stringify(guideData, null, 2), 'utf8');
console.log('Successfully updated home.json and guide.json');
