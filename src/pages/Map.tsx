import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import Seo from "../components/Seo";
import MapBackdrop from "../components/MapBackdrop";
import ScrollFade from "../components/ScrollFade";
import { useFavorites } from "../hooks/useFavorites";
import ItemDistributionGuide from "../components/ItemDistributionGuide";

type SourceLink = {
  label: string;
  url: string;
};

type LocationEntry = {
  id: string;
  x: number;
  y: number;
  icon: string;
  type: "region" | "special";
  regionId: string;
  kind: Kind;
  levelEn: string;
  levelZh: string;
  categoryEn: string;
  categoryZh: string;
  nameEn: string;
  nameZh: string;
  summaryEn: string;
  summaryZh: string;
  descriptionEn: string;
  descriptionZh: string;
  objectivesEn: string[];
  objectivesZh: string[];
  requiredSkillsEn: string[];
  requiredSkillsZh: string[];
  resourceFocusEn: string[];
  resourceFocusZh: string[];
  notablePokemonEn: string[];
  notablePokemonZh: string[];
  unlocksEn: string[];
  unlocksZh: string[];
  tagsEn: string[];
  tagsZh: string[];
  tagIcons: string[];
  sourceLinks: SourceLink[];
};

type Kind = "region" | "special-site" | "megaproject" | "legendary-project" | "event";

type Region = {
  id: string;
  nameEn: string;
  nameZh: string;
  icon: string;
  color: string;
};

type Collectible = {
  key: string;
  labelEn: string;
  labelZh: string;
  icon: string;
  count: number;
  color: string;
  byRegion?: Record<string, number>;
};

type CollectibleItem = {
  id: string;
  regionId: string;
  category: string;
  nameJa: string;
  titleEn: string;
  descEn: string;
  rewardJa: string;
  locationJa: string;
  image: string;
};

type MapData = {
  mapId: string;
  statusTickerEn: string;
  statusTickerZh: string;
  regions: Region[];
  collectibles: Collectible[];
  locations: LocationEntry[];
};

const POKEMON_ROSTER_POOL = [
  { id: "p1", nameEn: "Conkeldurr", nameZh: "修建老匠", specialties: ["build"], icon: "construction", descEn: "Heavy-grade building expert.", descZh: "重工建造大師，擅長大型工事基底。" },
  { id: "p2", nameEn: "Pikachu", nameZh: "皮卡丘", specialties: ["generate"], icon: "bolt", descEn: "Consistent low-voltage output.", descZh: "穩定的低壓發電，適合敏感電網調試。" },
  { id: "p3", nameEn: "Peakychu", nameZh: "皮卡丘", specialties: ["generate"], icon: "star", descEn: "Leader-spec electrical general.", descZh: "領袖級特殊電能型，電瓶電網之魂。" },
  { id: "p4", nameEn: "Magnemite", nameZh: "小磁怪", specialties: ["generate"], icon: "electrical_services", descEn: "Floating electromagnetic balancer.", descZh: "懸浮電磁力能手，可修補局部磁力漏洞。" },
  { id: "p5", nameEn: "Pidgeot", nameZh: "大比鳥", specialties: ["fly"], icon: "flight", descEn: "Wide-area high-altitude sweepers.", descZh: "廣域高空翱翔，提供精準的地形測繪。" },
  { id: "p6", nameEn: "Dragonite", nameZh: "快龍", specialties: ["fly"], icon: "air", descEn: "Ultra-heavy load glider.", descZh: "超重型載物滑翔，能在空中搬運重型建材。" },
  { id: "p7", nameEn: "Charizard", nameZh: "噴火龍", specialties: ["burn", "fly"], icon: "mode_fan", descEn: "Can smelt ore and fly logistics.", descZh: "兼具熔煉礦石與高空物流搬運雙重職能。" },
  { id: "p8", nameEn: "Magmar", nameZh: "鴨嘴火獸", specialties: ["burn"], icon: "whatshot", descEn: "Ultra-high temp metallurgy support.", descZh: "極限高溫熱力源，為金屬重工冶煉提供原動力。" },
  { id: "p9", nameEn: "Blastoise", nameZh: "水箭龜", specialties: ["build"], icon: "water_drop", descEn: "Hydro-hydraulic landscape stabilizer.", descZh: "高壓水力阻尼，有效調節地熱或土壤水分。" },
  { id: "p10", nameEn: "Lapras", nameZh: "拉普拉斯", specialties: ["freeze", "transport"], icon: "bubble_chart", descEn: "Glacial waterside resource mover.", descZh: "寒冰水路運輸，提供安全、低溫的物資防護。" },
  { id: "p11", nameEn: "Glaceon", nameZh: "冰伊布", specialties: ["freeze"], icon: "ac_unit", descEn: "Precision cryo-cell thermal barrier.", descZh: "精準低溫冷凝防護，防止電極或熱能過載。" },
  { id: "p12", nameEn: "Sneasel", nameZh: "狃拉", specialties: ["freeze", "crush"], icon: "grid_view", descEn: "Fast frozen ice cutter.", descZh: "極速切冰能手，利爪能將冰岩分解成標準模組。" },
  { id: "p13", nameEn: "Machamp", nameZh: "怪力", specialties: ["build", "transport"], icon: "fitness_center", descEn: "Four-arm rapid material layer.", descZh: "四手搬運大師，同時兼任土木搭建與多維阻尼調整。" },
  { id: "p14", nameEn: "Geodude", nameZh: "小拳石", specialties: ["crush"], icon: "terrain", descEn: "Standard heavy rock crusher.", descZh: "標準重力碎巖工，擅長粉碎雜石網格。" },
  { id: "p15", nameEn: "Golem", nameZh: "隆隆岩", specialties: ["crush"], icon: "circle", descEn: "Seismic excavation breaker.", descZh: "震盪式開挖能手，可以瞬間擊破大型岩體。" },
  { id: "p16", nameEn: "Onix", nameZh: "大岩蛇", specialties: ["crush"], icon: "hive", descEn: "Subterranean foundation excavator.", descZh: "地下基底挖掘巨獸，用於開鑿排融溝渠道。" },
  { id: "p17", nameEn: "Raichu", nameZh: "雷丘", specialties: ["generate"], icon: "bolt", descEn: "Heavy lightning generator.", descZh: "重型電網發電機，提供源源不斷的大幅額外電流。" },
  { id: "p18", nameEn: "Ivysaur", nameZh: "妙蛙草", specialties: ["build"], icon: "nature", descEn: "Organic binder and soil anchoring.", descZh: "有機纖維黏合，為地盤提供強大的土木錨定點。" }
];

const KIND_META: Record<Kind, { en: string; zh: string; icon: string }> = {
  "region": { en: "Region", zh: "生態區域", icon: "public" },
  "special-site": { en: "Special Site", zh: "特殊據點", icon: "star" },
  "megaproject": { en: "Megaproject", zh: "大型工程", icon: "domain" },
  "legendary-project": { en: "Legendary Project", zh: "傳說工程", icon: "foundation" },
  "event": { en: "Event", zh: "隨機事件", icon: "shuffle" },
};
const KIND_ORDER: Kind[] = ["region", "special-site", "megaproject", "legendary-project", "event"];

const CATEGORY_NAMES_ZH: Record<string, string> = {
  "yellow-pokeball": "黃色精靈球",
  "red-pokeball": "紅色精靈球",
  "magazine": "雜誌（研究錄）",
  "diary": "日記",
  "newspaper": "報紙",
  "letter": "書信",
  "note": "便條",
  "document": "研究文件",
  "photo": "照片紀錄",
};

const CATEGORY_NAMES_EN: Record<string, string> = {
  "yellow-pokeball": "Yellow Poké Ball",
  "red-pokeball": "Red Poké Ball",
  "magazine": "Magazine",
  "diary": "Diary",
  "newspaper": "Newspaper",
  "letter": "Letter",
  "note": "Note",
  "document": "Document",
  "photo": "Photo",
};

const EXACT_NAMES: Record<string, string> = {
  "インダストリアルなベッドのレシピ": "工業風床鋪的配方",
  "てつのイスのレシピ": "鐵椅的配方",
  "いしラインのゆかのレシピ": "石質條紋地板的配方",
  "とまり木のレシピ": "棲木的配方",
  "てつのテーブルのレシピ": "鐵桌的配方",
  "いしのかいだんのレシピ": "石製階梯的配方",
  "せんろのレシピ": "鐵軌的配方",
  "ポケメタル×5": "寶可金屬 × 5",
  "いしのりっぱなキット": "石製豪華套件",
  "ステージだい": "舞台平台",
  "おいしいみず×3": "美味之水 × 3",
  "エレガントなはなのタネ×5": "優雅花朵種子 × 5",
  "マメのタネ×5": "豆之種子 × 5",
  "ゆぐ口": "溫泉出水口",
  "ゆぐち": "溫泉出水口",
  "インダストリアルなチェア": "工業風單人椅",
  "せんろ×30": "鐵軌 × 30",
  "ふうせん×3": "氣球 × 3",
  "インダストリアルなベッド": "工業風床鋪",
  "しっとりいけがきのタネ×5": "潮濕樹籬種子 × 5",
  "快適ライフvol.866": "《舒適生活 vol.866》",
  "眼科ジャーナル春号": "《眼科期刊 春季號》",
  "ポケライフ開発記2": "《寶可生活開發記 2》",
  "ポケライフ開発記4": "《寶可生活開發記 4》",
  "週刊ゲット第8号": "《週刊 Get 第 8 期》",
  "R団したっぱ日記4": "《火箭隊手下日記 4》",
  "R団したっぱ日記5": "《火箭隊手下日記 5》",
  "とあるハカセの日記4": "《某博士的日記 4》",
  "とあるシェフの日記": "《某廚師的日記》",
  "ヒマリの日記": "《陽葵的日記》",
  "人工温泉オープン！": "《人工溫泉開幕！》",
  "ご当選のお知らせ": "《中獎通知》",
  "ヒデオへ": "《給 秀夫》",
  "明日の献立メモ": "《明日菜單備忘錄》",
  "計画中止の申し入れ": "《計劃終止申請書》",
  "どこかの写真5": "《某處的照片 5》",
  "なべのレシピ": "鍋子的配方",
  "モモンのタネ": "桃桃果種子",
  "月刊ジムリーダー7月号": "《月刊道館館主 7 月號》",
  "むしポケLOVE9月号": "《蟲寶可夢 LOVE 9 月號》",
  "あるハッカーの独り言4": "《某駭客的獨白 4》",
  "カズキへ": "《給 和樹》",
  "どこかの写真4": "《某處的照片 4》",
  "しかくタイルのレシピ": "方形瓷磚的配方",
  "ゴミばこのレシピ": "垃圾桶的配方",
  "ナチュラルなテーブルのレシピ": "自然風桌子的配方",
  "すなばのレシピ": "沙坑的配方",
  "リゾートなライトのレシピ": "度假風燈飾的配方",
  "ナチュラルなイスのレシピ": "自然風椅子的配方",
  "さんばしのレシピ\\u003cbr\\u003e木のかこいのレシピ": "棧橋的配方<br>木製圍欄的配方",
  "さんばしのレシピ<br>木のかこいのレシピ": "棧橋的配方<br>木製圍欄的配方",
  "でんちゅうのレシピ": "電線桿的配方",
  "スポットライトのレシピ": "聚光燈的配方",
  "ナチュラルなベッドのレシピ": "自然風床鋪的配方",
  "めざましどけいのレシピ": "鬧鐘的配方",
  "ふねのハンドルのレシピ": "船舵的配方",
  "せんぷうき": "電風扇",
  "レンガのカベ×30": "磚牆 × 30",
  "げんきないけがきのタネ": "元氣樹籬種子",
  "木のクロスドア×4": "木製十字門 × 4",
  "でんちゅう×5": "電線桿 × 5",
  "カゴのタネ": "零餘果種子",
  "てんじょうせんぷうき": "吊扇",
  "ナチュラルなクローゼット": "自然風衣櫃",
  "リゾートなテーブル": "度假風桌子",
  "レジ×2": "收銀機 × 2",
  "ヤドンのラグ": "呆呆獸地毯",
  "ピカチュウソファ": "皮卡丘沙發",
  "コンテスト優勝！": "《大賽奪冠！》",
  "極上の船旅を": "《極致的船旅》",
  "特集インタビュー！": "《獨家專訪！》",
  "ポケライフ開発記3": "《寶可生活開發記 3》",
  "新規入会者募集！": "《招募新會員！》",
  "夜の一人歩きには注意！": "《深夜出行請注意！》",
  "R団したっぱ日記2": "《火箭隊手下日記 2》",
  "R団したっぱ日記3": "《火箭隊手下日記 3》",
  "マチスの素顔に迫る！": "《揭秘馬志士的真面目！》",
  "とあるハカセの日記3": "《某博士的日記 3》",
  "船乗りツヨシの日記": "《水手剛司的日記》",
  "あるハッカーの独り言1": "《某駭客的獨白 1》",
  "あるハッカーの独り言2": "《某駭客的獨白 2》",
  "ゴミ分別標語こどもの部": "《垃圾分類標語 兒童組》",
  "クチバ4年連続1位に": "《枯葉市連續 4 年蟬聯第一》",
  "つり好きな弟よ": "《給喜愛釣魚的弟弟》",
  "7月30日18時の投稿": "《7 月 30 日 18 點的貼文》",
  "開店準備に必要なこと": "《開店準備須知》",
  "どこかの写真3": "《某處的照片 3》",
  "オフィスのデスクのレシピ": "辦公室書桌的配方",
  "オフィスのキャビネットのレシピ": "辦公室置物櫃的配方",
  "スクラップのレシピ": "廢料的配方",
  "オフィスのイスのレシピ": "辦公室椅子的配方",
  "オフィスのテーブルのレシピ": "辦公室桌子的配方",
  "レアポケメタル": "稀有寶可金屬",
  "おそうじセット": "清潔套組",
  "き黄色い小屋キット": "黃色小屋套件",
  "きいろいこやキット": "黃色小屋套件",
  "たくましいはなのタネ": "強壯花朵種子",
  "ポップなベッド": "繽紛風床鋪",
  "しゃれたいけがきのタネ": "時髦樹籬種子",
  "ようこうろ": "熔岩爐",
  "マンホール×3": "人孔蓋 × 3",
  "せっかいせき×5": "石灰石 × 5",
  "てつのハシゴ×10": "鐵扶梯 × 10",
  "けんびきょう": "顯微鏡",
  "カベつきスイッチ": "壁掛開關",
  "わた×3": "棉花 × 3",
  "きんののべぼう": "金條",
  "カベかけモニター": "壁掛螢幕",
  "R団したっぱ日記6": "《火箭隊手下日記 6》",
  "R団したっぱ日記7": "《火箭隊手下日記 7》",
  "ゲームコーナーだより": "《ゲームコーナーだより》",
  "週刊からておう第48号": "《週刊空手道王 第 48 期》",
  "ポケライフ開発記5": "《寶可生活開發記 5》",
  "とあるハカセの日記6": "《某博士的日記 6》",
  "あるハッカーの独り言5": "《某駭客的獨白 5》",
  "あるハッカーの独り言6": "《某駭客的獨白 6》",
  "再開タマムシデパート": "《重新營業的彩虹百貨公司》",
  "大安売りセール！！": "《限時大拍賣！！》",
  "ナツメ映画出演！？": "《娜姿出演電影！？》",
  "コラム今週の見どころ": "《專欄：本週精彩看點》",
  "ユウトへ": "《給 勇人》",
  "観察メモ": "《觀察備忘錄》",
  "今日のポリゴン2メモ": "《今日的多邊獸II備忘錄》",
  "どこかの写真6": "《某處的照片 6》",
  "どこかの写真7": "《某處的照片 7》",
  "木のベッドのレシピ": "木床的配方",
  "ほしくさのこしかけのレシピ": "乾草矮凳的配方",
  "ダウジングマシン": "探寶器",
  "ほしくさのテーブルのレシピ": "乾草桌子的配方",
  "木のながイスのレシピ": "木製長椅的配方",
  "木のクロスドアのレシピ": "木質十字門的配方",
  "みずおけのレシピ": "水桶的配方",
  "さんばしのいたのレシピ": "棧橋木板的配方",
  "キノコのがいとうのレシピ": "蘑菇路燈的配方",
  "ピンクのこやキット": "粉紅色小屋套件",
  "しゅうのうボックス": "收納箱",
  "つみあげわら×10": "堆疊稻草 × 10",
  "みんなのボックス": "共用收納箱",
  "モクローどけい": "木木梟時鐘",
  "アーチタイル×20": "拱形瓷磚 × 20",
  "みまもりカメラ": "監視器",
  "かわいいいけがきのタネ×3": "可愛樹籬種子 × 3",
  "つたひも×2": "藤蔓繩 × 2",
  "ほそながキャンドル": "細長蠟燭",
  "さらさらいわ": "沙沙岩石",
  "たいまつ": "火把",
  "つみあげわら": "堆疊稻草",
  "なんと庭から...": "《沒想到庭院裡居然...》",
  "フレンドリィショップより": "《來自友好商店》",
  "ポケライフ開発記1": "《寶可生活開發記 1》",
  "ポケモンのあいさつ特集": "《寶可夢問候特輯》",
  "R団したっぱ日記1": "《火箭隊手下日記 1》",
  "R団したっぱ日記8": "《火箭隊手下日記 8》",
  "今年のトレンドはこれ！": "《今年的流行趨勢就是這個！》",
  "カスミの素顔に迫る！": "《揭秘小霞的真面目！》",
  "キイチのにっき": "《喜一的日記》",
  "とあるハカセの日記1": "《某博士的日記 1》",
  "とあるハカセの日記2": "《某博士的日記 2》",
  "あるハッカーの独り言3": "《某駭客的獨白 3》",
  "通行止めのお知らせ": "《道路封閉告示》",
  "伝説のニンジャ一族": "《傳說中的忍者一族》",
  "エレナへ": "《給 艾蓮娜》",
  "つり好きの兄貴へ": "《給喜愛釣魚的哥哥》",
  "生活の質を上げるコツ": "《提升生活品質的小訣竅》",
  "したっぱ日記・構想メモ": "《手下日記・構想備忘錄》",
  "だれかの日記1": "《某人的日記 1》",
  "カラナクシの生育レポート": "《無殼海兔培育報告》",
  "どこかの写真2": "《某處的照片 2》",
  // Rewards
  "りかけいおとこのコーデ": "理科男套裝",
  "エモート「にこにこ」": "表情「微笑」",
  "いしのおとこコーデ": "登山男套裝",
  "ふなのりコーデ": "水手套裝",
  "エモート「ばいばい！」": "表情「拜拜！」",
  "レンジャーコーデ": "護林員套裝",
  "ロケット団コーデ": "火箭隊套裝",
  "からておうコーデ": "空手道王套裝",
  "エスパーレディコーデ": "超能力女郎套裝",
  "エモート「ここ！」": "表情「這裡！」",
  "エモート「やあ！」": "表情「嗨！」",
  "髪型「しちさん」": "髮型「三七分」",
  "髪型「おてんば」": "髮型「活潑短髮」",
  "ニンジャコーデ": "忍者套裝",
};

const EXACT_LOCATIONS: Record<string, string> = {
  "マップ北側にある建物内": "地圖北側的建築物內",
  "マップ北側にある建物内から入れる洞窟": "從地圖北側建築物內進入的洞窟",
  "マップ西側にある洞窟内": "地圖西側的洞窟內",
  "マップ南側の4本柱付近": "地圖南側的四根柱子附近",
  "マップ東側にあるゲート付近": "地圖東側的大門附近",
  "マップ南側の建物内のハシゴとロープで登った先": "順著地圖南側建築物內的梯子與繩索攀爬上去的頂端",
  "マップ北側博物館の1F本棚裏の隠し通路": "地圖北側博物館 1F 書櫃後方的隱藏通道",
  "マップ北側にある建物付近": "地圖北側的建築物附近",
  "ポケセン周辺(ヨクバリスのお願い「シェフの調理場」を作成したあとに出現)": "寶可夢中心周邊（在完成藏飽栗鼠的委託「主廚廚房」後出現）",
  "マップ南側の建物内": "地圖南側的建築物內",
  "ポケモンセンターから西側の空洞内": "寶可夢中心西側的空洞內",
  "ポケモンセンターから南側の建物内": "寶可夢中心南側的建築物內",
  "ポケモンセンターから北側へ進んだ階段付近": "寶可夢中心北側階梯附近",
  "マップ南側の廃墟内": "地圖南側的廢墟內",
  "マップ北側にある建物から洞窟に入る手前": "地圖北側在從建築物進入洞窟前的位置",
  "マップ北側にある建物内の壁に埋もれたドアの先": "地圖北側建築物內藏於牆壁的暗門後方",
  "地下洞窟東の小部屋からハシゴを登った先": "從地下洞窟東側小房間爬上梯子的頂端",
  "洞窟内のモンスターボールマークの柱をかいりきで押した先": "用「怪力」推開洞窟內印有精靈球圖案的柱子後方",
  "ポケモンセンターの西側から入れる地下洞窟の先": "從寶可夢中心西側進入的地下洞窟深處",
  "地下洞窟のロープを下って岩砕きで入れる場所": "順著地下洞窟的繩索滑下、使用「碎岩」可進入的區域",
  "地下洞窟の溶岩地帯を超えた先のクリスタル部屋": "穿過地下洞窟熔岩地帶後的晶石房間",
  "マップ中央にある高台の建物内": "地圖中央高台的建築物內",
  "マップ南側にある船の舵輪前": "地圖南側船隻的舵輪前方",
  "マップ東側の等の中": "地圖東側的塔內",
  "マップ南側にある船の甲板前の部屋": "地圖南側船隻靠近甲板前的房間",
  "マップ西側の廃墟内": "地圖西側的廢墟內",
  "ポケモンセンターから北側に向かったの海沿い": "從寶可夢中心往北走的海岸沿線",
  "マップ南側の海岸沿い": "地圖南側的海岸沿線",
  "マップ中央にある建物跡地内": "地圖中央的建築遺跡內",
  "マップ西側の発電施設付近": "地圖西側的發電設施附近",
  "マップ北東側の洞窟をなみのりで進んだ先": "利用「衝浪」穿過地圖東北側洞窟後的盡頭",
  "マップ南側にある船の奧の部屋": "地圖南側船隻最深處的房間",
  "マップ南側にある船の奥の部屋": "地圖南側船隻最深處的房間",
  "マップ南東の島の高台": "地圖東南側島嶼的高台",
  "マップ東側の広場にある岩砕きで流れる滝裏": "地圖東側廣場上、用「碎岩」擊碎岩石後流出的瀑布後方",
  "ポケモンセンター周辺": "寶可夢中心周邊",
  "マップ中央付近にある川沿い": "地圖中央附近的河流沿線",
  "マップ南側に浮かんでいる足場の上": "地圖南側上方的浮空平台上",
  "マップ東側の廃墟内": "地圖東側的廢墟內",
  "マップ中央のクラフト台がある廃墟内": "地圖中央設有工作臺的廢墟內",
  "マップ北側のゲート付近": "地圖北側的大門附近",
  "マップ中央のビルの階段を上がった先": "地圖中央大樓走上階梯的盡頭",
  "マップ東側の島の橋下": "地圖東側島嶼的橋下",
  "マップ北西側の鉄の階段を下った先": "地圖西北側走下鐵階梯的盡頭",
  "マップ北側の道場の中": "地圖北側的道場內",
  "ビルの横のマンホールから入れる隠し道の奥": "大樓旁人孔蓋下方隱藏通道的深處",
  "ポケモンセンターの島とビルの島を繋ぐ道の崖下": "連接寶可夢中心島嶼和大樓島嶼的道路懸崖下方",
  "マップ北西側の空洞内": "地圖西北側的空洞內",
  "マップ東側のゲート近くの建物": "地圖東側大門附近的建築物",
  "ポケモンセンターから東に歩いた先": "從寶可夢中心往東步行前方的盡頭",
  "マップ南東の鉄鉱脈付近": "地圖東南側的鐵礦脈附近",
  "マップ東側の島の洞窟入口前": "地圖東側島嶼的洞窟入口前方",
  "マップ北側の道場前の滝の裏道": "地圖北側道場前方瀑布的後方秘道",
  "マップ東側のリフト付近の廃墟内": "地圖東側吊椅纜車附近的廢墟內",
  "マップ東側の島のゲート付近": "地圖東側島嶼的大門附近",
  "マップ東側の島の廃墟内": "地圖東側島嶼的廢墟內",
  "マップ北西側の白い天井が開けた建物": "地圖西北側露天白色屋頂的建築物",
  "ポケモンセンターから東のカラフルな塔の看板裏": "從寶可夢中心往東彩色塔的招牌後方",
  "マップ東側の高台付近": "地圖東側的高台附近",
  "マップ北側のゲート付近建物内": "地圖北側大門附近的建築物內",
  "マップ南側の海岸沿いの崖内側": "地圖南側海岸沿線的懸崖內側",
  "ポケモンセンターから北側のベンチ隣": "寶可夢中心北側長椅旁邊",
  "マップ西側の建物跡地内": "地圖西側的建築遺跡內",
  "マップ北側ゲート付近の金網を壊して入れる地下道で岩砕きをした先": "地圖北側大門附近破壞鐵絲網進入地下道，再使用「碎岩」後的盡頭",
  "マップ北東側の高台付近": "地圖東北側的高台附近",
  "ポケモンセンターから北東側へ進んだ先の隠し洞窟の中": "寶可夢中心東北方向前進的隱藏洞窟內",
  "マップ中央のクラフト台付近のツタを登った先": "地圖中央工作臺附近攀爬藤蔓上去的頂端",
  "マップ西側の高台にある墓石周辺": "地圖西側高台上的墓石周圍",
  "ポケモンセンターから西側の廢墟": "寶可夢中心西側的廢墟",
  "ポケモンセンターから西側の廃墟": "寶可夢中心西側的廢墟",
  "マップ北側のゲート付近の金網を壊して入れる地下道の奥": "破壞地圖北側大門附近的鐵絲網進入地下道的深處",
  "マップ西側のまっさらな街入口付近": "地圖西側空無一物的小鎮入口附近",
  "マップ東側の小屋跡地": "地圖東側的木屋遺跡",
  "マップ南側の灯台が見える高台": "地圖南側可以眺望燈塔的高台",
  "海沿いの棧橋上": "海岸沿線的棧橋上",
  "海沿いの桟橋上": "海岸沿線的棧橋上",
  "マップ東側ゲート付近の小屋跡地": "地圖東側大門附近的木屋遺跡",
  "エンディング後に入手": "通關遊戲後方可取得",
  "パサパサこうやのポケモンセンター修理後": "修復乾巴巴荒野的寶可夢中心後",
  "マップ西側にある高台のベンチ付近": "地圖西側高台的長椅附近",
};

function translateJaToZh(ja: string): string {
  if (!ja) return "";
  const clean = ja.trim();
  if (EXACT_NAMES[clean]) {
    return EXACT_NAMES[clean];
  }
  let zh = ja;
  const dict: [RegExp | string, string][] = [
    [/のレシピ/g, "的配方"],
    [/レシピ/g, "配方"],
    [/インダストリアルな/g, "工業風"],
    [/てつの/g, "鐵製"],
    [/いしの/g, "石製"],
    [/木の/g, "木製"],
    [/ナチュラルな/g, "自然風"],
    [/リゾートな/g, "度假風"],
    [/ベッド/g, "床"],
    [/チェア/g, "椅"],
    [/イス/g, "椅"],
    [/こしかけ/g, "矮凳"],
    [/テーブル/g, "桌"],
    [/デスク/g, "辦公桌"],
    [/階段/g, "階梯"],
    [/かいだん/g, "階梯"],
    [/レール/g, "鐵軌"],
    [/せんろ/g, "鐵軌"],
    [/ポケメタル/g, "寶可金屬"],
    [/キット/g, "套件"],
    [/タネ/g, "種子"],
    [/はなの/g, "花之"],
    [/ゴミばこ/g, "垃圾桶"],
    [/すなば/g, "沙坑"],
    [/ライト/g, "燈"],
    [/ふうせん/g, "氣球"],
    [/おいしいみず/g, "美味之水"],
    [/おそうじセット/g, "清潔套組"],
    [/きいろいこや/g, "黃色小屋"],
    [/ようこうろ/g, "熔岩爐"],
    [/マンホール/g, "人孔蓋"],
    [/てつのハシゴ/g, "鐵扶梯"],
    [/けんびきょう/g, "顯微鏡"],
    [/カベつきスイッチ/g, "壁掛開關"],
    [/きんののべぼう/g, "金條"],
    [/カベかけモニター/g, "壁掛螢幕"],
    [/ヤドンのラグ/g, "呆呆獸地毯"],
    [/ピカチュウソファ/g, "皮卡丘沙發"],
    [/オフィスの/g, "辦公室的"],
    [/キャビネット/g, "櫃子"],
    [/スクラップ/g, "廢料"],
    [/レアポケメタル/g, "稀有寶可金屬"],
  ];
  for (const [key, val] of dict) {
    zh = zh.replace(key, val);
  }
  return zh;
}

function translateLocationToZh(ja: string): string {
  if (!ja) return "";
  const clean = ja.trim();
  if (EXACT_LOCATIONS[clean]) {
    return EXACT_LOCATIONS[clean];
  }
  let zh = ja;
  const dict: [RegExp | string, string][] = [
    [/マップ北側/g, "地圖北側"],
    [/マップ南側/g, "地圖南側"],
    [/マップ東側/g, "地圖東側"],
    [/マップ西側/g, "地圖西側"],
    [/にある建物内/g, "的建築物內"],
    [/にある建物付近/g, "的建築物附近"],
    [/から入れる洞窟/g, "進入的洞窟"],
    [/洞窟内/g, "洞窟內"],
    [/船の/g, "船上的"],
    [/部屋/g, "房間"],
    [/室/g, "室"],
    [/ゲート付近/g, "傳送門/大門附近"],
    [/から北側へ進んだ/g, "往北前進的"],
    [/階段付近/g, "階梯附近"],
    [/ポケモンセンター周辺/g, "寶可夢中心周邊"],
    [/ポケセン周辺/g, "寶可夢中心周邊"],
    [/ポケモンセンターから/g, "從寶可夢中心"],
    [/の海沿い/g, "海岸沿線"],
    [/海岸沿い/g, "海岸沿線"],
    [/滝裏/g, "瀑布後面"],
    [/滝の裏道/g, "瀑布後方秘道"],
    [/廃墟内/g, "廢墟內"],
    [/建物跡地内/g, "建築遺跡內"],
    [/発電施設付近/g, "發電設施附近"],
    [/洞窟をなみのりで進んだ先/g, "透過「衝浪」方能深入的洞窟盡頭"],
    [/の島/g, "的島嶼"],
    [/高台/g, "高台"],
    [/の川沿い/g, "的河流沿線"],
    [/に浮かんでいる足場の上/g, "上浮空的平台上"],
    [/ビルの横/g, "大樓旁邊"],
    [/マンホールから入れる/g, "從人孔蓋進入的"],
    [/隠し道の奥/g, "隱藏通道深處"],
    [/ビルの階段を上がった先/g, "上大樓階梯的盡頭"],
    [/道場の中/g, "道場內"],
    [/リフト付近/g, "電梯/纜車附近"],
    [/鉄 of 階梯 /g, "鐵扶梯"],
    [/鉄の階段を下った先/g, "走下鐵階梯的盡頭"],
    [/カラフルな塔/g, "彩色塔"],
    [/看板裏/g, "看板後面"],
  ];
  for (const [key, val] of dict) {
    zh = zh.replace(key, val);
  }
  return zh;
}

export default function MapPage() {
  const { i18n } = useTranslation();
  const [data, setData] = useState<MapData | null>(null);
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);
  const [active, setActive] = useState<LocationEntry | null>(null);
  const [showIndex, setShowIndex] = useState(false);

  const [regionFilter, setRegionFilter] = useState<Set<string>>(new Set());
  const [kindFilter, setKindFilter] = useState<Set<string>>(new Set());
  const [hideVisited, setHideVisited] = useState(false);
  const { favorites: visited, toggleFavorite: toggleVisited } = useFavorites("pokopia-map-visited");

  const [items, setItems] = useState<CollectibleItem[]>([]);
  const [showCollectibles, setShowCollectibles] = useState(false);
  const [activeItem, setActiveItem] = useState<CollectibleItem | null>(null);

  // New features: Local Item Distribution Checklist
  const [popupTab, setPopupTab] = useState<"items" | "info" | "build">("items");
  const [selectedItemInModal, setSelectedItemInModal] = useState<CollectibleItem | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const { favorites: collectedItems, toggleFavorite: toggleItemCollected } = useFavorites("pokopia-map-items-collected");

  useEffect(() => {
    if (active) {
      const regItems = items.filter(
        (it) => it.regionId === active.regionId || it.regionId === active.id
      );
      setSelectedItemInModal(regItems[0] ?? null);
      setPopupTab("items");
      setActiveCategoryFilter(null);
    } else {
      setSelectedItemInModal(null);
    }
  }, [active, items]);

  const toggleFilter = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  // New States for "Rebuild the Huge Building"
  const [hugeBuildingFloor, setHugeBuildingFloor] = useState<"2F" | "3F" | "4F">("2F");
  const [hugeBuildingProgress, setHugeBuildingProgress] = useState<Record<"2F" | "3F" | "4F", number>>({
    "2F": 100, // assume 2F starts solved or fully prepared
    "3F": 0,
    "4F": 0,
  });
  const [hugeBuildingTimerActive, setHugeBuildingTimerActive] = useState(false);
  const [hugeBuildingTimeRemaining, setHugeBuildingTimeRemaining] = useState<number>(3600); // 1 hour in seconds
  const [hugeBuildingMultiplier, setHugeBuildingMultiplier] = useState<number>(1); // 1x or 120x speed for testing

  // New States for 15-member Pokémon workforce on legendary bird altars
  const [selectedAltarCrew, setSelectedAltarCrew] = useState<Record<string, string[]>>({
    "altar-of-flame": [],
    "abandoned-power-plant": [],
    "freezing-chambers": [],
  });

  useEffect(() => {
    let interval: any = null;
    if (hugeBuildingTimerActive) {
      interval = setInterval(() => {
        setHugeBuildingTimeRemaining((prev) => {
          const next = prev - hugeBuildingMultiplier;
          if (next <= 0) {
            setHugeBuildingTimerActive(false);
            setHugeBuildingProgress((prevProgress) => ({
              ...prevProgress,
              [hugeBuildingFloor]: 100,
            }));
            return 3600; // Reset for next floor
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hugeBuildingTimerActive, hugeBuildingMultiplier, hugeBuildingFloor]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [
      String(h).padStart(2, "0"),
      String(m).padStart(2, "0"),
      String(s).padStart(2, "0")
    ].join(":");
  };

  useEffect(() => {
    fetch("/data/map.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  useEffect(() => {
    fetch("/data/map_collectibles.json")
      .then((res) => res.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]));
  }, []);

  const en = i18n.language === "en";
  const seoTitle = en ? "Exploration Map & Region Routes | Pokopia Chronicles" : "探索地圖與區域路線 | Pokopia 年代記";
  const seoDescription = en
    ? "Explore Pokopia's core regions, hidden murals, legendary bird megaprojects, and Dream Islands with objectives, skills, resources, and unlock routes."
    : "探索 Pokopia 的主線區域、夢幻壁畫、三神鳥大型工地與夢境群島，檢視任務目標、需求技能、資源與解鎖路線。";

  if (!data) {
    return (
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia map", "Pokopia regions", "Dream Islands", "Huge Building", "Empty Town"]}
      />
    );
  }

  const locations = data.locations ?? [];
  const entryCount = String(locations.length).padStart(2, "0");

  const regions = data.regions ?? [];
  const collectibles = data.collectibles ?? [];
  const collectibleView = collectibles
    .map((c) => {
      const entries = Object.entries(c.byRegion ?? {}) as [string, number][];
      const view =
        regionFilter.size === 0
          ? c.count
          : entries.reduce((s, [rid, n]) => (regionFilter.has(rid) ? s + n : s), 0);
      return { ...c, view };
    })
    .filter((c) => c.view > 0);
  const collectiblesViewTotal = collectibleView.reduce((s, c) => s + c.view, 0);
  const collectibleScopeLabel =
    regionFilter.size === 0
      ? en
        ? "all regions"
        : "全區域"
      : regionFilter.size === 1
        ? (() => {
            const r = regions.find((x) => regionFilter.has(x.id));
            return r ? (en ? r.nameEn : r.nameZh) : en ? "1 region" : "1 區域";
          })()
        : en
          ? `${regionFilter.size} regions`
          : `${regionFilter.size} 區域`;
  const visibleLocations = locations.filter((loc) => {
    const regionOk = regionFilter.size === 0 || regionFilter.has(loc.regionId);
    const kindOk = kindFilter.size === 0 || kindFilter.has(loc.kind);
    const visitedOk = !hideVisited || !visited.has(loc.id);
    return regionOk && kindOk && visitedOk;
  });
  const filtersActive = regionFilter.size > 0 || kindFilter.size > 0 || hideVisited;

  const collectibleMeta: Record<string, { color: string; icon: string; labelEn: string; labelZh: string }> =
    Object.fromEntries(
      collectibles.map((c) => [c.key, { color: c.color, icon: c.icon, labelEn: c.labelEn, labelZh: c.labelZh }])
    );
  const regionName = (rid: string) => {
    const r = regions.find((x) => x.id === rid);
    return r ? (en ? r.nameEn : r.nameZh) : rid;
  };
  const regionCenter = (rid: string) => {
    const l = locations.find((x) => x.regionId === rid && x.kind === "region");
    return l ? { x: l.x, y: l.y } : { x: 50, y: 50 };
  };
  const visibleItems = items.filter((it) => regionFilter.size === 0 || regionFilter.has(it.regionId));
  // deterministic sunflower scatter around each region's centre
  const itemPos: Record<string, { x: number; y: number }> = {};
  {
    const groups: Record<string, CollectibleItem[]> = {};
    for (const it of items) (groups[it.regionId] ??= []).push(it);
    for (const rid of Object.keys(groups)) {
      const c = regionCenter(rid);
      const arr = groups[rid];
      arr.forEach((it, k) => {
        const r = 13 * Math.sqrt((k + 0.5) / arr.length);
        const ang = k * 2.399963229728653;
        itemPos[it.id] = {
          x: Math.max(4, Math.min(96, c.x + r * Math.cos(ang) * 0.95)),
          y: Math.max(6, Math.min(94, c.y + r * Math.sin(ang) * 0.8)),
        };
      });
    }
  }

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia map", "Pokopia regions", "Dream Islands", "Huge Building", "Empty Town", "Legendary birds"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: seoTitle,
          description: seoDescription,
          url: "https://pokemoninfoperfer.vercel.app/map",
          inLanguage: en ? "en" : "zh-Hant",
          about: "Pokopia exploration map and location archive",
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter relative mt-10">
        <header className="col-span-1 md:col-span-12 mb-lg">
          <div className="hairline-bottom pb-sm flex justify-between items-end gap-4">
            <div>
              <span className="font-mono-metadata text-mono-metadata text-primary block mb-2 tracking-widest uppercase">
                {en ? "Cartography Archive" : "製圖檔案"}
              </span>
              <h1 className="font-display-lg text-display-lg text-on-surface">
                {en ? "Exploration Map" : "探索地圖"}
              </h1>
            </div>
            <div className="text-right hidden sm:block">
              <span className="font-mono-metadata text-mono-metadata text-ink-mute block uppercase">
                {en ? "Indexed Sites" : "已建檔地點"}
              </span>
              <span className="font-body-italic text-body-italic text-primary">{entryCount}</span>
            </div>
          </div>
        </header>

        <section className="col-span-1 md:col-span-12 mb-md">
          <div className="border hairline-border bg-paper-warm/40 p-4 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="font-mono-metadata text-mono-metadata text-ink-mute uppercase tracking-widest">
                  {en ? "Region" : "區域"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {regions.map((r) => {
                    const on = regionFilter.has(r.id);
                    return (
                      <button
                        key={r.id}
                        onClick={() => toggleFilter(setRegionFilter, r.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-sm border font-mono-metadata text-mono-metadata transition-colors min-h-[32px] ${
                          on
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-line-soft text-ink-soft hover:bg-bone"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }}></span>
                        {en ? r.nameEn : r.nameZh}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="font-mono-metadata text-mono-metadata text-ink-mute uppercase tracking-widest">
                  {en ? "Type" : "類型"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {KIND_ORDER.map((k) => {
                    const on = kindFilter.has(k);
                    return (
                      <button
                        key={k}
                        onClick={() => toggleFilter(setKindFilter, k)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-sm border font-mono-metadata text-mono-metadata transition-colors min-h-[32px] ${
                          on
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-line-soft text-ink-soft hover:bg-bone"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">{KIND_META[k].icon}</span>
                        {en ? KIND_META[k].en : KIND_META[k].zh}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-3">
              <label className="flex items-center gap-2 cursor-pointer select-none min-h-[32px]">
                <input
                  type="checkbox"
                  checked={hideVisited}
                  onChange={(e) => setHideVisited(e.target.checked)}
                  className="accent-primary w-4 h-4"
                />
                <span className="font-mono-metadata text-mono-metadata text-ink-soft uppercase tracking-wider">
                  {en ? "Hide visited" : "隱藏已造訪"}
                </span>
              </label>
              <div className="flex items-center gap-3 font-mono-metadata text-mono-metadata text-ink-mute">
                <span>
                  {en
                    ? `${visibleLocations.length}/${locations.length} shown · ${visited.size} visited`
                    : `顯示 ${visibleLocations.length}/${locations.length} · 已造訪 ${visited.size}`}
                </span>
                {filtersActive && (
                  <button
                    onClick={() => {
                      setRegionFilter(new Set());
                      setKindFilter(new Set());
                      setHideVisited(false);
                    }}
                    className="text-primary hover:opacity-80 uppercase tracking-wider"
                  >
                    {en ? "Reset" : "重設"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="col-span-1 md:col-span-7 flex flex-col space-y-md relative h-full">
          <div
            className="border hairline-border bg-paper relative overflow-hidden group min-h-[340px] md:min-h-[560px] flex flex-col"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 24%, rgba(165, 58, 44, 0.12), transparent 24%), radial-gradient(circle at 78% 70%, rgba(188, 142, 68, 0.15), transparent 22%), radial-gradient(circle at 54% 12%, rgba(76, 120, 90, 0.12), transparent 20%), linear-gradient(to right, var(--color-line-soft) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line-soft) 1px, transparent 1px)",
              backgroundSize: "auto, auto, auto, 38px 38px, 38px 38px",
            }}
          >
            <div className="absolute top-0 right-0 bg-paper-warm hairline-border border-t-0 border-r-0 px-3 py-1 z-20">
              <span className="font-mono-metadata text-mono-metadata text-ink-mute">{data.mapId}</span>
            </div>

            <div className="relative flex-grow overflow-hidden">
              <MapBackdrop />

              {visibleLocations.map((loc) => (
                <button
                  key={loc.id}
                  onMouseEnter={() => setHoveredTarget(loc.id)}
                  onMouseLeave={() => setHoveredTarget(null)}
                  onClick={() => setActive(loc)}
                  title={en ? loc.nameEn : loc.nameZh}
                  className="absolute flex flex-col items-center z-10 transition-transform duration-300 hover:scale-110 -translate-x-1/2 -translate-y-1/2"
                  style={{ top: `${loc.y}%`, left: `${loc.x}%` }}
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors relative bg-bone/80 backdrop-blur-sm ${
                      hoveredTarget === loc.id || active?.id === loc.id
                        ? "border-primary border-solid border-2 text-primary scale-110"
                        : loc.type === "region"
                          ? "border-2 border-solid border-primary/70 text-primary"
                          : "border border-dashed border-ink-mute text-ink-soft"
                    }`}
                  >
                    {loc.type === "region" && <div className="absolute -inset-1 rounded-full bg-primary/20 animate-ping"></div>}
                    <span className="material-symbols-outlined text-[20px] relative z-10">{loc.icon}</span>
                    {visited.has(loc.id) && (
                      <span className="absolute -top-1 -right-1 bg-[#3d5a45] text-white rounded-full w-4 h-4 flex items-center justify-center material-symbols-outlined text-[11px] z-20">
                        check
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-mono-metadata text-mono-metadata text-ink-soft bg-bone/85 px-2 py-1 mt-1 rounded-sm transition-opacity whitespace-nowrap pointer-events-none ${
                      hoveredTarget === loc.id || active?.id === loc.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {en ? loc.nameEn : loc.nameZh}
                  </span>
                </button>
              ))}

              {showCollectibles &&
                visibleItems.map((it) => {
                  const meta = collectibleMeta[it.category];
                  const pos = itemPos[it.id];
                  if (!pos) return null;
                  const isPokeball = it.category.endsWith("pokeball");
                  return (
                    <button
                      key={"item-" + it.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveItem(it);
                      }}
                      title={en ? it.titleEn || it.nameJa : it.nameJa}
                      className="absolute z-[5] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 shadow-sm transition-transform hover:scale-[1.6] hover:z-20"
                      style={{
                        top: `${pos.y}%`,
                        left: `${pos.x}%`,
                        width: isPokeball ? 9 : 7,
                        height: isPokeball ? 9 : 7,
                        backgroundColor: meta?.color ?? "#a35a3a",
                      }}
                    />
                  );
                })}
            </div>

            <div className="border-t hairline-top p-6 flex justify-between items-center z-10 relative flex-wrap gap-4 bg-surface/80 backdrop-blur-sm">
              <div className="flex flex-wrap gap-4 font-mono-metadata text-mono-metadata text-ink-mute uppercase">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  {en ? "Region" : "生態區域"}
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 border border-ink-mute border-dashed rounded-full mr-2"></span>
                  {en ? "Special Site" : "特殊據點"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowCollectibles((v) => !v)}
                  className={`font-label-caps text-label-caps transition-colors uppercase flex items-center gap-1.5 ${
                    showCollectibles ? "text-primary" : "text-ink-mute hover:text-ink-main"
                  }`}
                  aria-pressed={showCollectibles}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {showCollectibles ? "visibility" : "visibility_off"}
                  </span>
                  {en ? `Collectibles (${visibleItems.length})` : `收集物 (${visibleItems.length})`}
                </button>
                <button
                  onClick={() => setShowIndex(true)}
                  className="font-label-caps text-label-caps text-primary hover:opacity-80 transition-opacity uppercase"
                >
                  {en ? "View Index" : "檢視索引"}
                </button>
              </div>
            </div>
          </div>

          <div className="hairline-border bg-paper-warm overflow-hidden flex items-center h-8">
            <div className="bg-primary text-on-primary px-3 h-full flex items-center font-mono-metadata text-mono-metadata font-bold z-10 shrink-0">
              {en ? "Status" : "狀態"}
            </div>
            <div className="flex-grow overflow-hidden whitespace-nowrap relative">
              <div
                className="animate-[marquee_28s_linear_infinite] inline-block font-mono-metadata text-mono-metadata text-ink-soft"
                style={{ animation: "marquee 28s linear infinite" }}
              >
                {en ? data.statusTickerEn : data.statusTickerZh}
              </div>
            </div>
          </div>

          <div className="border hairline-border bg-paper p-4">
            <div className="flex items-center justify-between hairline-bottom pb-2 mb-3">
              <h3 className="font-label-caps text-label-caps text-ink-soft uppercase tracking-wider flex items-center gap-2 font-semibold">
                <span className="material-symbols-outlined text-primary text-[18px]">inventory_2</span>
                {en ? "Collectibles Index" : "收集物標註索引"}
              </h3>
              <span className="font-mono-metadata text-mono-metadata text-primary whitespace-nowrap">
                {collectiblesViewTotal} {en ? "marked" : "處"} · {collectibleScopeLabel}
              </span>
            </div>
            {collectibleView.length === 0 ? (
              <div className="border border-dashed border-line-soft bg-bone px-3 py-4 text-center font-mono-metadata text-mono-metadata text-ink-mute">
                {en ? "No catalogued collectibles in this region yet." : "此區域尚無建檔的收集物標註。"}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                {collectibleView.map((c) => (
                  <div
                    key={c.key}
                    className="flex items-center gap-2 bg-paper-warm/40 border border-line-soft rounded-sm px-2.5 py-1.5"
                  >
                    <span
                      className="material-symbols-outlined text-[16px] shrink-0"
                      style={{ color: c.color }}
                    >
                      {c.icon}
                    </span>
                    <span className="font-mono-metadata text-mono-metadata text-ink-soft truncate flex-grow">
                      {en ? c.labelEn : c.labelZh}
                    </span>
                    <span className="font-mono-metadata text-mono-metadata text-ink-mute font-bold shrink-0">
                      {c.view}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="col-span-1 md:col-span-5 flex flex-col space-y-md">
          <div className="flex justify-between items-end hairline-bottom pb-2">
            <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">
              {en ? "Key Locations" : "關鍵地點"}
            </h2>
            <span className="font-mono-metadata text-mono-metadata text-ink-mute">
              {entryCount} {en ? "Entries" : "筆資料"}
            </span>
          </div>

          <div className="flex flex-col space-y-sm">
            {visibleLocations.map((loc, idx) => (
              <ScrollFade key={loc.id} depth="none" delay={idx * 0.03} className="w-full">
                <article
                  className={`border hairline-border p-6 bg-paper relative group transition-colors duration-300 cursor-pointer hover:bg-bone ${
                    hoveredTarget === loc.id ? "ring-1 ring-primary z-20" : "z-10"
                  } ${visited.has(loc.id) ? "opacity-70" : ""}`}
                  onMouseEnter={() => setHoveredTarget(loc.id)}
                  onMouseLeave={() => setHoveredTarget(null)}
                  onClick={() => setActive(loc)}
                >
                  <AnimatePresence>
                    {hoveredTarget === loc.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-[calc(100%+0.5rem)] left-0 w-full bg-paper-warm border border-primary/30 rounded-sm p-4 shadow-lg pointer-events-none z-50"
                      >
                        <div className="font-label-caps text-sm text-primary uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-line-soft pb-2">
                          <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                          {en ? "Resource Yields Preview" : "主要資源產出預覽"}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(en ? loc.resourceFocusEn : loc.resourceFocusZh).map((res) => (
                            <span
                              key={res}
                              className="font-mono-metadata text-xs text-ink-soft bg-bone border border-line-soft px-2 py-1 rounded-sm shadow-sm"
                            >
                              {res}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="absolute top-sm right-sm text-right flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => toggleVisited(loc.id, e)}
                      title={en ? (visited.has(loc.id) ? "Mark unvisited" : "Mark visited") : (visited.has(loc.id) ? "標記未造訪" : "標記已造訪")}
                      aria-pressed={visited.has(loc.id)}
                      className={`material-symbols-outlined text-[18px] rounded-full w-7 h-7 flex items-center justify-center border transition-colors ${
                        visited.has(loc.id)
                          ? "bg-[#3d5a45] text-white border-[#3d5a45]"
                          : "text-ink-mute border-line-soft hover:text-primary hover:border-primary"
                      }`}
                    >
                      {visited.has(loc.id) ? "check" : "radio_button_unchecked"}
                    </button>
                    <span className="font-mono-metadata text-mono-metadata text-ink-mute border border-ink-mute px-2 py-0.5 rounded-full group-hover:text-ink-main group-hover:border-primary transition-colors">
                      {en ? loc.levelEn : loc.levelZh}
                    </span>
                  </div>
                  <div className="mb-3 pr-20 min-w-0">
                    <span className="font-body-italic text-body-italic text-ink-mute block mb-1 truncate">
                      {en ? loc.categoryEn : loc.categoryZh}
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface break-words">
                      {en ? loc.nameEn : loc.nameZh}
                    </h3>
                  </div>
                  <p className="font-body-base text-body-base text-ink-soft mb-4 line-clamp-3 break-words">
                    {en ? loc.summaryEn : loc.summaryZh}
                  </p>
                  <div className="flex flex-wrap gap-3 font-mono-metadata text-mono-metadata text-ink-mute border-t border-line-soft pt-3">
                    {(en ? loc.tagsEn : loc.tagsZh).map((tag, index) => (
                      <span key={tag} className="flex items-center">
                        <span className="material-symbols-outlined text-[14px] mr-1">{loc.tagIcons[index]}</span>
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              </ScrollFade>
            ))}
            {visibleLocations.length === 0 && (
              <div className="border border-dashed border-line-soft bg-bone p-6 text-center font-mono-metadata text-mono-metadata text-ink-mute">
                {en ? "No locations match the current filters." : "沒有符合目前篩選條件的地點。"}
              </div>
            )}
          </div>
        </section>

        {active && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink-soft/40 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <div
              className="bg-paper border hairline-border w-[95vw] md:max-w-7xl xl:max-w-[1380px] max-h-[90vh] overflow-y-auto relative flex flex-col lg:flex-row"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-sm right-sm z-10 text-ink-mute hover:text-primary transition-colors bg-paper/80 backdrop-blur-md rounded-full p-1 border border-line-soft"
                aria-label={en ? "Close" : "關閉"}
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="lg:w-[290px] bg-surface-container-high p-lg border-b lg:border-b-0 lg:border-r border-line flex flex-col justify-center relative shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-primary text-primary flex items-center justify-center bg-bone mb-md shadow-[0_0_40px_-10px_rgba(165,58,44,0.3)]">
                  <span className="material-symbols-outlined text-[48px] sm:text-[64px]">{active.icon}</span>
                </div>
                <span className="font-body-italic text-body-italic text-ink-mute block mb-xs">
                  {en ? active.categoryEn : active.categoryZh}
                </span>
                <h2 className="font-display-md text-display-md text-ink-soft leading-tight mb-md">
                  {en ? active.nameEn : active.nameZh}
                </h2>
                <span className="font-mono-metadata text-mono-metadata text-ink-mute border border-ink-mute px-3 py-1 rounded-full w-fit mb-md">
                  {en ? active.levelEn : active.levelZh}
                </span>
                <p className="font-body-base text-body-base text-ink-soft leading-relaxed">
                  {en ? active.summaryEn : active.summaryZh}
                </p>
              </div>

              <div className="lg:w-[calc(100%-290px)] p-6 md:p-12 xl:p-14 flex flex-col gap-9 flex-grow">
                {/* Tab Switch Headers */}
                <div className="flex flex-wrap border-b border-line-soft gap-2 pb-2 sticky top-0 bg-paper/95 backdrop-blur-md z-30 -mt-2">
                  <button
                    onClick={() => setPopupTab("items")}
                    className={`px-4 py-2.5 font-mono-metadata text-xs md:text-sm flex items-center gap-2 border-b-2 transition-all ${
                      popupTab === "items"
                        ? "border-primary text-primary font-bold bg-primary/5"
                        : "border-transparent text-ink-soft hover:text-ink-main hover:bg-[#ccdcb9]/20"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">map</span>
                    {en ? "Collectible Distribution" : "物品分佈與收集指南"}
                  </button>
                  <button
                    onClick={() => setPopupTab("info")}
                    className={`px-4 py-2.5 font-mono-metadata text-xs md:text-sm flex items-center gap-2 border-b-2 transition-all ${
                      popupTab === "info"
                        ? "border-primary text-primary font-bold bg-primary/5"
                        : "border-transparent text-ink-soft hover:text-ink-main hover:bg-[#ccdcb9]/20"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">explore</span>
                    {en ? "Area Walkthrough" : "冒險任務與技能需求"}
                  </button>
                  {(active.id === "huge-building" ||
                    active.id === "sparkling-skylands" ||
                    active.id === "altar-of-flame" ||
                    active.id === "abandoned-power-plant" ||
                    active.id === "freezing-chambers") && (
                    <button
                      onClick={() => setPopupTab("build")}
                      className={`px-4 py-2.5 font-mono-metadata text-xs md:text-sm flex items-center gap-2 border-b-2 transition-all ${
                        popupTab === "build"
                          ? "border-primary text-primary font-bold bg-primary/5"
                          : "border-transparent text-ink-soft hover:text-ink-main hover:bg-[#ccdcb9]/20"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">construction</span>
                      {en ? "Base Construction Sim" : "基地及祭壇營造模擬"}
                    </button>
                  )}
                </div>

                {/* --- TAB 1: ITEM DISTRIBUTION GUIDE --- */}
                {popupTab === "items" && (
                  <ItemDistributionGuide
                    active={active}
                    items={items}
                    locations={data?.locations || []}
                    en={en}
                    collectedItems={collectedItems}
                    toggleItemCollected={toggleItemCollected}
                    collectibles={data?.collectibles || []}
                  />
                )}

                {/* --- TAB 2: WALKTHROUGH & RESOURCE INFO --- */}
                {popupTab === "info" && (
                  <>
                    <ScrollFade depth="none" scaleEnabled={false} className="w-full">
                      <section className="bg-paper border hairline-border p-6 md:p-8">
                        <h3 className="font-label-caps text-label-caps text-primary mb-4 uppercase tracking-wider flex items-center gap-2 font-semibold">
                          <span className="material-symbols-outlined text-[20px]">explore</span>
                          {en ? "Area Description" : "區域詳情"}
                        </h3>
                        <p className="font-body-base text-body-base text-ink-soft leading-relaxed whitespace-pre-wrap">
                          {en ? active.descriptionEn : active.descriptionZh}
                        </p>
                      </section>
                    </ScrollFade>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-lg">
                  <ScrollFade depth="none" scaleEnabled={false}>
                    <section className="bg-paper-warm/40 border border-line-soft rounded-DEFAULT p-6 md:p-8 h-full hover:bg-paper-warm/60 transition-colors duration-300 shadow-sm flex flex-col">
                      <h3 className="font-label-caps text-label-caps text-ink-soft uppercase mb-4 tracking-wider flex items-center gap-2 font-semibold">
                        <span className="material-symbols-outlined text-primary text-[20px]">task_alt</span>
                        {en ? "Objectives" : "任務目標"}
                      </h3>
                      <ul className="space-y-3 flex-grow">
                        {(en ? active.objectivesEn : active.objectivesZh).map((item) => (
                          <li key={item} className="font-body-base text-body-base text-ink-soft leading-relaxed flex gap-2.5">
                            <span className="text-primary mt-1 select-none">✦</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </ScrollFade>

                  <ScrollFade depth="none" scaleEnabled={false}>
                    <section className="bg-paper-warm/40 border border-line-soft rounded-DEFAULT p-6 md:p-8 h-full hover:bg-paper-warm/60 transition-colors duration-300 shadow-sm flex flex-col">
                      <h3 className="font-label-caps text-label-caps text-ink-soft uppercase mb-4 tracking-wider flex items-center gap-2 font-semibold">
                        <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                        {en ? "Required Skills" : "需求技能"}
                      </h3>
                      <div className="flex flex-wrap gap-2.5">
                        {(en ? active.requiredSkillsEn : active.requiredSkillsZh).map((item) => (
                          <span
                            key={item}
                            className="font-mono-metadata text-mono-metadata text-ink-soft bg-bone border border-line-soft px-3 py-1.5 rounded-sm hover:-translate-y-0.5 hover:shadow-xs transition-all duration-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </section>
                  </ScrollFade>

                  <ScrollFade depth="none" scaleEnabled={false}>
                    <section className="bg-paper-warm/40 border border-line-soft rounded-DEFAULT p-6 md:p-8 h-full hover:bg-paper-warm/60 transition-colors duration-300 shadow-sm flex flex-col">
                      <h3 className="font-label-caps text-label-caps text-ink-soft uppercase mb-4 tracking-wider flex items-center gap-2 font-semibold">
                        <span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
                        {en ? "Resource Focus" : "重點資源"}
                      </h3>
                      <div className="flex flex-wrap gap-2.5">
                        {(en ? active.resourceFocusEn : active.resourceFocusZh).map((item) => (
                          <span
                            key={item}
                            className="font-mono-metadata text-mono-metadata text-ink-soft bg-bone border border-line-soft px-3 py-1.5 rounded-sm hover:-translate-y-0.5 hover:shadow-xs transition-all duration-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </section>
                  </ScrollFade>

                  <ScrollFade depth="none" scaleEnabled={false}>
                    <section className="bg-paper-warm/40 border border-line-soft rounded-DEFAULT p-6 md:p-8 h-full hover:bg-paper-warm/60 transition-colors duration-300 shadow-sm flex flex-col">
                      <h3 className="font-label-caps text-label-caps text-ink-soft uppercase mb-4 tracking-wider flex items-center gap-2 font-semibold">
                        <span className="material-symbols-outlined text-primary text-[20px]">pets</span>
                        {en ? "Notable Pokémon" : "關聯寶可夢"}
                      </h3>
                      <div className="flex flex-wrap gap-2.5">
                        {(en ? active.notablePokemonEn : active.notablePokemonZh).map((item) => (
                          <span
                            key={item}
                            className="font-mono-metadata text-mono-metadata text-ink-soft bg-bone border border-line-soft px-3 py-1.5 rounded-sm hover:-translate-y-0.5 hover:shadow-xs transition-all duration-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </section>
                  </ScrollFade>
                </div>

                <ScrollFade depth="none" scaleEnabled={false} className="w-full">
                  <section className="bg-paper border hairline-border p-6 md:p-8 mt-8">
                    <h3 className="font-label-caps text-label-caps text-ink-soft mb-4 uppercase tracking-wider flex items-center gap-2 font-semibold">
                      <span className="material-symbols-outlined text-primary text-[20px]">lock_open</span>
                      {en ? "Unlocks" : "解鎖內容"}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {(en ? active.unlocksEn : active.unlocksZh).map((item) => (
                        <span
                          key={item}
                          className="font-mono-metadata text-mono-metadata text-ink-soft bg-paper-warm/60 border border-line-soft px-4 py-2 rounded-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </section>
                </ScrollFade>
                  </>
                )}

                {popupTab === "build" && (
                  <>
                    {/* Rebuild the Huge Building Layer */}
                {(active.id === "huge-building" || active.id === "sparkling-skylands") && (
                  <ScrollFade depth="none" scaleEnabled={false} className="w-full">
                    <section className="bg-paper border hairline-border p-6 mt-8 relative overflow-hidden">
                      {/* Decorative Blueprint Background Accent */}
                      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none text-primary transform translate-x-1/4 translate-y-1/4">
                        <span className="material-symbols-outlined text-[320px]">domain</span>
                      </div>
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b hairline-bottom pb-4 mb-6 relative z-10">
                        <div>
                          <span className="font-mono-metadata text-xs text-primary uppercase tracking-widest block mb-2">
                            {en ? "BLUEPRINT OVERLAY LAYER" : "巨大建築・重建工程投影圖層"}
                          </span>
                          <h3 className="font-headline-sm text-2xl text-ink-main flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">layers</span>
                            {en ? "Tinkmaster's Huge Building Construction Office" : "巨鍛匠的巨型建築施工管制室"}
                          </h3>
                        </div>
                        <div className="flex gap-2 border hairline-border p-1">
                          {(["2F", "3F", "4F"] as const).map((floor) => (
                            <button
                              key={floor}
                              onClick={() => {
                                setHugeBuildingFloor(floor);
                                if (hugeBuildingProgress[floor] !== 100 && !hugeBuildingTimerActive) {
                                  setHugeBuildingTimeRemaining(3600);
                                }
                              }}
                              className={`px-4 py-2 font-mono-metadata text-xs uppercase tracking-widest transition-colors ${
                                hugeBuildingFloor === floor
                                  ? "bg-primary text-white"
                                  : "text-ink-mute hover:text-ink-main hover:bg-bone"
                              }`}
                            >
                              {floor}
                              {hugeBuildingProgress[floor] === 100 && " ✓"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Material requirements list */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
                        <div className="lg:col-span-6 flex flex-col gap-4">
                          <h4 className="font-mono-metadata text-xs text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                            {en ? `Required Materials for ${hugeBuildingFloor}` : `${hugeBuildingFloor} 工料清單`}
                          </h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b hairline-bottom">
                            {hugeBuildingFloor === "2F" && (
                              <>
                                <div className="bg-paper border hairline-border p-4 flex items-center justify-between transition-colors">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Concrete" : "混凝土"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">30 Units / 30 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Glass" : "玻璃"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">10 Units / 10 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Pokémetal" : "寶可金屬"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">5 Units / 5 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Iron Ingots" : "鐵錠"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">20 Units / 20 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                              </>
                            )}

                            {hugeBuildingFloor === "3F" && (
                              <>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Glow Stones" : "發光石"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">15 Units / 15 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Copper Ingots" : "銅錠"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">30 Units / 30 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-paper border hairline-border p-4 flex items-center justify-between transition-colors sm:col-span-2">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Concrete" : "混凝土"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">35 Units / 35 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                              </>
                            )}

                            {hugeBuildingFloor === "4F" && (
                              <>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Concrete" : "混凝土"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">40 Units / 40 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Glass" : "玻璃"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">15 Units / 15 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Paper" : "紙張"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">10 Units / 10 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Bricks" : "磚塊"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">10 Units / 10 單位</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                                <div className="bg-bone border border-line-soft p-3 rounded flex items-center justify-between sm:col-span-2">
                                  <div>
                                    <div className="text-xs font-bold text-ink-soft">{en ? "Lumber" : "木材"}</div>
                                    <div className="font-mono-metadata text-xs text-ink-mute">20 Units (From Scyther cuts) / 20 單位 (飛天螳螂砍伐)</div>
                                  </div>
                                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Mission Escort Lock Info */}
                          <div className="bg-[#ecdcb9]/30 border border-[#bfa46f]/60 p-4 rounded text-xs gap-2.5 flex flex-col">
                            <h5 className="font-bold text-ink-soft flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-primary text-[16px]">link</span>
                              {en ? "Mission Line Lock & Escort Requirements" : "任務鏈互鎖與護送條件"}
                            </h5>
                            
                            {hugeBuildingFloor === "2F" && (
                              <div className="text-ink-soft leading-relaxed flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-700 text-[16px]">check_circle</span>
                                <span>{en ? "No pre-requisite escorts required for 2F foundation casting." : "已就緒：2F 為標準地床澆補，不需要特定角色護送。"}</span>
                              </div>
                            )}

                            {hugeBuildingFloor === "3F" && (
                              <div className="flex flex-col gap-1.5 leading-relaxed">
                                <div className="flex items-center gap-2 font-semibold text-primary">
                                  <span className="material-symbols-outlined text-[16px]">person_pin_circle</span>
                                  <span>{en ? "Escort Lock: Chef Dente (凸隆隆山地主廚)" : "特定護送：主廚 Dente (Chef Dente)"}</span>
                                </div>
                                <p className="text-ink-mute pl-6">
                                  {en 
                                    ? "Requires completing Wheat Bread Strength rescue in Bulging Highlands first to unlock Chef Dente's heavy logistical transport sequence."
                                    : "已護送確認：必須先在「凸隆隆山地」烤製小麥麵包、取得怪力加成並斬開鐵鍊解救主廚 Dente，方可解鎖 3F 大型施工。"}
                                </p>
                              </div>
                            )}

                            {hugeBuildingFloor === "4F" && (
                              <div className="flex flex-col gap-1.5 leading-relaxed">
                                <div className="flex items-center gap-2 font-semibold text-primary">
                                  <span className="material-symbols-outlined text-[16px]">electric_bolt</span>
                                  <span>{en ? "Escort Lock: Peakychu (暗沉沉海邊發電員)" : "特定護送：皮卡丘 (暗沉沉海邊發電專長)"}</span>
                                </div>
                                <p className="text-ink-mute pl-6">
                                  {en 
                                    ? "Requires full Beach power-grid alignment and lighthouse water wheel repair to guide Peakychu to Skylands' vertical lift generator."
                                    : "已護送確認：必須先在「暗沉沉海邊」打通完整的發電網絡、修復燈塔水車，方可指引 Peakychu 前往空島激活 4F 終極垂吊發電機。"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Real-time progress bar countdown simulator */}
                        <div className="lg:col-span-6 bg-paper border border-line-soft p-5 rounded flex flex-col justify-between gap-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-mono-metadata text-xs text-ink-soft uppercase tracking-wider font-bold">
                                {en ? "Real-time Concrete Cure & Build Timer" : "工料現場固化與施工計時"}
                              </span>
                              <span className="bg-primary/10 text-primary font-mono text-xs px-2 py-0.5 rounded font-bold animate-pulse">
                                {en ? "1 HOUR REQUIRED" : "現實需要 1 小時"}
                              </span>
                            </div>

                            <p className="text-xs text-ink-mute leading-relaxed mb-4">
                              {en 
                                ? "Every skyscraper floor requires massive real-world concrete drying and material assembly time. Tap below to simulate regional project acceleration." 
                                : "摩天大樓每升一層均需要現實時間 1 小時進行高空物料固化與排班。可使用下方「時空加速器」模擬專案執行進度。"}
                            </p>

                            {/* Simulated progress slider or bar */}
                            <div className="bg-bone p-4 rounded border border-line-soft space-y-3">
                              <div className="flex justify-between items-end">
                                <div>
                                  <div className="font-mono-metadata text-xs text-ink-faint uppercase font-bold">
                                    {en ? "Current Cure State" : "固化與施工進度"}
                                  </div>
                                  <div className="text-lg font-bold text-on-surface">
                                    {hugeBuildingProgress[hugeBuildingFloor] === 100 
                                      ? "100.00% (Completed / 已完工)" 
                                      : `${Math.min(100, Math.max(0, ((3600 - hugeBuildingTimeRemaining) / 3600) * 100)).toFixed(2)}%`}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-mono-metadata text-xs text-ink-faint uppercase font-bold">
                                    {en ? "Time Remaining" : "賸餘等待時間"}
                                  </div>
                                  <kbd className="text-sm font-mono font-bold bg-ink-soft text-on-primary px-2 py-1 rounded">
                                    {hugeBuildingProgress[hugeBuildingFloor] === 100 ? "00:00:00" : formatTime(hugeBuildingTimeRemaining)}
                                  </kbd>
                                </div>
                              </div>

                              {/* Progress Bar Container */}
                              <div className="w-full h-3 bg-[#eadecd] rounded overflow-hidden relative">
                                <div 
                                  className="h-full bg-primary transition-all duration-300 relative"
                                  style={{ 
                                    width: `${
                                      hugeBuildingProgress[hugeBuildingFloor] === 100 
                                        ? 100 
                                        : ((3600 - hugeBuildingTimeRemaining) / 3600) * 100
                                    }%` 
                                  }}
                                >
                                  {hugeBuildingTimerActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite] bg-[length:200px_100%]"></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 pt-2 border-t border-line-soft">
                            {/* Speed toggles */}
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-ink-mute">{en ? "Simulation Speed:" : "模擬時空流速控制:"}</span>
                              <div className="flex gap-1 bg-[#ecdcb9]/40 p-0.5 rounded border border-[#bfa46f]/30">
                                <button
                                  type="button"
                                  onClick={() => setHugeBuildingMultiplier(1)}
                                  className={`px-2.5 py-0.5 rounded font-mono font-bold text-xs ${
                                    hugeBuildingMultiplier === 1 ? "bg-primary text-on-primary" : "text-ink-soft hover:bg-[#ccdcb9]/40"
                                  }`}
                                >
                                  1x (Real)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setHugeBuildingMultiplier(120)}
                                  className={`px-2.5 py-0.5 rounded font-mono font-bold text-xs ${
                                    hugeBuildingMultiplier === 120 ? "bg-primary text-on-primary" : "text-ink-soft hover:bg-[#ccdcb9]/40"
                                  }`}
                                  title={en ? "Compresses 1 hour into 30 seconds" : "將 1 小時壓縮為 30 秒快速預覽"}
                                >
                                  120x (Fast)
                                </button>
                              </div>
                            </div>

                            {/* Trigger Button */}
                            {hugeBuildingProgress[hugeBuildingFloor] === 100 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setHugeBuildingProgress((prev) => ({ ...prev, [hugeBuildingFloor]: 0 }));
                                  setHugeBuildingTimeRemaining(3600);
                                  setHugeBuildingTimerActive(false);
                                }}
                                className="w-full bg-[#3d5a45] text-on-primary font-mono-metadata text-xs font-bold py-3.5 px-4 rounded hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                              >
                                <span className="material-symbols-outlined text-[16px]">autorenew</span>
                                {en ? "Reset Build State for Simulation" : "重置本層進度重新進行模擬"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setHugeBuildingTimerActive(!hugeBuildingTimerActive)}
                                className={`w-full font-mono-metadata text-xs font-bold py-3.5 px-4 rounded transition-all flex items-center justify-center gap-1.5 ${
                                  hugeBuildingTimerActive
                                    ? "bg-[#be5a4a] text-on-primary shadow-sm hover:bg-[#be5a4a]/90"
                                    : "bg-primary text-on-primary shadow-md hover:bg-primary/95"
                                }`}
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  {hugeBuildingTimerActive ? "pause_circle" : "play_circle"}
                                </span>
                                {hugeBuildingTimerActive 
                                  ? (en ? "PAUSE TIME PROGRESS" : "暫停時空流程") 
                                  : (en ? "BEGIN FLOATING EXCAVATION & BUILD" : "啟動現即高空施工與材料澆灌")}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>
                  </ScrollFade>
                )}

                {/* Legendary Bird Megaproject 33x35 Grid Layout and 15 Pokémon Workforce Planner */}
                {(active.id === "altar-of-flame" || active.id === "abandoned-power-plant" || active.id === "freezing-chambers") && (
                  <ScrollFade depth="none" scaleEnabled={false} className="w-full">
                    <section className="bg-[#f0f4f8] border-2 border-x-0 sm:border-x-2 border-[#3c6ca5]/20 rounded-none sm:rounded-lg -mx-6 sm:mx-0 p-6 md:p-8 shadow-sm relative overflow-hidden">
                      
                      {/* Visual Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#3c6ca5]/10 pb-4 mb-6 relative z-10">
                        <div>
                          <span className="bg-[#3c6ca5]/10 text-[#305684] font-mono-metadata text-xs px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                            {en ? "ULTIMATE ALTAR BLUEPRINT LAYER" : "極限祭壇佈局與合工專長管制圖層"}
                          </span>
                          <h3 className="font-headline-sm text-headline-sm text-ink-soft mt-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#3c6ca5]">foundation</span>
                            {en ? `${active.nameEn} 33x35 Grid & Crew Dispatch` : `${active.nameZh} 33x35 網格佈置與隊伍派遣`}
                          </h3>
                        </div>
                        <div className="bg-[#e2eaf4] px-3.5 py-1.5 rounded text-xs shrink-0 font-mono font-bold text-[#305684]">
                          {en ? "GRID SIZE: 33x35 CELLS" : "佔地總規模：33x35 巨大網格"}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                        
                        {/* Left Column: 11x11 Grid Layout & Environmental Physics */}
                        <div className="lg:col-span-5 flex flex-col gap-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-mono-metadata text-xs text-[#305684] font-bold uppercase tracking-wider flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px]">grid_4x4</span>
                              {en ? "33x35 Layout Grid Viewer (11x11 Segment)" : "33x35 核心網格佈局剖面 (11x11)"}
                            </h4>
                            <span className="text-xs font-mono-metadata text-ink-mute uppercase">
                              {en ? "Coords: [X11-X22, Y12-Y23]" : "切片坐標系：[X11-X22, Y12-Y23]"}
                            </span>
                          </div>

                          {/* Interactive grid blocks diagram */}
                          <div className="bg-bone border border-[#3c6ca5]/30 p-4 rounded flex flex-col items-center justify-center gap-3">
                            <div className="grid grid-cols-11 gap-1 w-full max-w-[280px]">
                              {Array.from({ length: 121 }).map((_, index) => {
                                const r = Math.floor(index / 11);
                                const c = index % 11;
                                const isCore = r >= 3 && r <= 7 && c >= 3 && c <= 7;
                                let cellColor = "bg-stone-200/60";
                                let cellBorder = "border-stone-300";
                                
                                if (isCore) {
                                  if (active.id === "altar-of-flame") {
                                    cellColor = "bg-[#be5a4a]";
                                    cellBorder = "border-[#be5a4a]/80";
                                  } else if (active.id === "abandoned-power-plant") {
                                    cellColor = "bg-[#dcae4a]";
                                    cellBorder = "border-[#dcae4a]/80";
                                  } else {
                                    cellColor = "bg-[#5aa8be]";
                                    cellBorder = "border-[#5aa8be]/80";
                                  }
                                } else if (active.id === "altar-of-flame") {
                                  const isDiverter = r === 1 || r === 9 || c === 1 || c === 9;
                                  if (isDiverter) {
                                    cellColor = "bg-[#334e68]/75";
                                    cellBorder = "border-blue-900/60";
                                  } else if (r === 0 || r === 10 || c === 0 || c === 10) {
                                    cellColor = "bg-[#be5a4a]/25 animate-pulse";
                                    cellBorder = "border-[#be5a4a]/20";
                                  }
                                } else if (active.id === "abandoned-power-plant") {
                                  const isGap = c % 2 === 0 && r % 2 === 0;
                                  if (isGap) {
                                    cellColor = "bg-[#486581]";
                                    cellBorder = "border-slate-500";
                                  }
                                } else {
                                  const isInsulator = r === 2 || r === 8 || c === 2 || c === 8;
                                  if (isInsulator) {
                                    cellColor = "bg-[#e0f2fe]";
                                    cellBorder = "border-[#7dd3fc]";
                                  }
                                }

                                return (
                                  <div
                                    key={index}
                                    className={`aspect-square rounded-[3px] border text-[7px] font-mono flex items-center justify-center transition-all ${cellColor} ${cellBorder}`}
                                    title={`Cell [${r + 11}, ${c + 12}]`}
                                  >
                                    {isCore && index === 60 ? "★" : ""}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Grid legend */}
                            <div className="flex flex-wrap gap-4 text-xs font-mono-metadata text-ink-soft border-t border-[#3c6ca5]/10 pt-2 w-full justify-center">
                              <span className="flex items-center gap-1.5">
                                <span className={`w-2.5 h-2.5 rounded-xs border ${
                                  active.id === "altar-of-flame" ? "bg-[#be5a4a]" : active.id === "abandoned-power-plant" ? "bg-[#dcae4a]" : "bg-[#5aa8be]"
                                }`}></span>
                                {en ? "Altar Center Target" : "中央祭壇核心塊"}
                              </span>
                              {active.id === "altar-of-flame" && (
                                <>
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-xs border bg-[#334e68]/75"></span>
                                    {en ? "Bypass Trench" : "4格深防爆避災導流溝"}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-xs border bg-[#be5a4a]/20"></span>
                                    {en ? "Active Lava Flow" : "活火山高熱熔岩"}
                                  </span>
                                </>
                              )}
                              {active.id === "abandoned-power-plant" && (
                                <>
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-xs border bg-[#486581]"></span>
                                    {en ? "8px Spark Gaps" : "8px 磁場引極隙路"}
                                  </span>
                                </>
                              )}
                              {active.id === "freezing-chambers" && (
                                <>
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-xs border bg-[#e0f2fe] border-[#7dd3fc]"></span>
                                    {en ? "Insulator Shards" : "水晶防洩冷凝屏障"}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Environmental rules */}
                          <div className="bg-[#e9eff5] p-4 rounded border border-[#3c6ca5]/30 text-xs">
                            <h5 className="font-bold text-[#305684] flex items-center gap-1.5 mb-2">
                              <span className="material-symbols-outlined text-[16px]">info</span>
                              {en ? "Ecosystem Mechanics & Fluid Physics" : "本區極限佈局流體力學與危害管理"}
                            </h5>
                            
                            {active.id === "altar-of-flame" && (
                              <p className="text-ink-soft leading-relaxed">
                                {en 
                                  ? "Moltres's Altar requires carving 4-block-deep cooling ditches outside the 33x35 center matrix. High-temperature lava must be fully redirected to avoid melting materials and instantly resetting build cycles!"
                                  : "烈焰祭壇要求在 33x35 網格邊緣開鑿四格深的「防爆避災導流溝」。高溫火山熔岩必須引入外側水道，若溢流進入中央祭壇，將嚴重融毀所耗重金屬結構，導致施工計時器歸零。"}
                              </p>
                            )}

                            {active.id === "abandoned-power-plant" && (
                              <p className="text-ink-soft leading-relaxed">
                                {en 
                                  ? "Zapdos's generator demands strict 8px node spacing gaps for static wire structures. Any physical obstruction or conductive metal laying outside prescribed lines will spark electric arcs, scaring away workers."
                                  : "廢棄發電廠要求全區以精確 8px 物理間隙架置靜電特斯拉線圈。凡金屬方塊或線路排布不合，將引發高壓電弧起火，對 15 人施工隊伍產生致命恐慌，造成施工人員逃佚。"}
                              </p>
                            )}

                            {active.id === "freezing-chambers" && (
                              <p className="text-ink-soft leading-relaxed">
                                {en 
                                  ? "Articuno's ice chamber must encapsulate cold leak paths. 50 ice blocks must be immediately bordered by 10 harvested crystal shards, preventing environmental heating from surrounding rocky air flow."
                                  : "冰結之室必須採用內外隔熱法。將 50 快冰塊組入 10 水晶碎片構成的冷凝屏障中，以阻隔外部火山灰與地熱侵擾。若熱量洩漏，冰塊將急速氣化融化，清單材料亦會損毀。"}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right Column: 15 Pokémon dispatch panel & compliance counters */}
                        <div className="lg:col-span-7 flex flex-col gap-5">
                          
                          <div className="flex justify-between items-center bg-[#cae2fa]/40 border border-[#3c6ca5]/30 px-4 py-3.5 rounded-sm">
                            <div>
                              <div className="font-bold text-[#305684] text-sm">
                                {en ? "Dispatched Workers Count" : "派遣施工人員列表"}
                              </div>
                              <p className="text-xs text-ink-mute">
                                {en ? "15-member team configuration required for construction" : "必須精確選中 15 隻寶可夢合工，少一隻或多一隻都無法啟動"}
                              </p>
                            </div>
                            <span className={`font-mono font-bold text-lg px-2.5 py-1 rounded ${
                              (selectedAltarCrew[active.id] ?? []).length === 15 
                                ? "bg-emerald-700 text-on-primary animate-pulse" 
                                : "bg-[#3c6ca5] text-on-primary"
                            }`}>
                              {(selectedAltarCrew[active.id] ?? []).length} / 15
                            </span>
                          </div>

                          {/* Current 15-member workforce list */}
                          <div>
                            <span className="font-mono-metadata text-xs text-ink-mute uppercase font-bold block mb-2 tracking-wider">
                              {en ? "CURRENT WORKFORCE CREW (15 MAN SLOTS)" : "當前工作隊成員（共 15 個工人坑位）"}
                            </span>
                            
                            {(selectedAltarCrew[active.id] ?? []).length === 0 ? (
                              <div className="bg-bone border border-dashed border-line-soft p-6 rounded text-center text-xs text-ink-mute">
                                {en 
                                  ? "Roster is currently empty. Tap Pokémon cards below to assign workers to this altar project." 
                                  : "工作隊目前無人值守。請點擊下方「全能後備隊」卡片派遣專長精確的寶可夢入隊。"}
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2.5 max-h-[170px] overflow-y-auto bg-bone p-3 border border-line-soft rounded">
                                {(selectedAltarCrew[active.id] ?? []).map((pId) => {
                                  const pkmn = POKEMON_ROSTER_POOL.find((x) => x.id === pId);
                                  if (!pkmn) return null;
                                  return (
                                    <div 
                                      key={pId} 
                                      className="bg-paper shadow-xs border border-[#3c6ca5]/30 pl-2 pr-1.5 py-1.5 rounded flex items-center gap-2 text-xs transition-all hover:border-[#be5a4a] group shrink-0"
                                    >
                                      <span className="material-symbols-outlined text-[#3c6ca5] text-[16px]">{pkmn.icon}</span>
                                      <span className="font-bold text-ink-soft">{en ? pkmn.nameEn : pkmn.nameZh}</span>
                                      <div className="flex gap-0.5">
                                        {pkmn.specialties.map((spec) => (
                                          <span 
                                            key={spec} 
                                            className="bg-primary/10 text-primary text-[8px] font-mono px-1 rounded scale-90 uppercase"
                                            title={spec}
                                          >
                                            {spec === "build" && (en ? "Bld" : "建")}
                                            {spec === "burn" && (en ? "Brn" : "燃")}
                                            {spec === "generate" && (en ? "Gen" : "電")}
                                            {spec === "fly" && (en ? "Fly" : "飛")}
                                            {spec === "freeze" && (en ? "Frz" : "凍")}
                                            {spec === "crush" && (en ? "Crsh" : "碎")}
                                            {spec === "transport" && (en ? "Trsp" : "運")}
                                          </span>
                                        ))}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedAltarCrew((prev) => ({
                                            ...prev,
                                            [active.id]: prev[active.id].filter((x) => x !== pId),
                                          }));
                                        }}
                                        className="text-ink-mute hover:text-[#be5a4a] ml-1.5 focus:outline-none"
                                        title={en ? "Remove worker" : "撤除此工人"}
                                      >
                                        <span className="material-symbols-outlined text-[15px]">close</span>
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Live Workforce Specialty Checker */}
                          {(() => {
                            const crewIds = selectedAltarCrew[active.id] ?? [];
                            const crew = POKEMON_ROSTER_POOL.filter((x) => crewIds.includes(x.id));
                            const countSpec = (spec: string) => crew.filter((x) => x.specialties.includes(spec)).length;

                            const bldCount = countSpec("build");
                            const brnCount = countSpec("burn");
                            const genCount = countSpec("generate");
                            const flyCount = countSpec("fly");
                            const frzCount = countSpec("freeze");
                            const crshCount = countSpec("crush");
                            const trspCount = countSpec("transport");

                            let isRosterValid = false;
                            let checks = [] as Array<{ label: string; current: number; required: number; pass: boolean }>;

                            if (active.id === "altar-of-flame") {
                              checks = [
                                { label: en ? "Build Specialty (建造)" : "建造專長寶可夢", current: bldCount, required: 3, pass: bldCount >= 3 },
                                { label: en ? "Burn Specialty (燃燒)" : "燃燒/熔煉專長寶可夢", current: brnCount, required: 3, pass: brnCount >= 3 },
                                { label: en ? "Crush Specialty (粉碎)" : "粉碎開挖專長寶可夢", current: crshCount, required: 2, pass: crshCount >= 2 },
                                { label: en ? "Transport Specialty (運輸)" : "物資搬運專長寶可夢", current: trspCount, required: 2, pass: trspCount >= 2 },
                              ];
                              isRosterValid = crewIds.length === 15 && checks.every((c) => c.pass);
                            } else if (active.id === "abandoned-power-plant") {
                              checks = [
                                { label: en ? "Build Specialty (建造)" : "建造專長寶可夢", current: bldCount, required: 4, pass: bldCount >= 4 },
                                { label: en ? "Generate Specialty (發電)" : "發電/配電專長寶可夢", current: genCount, required: 4, pass: genCount >= 4 },
                                { label: en ? "Crush Specialty (粉碎)" : "粉碎開挖專長寶可夢", current: crshCount, required: 3, pass: crshCount >= 3 },
                                { label: en ? "Fly Specialty (飛行)" : "高空作業/飛行專長寶可夢", current: flyCount, required: 3, pass: flyCount >= 3 },
                              ];
                              isRosterValid = crewIds.length === 15 && checks.every((c) => c.pass);
                            } else {
                              checks = [
                                { label: en ? "Build Specialty (建造)" : "建造專長寶可夢", current: bldCount, required: 4, pass: bldCount >= 4 },
                                { label: en ? "Freeze Specialty (冰凍)" : "低溫冷凝/冰凍專長", current: frzCount, required: 5, pass: frzCount >= 5 },
                                { label: en ? "Crush Specialty (粉碎)" : "粉碎開挖專長寶可夢", current: crshCount, required: 3, pass: crshCount >= 3 },
                                { label: en ? "Transport Specialty (運輸)" : "物資搬運專長寶可夢", current: trspCount, required: 2, pass: trspCount >= 2 },
                              ];
                              isRosterValid = crewIds.length === 15 && checks.every((c) => c.pass);
                            }

                            return (
                              <div className="bg-paper border border-[#3c6ca5]/30 rounded p-4 space-y-3">
                                <div className="font-mono-metadata text-xs text-[#305684] uppercase font-bold tracking-wider border-b border-[#3c6ca5]/10 pb-2">
                                  {en ? "WORKFORCE SPECIALTY COMPLIANCE AUDIT" : "合工班專長審查標準"}
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  {checks.map((c, i) => (
                                    <div 
                                      key={i} 
                                      className={`flex items-center justify-between p-2 rounded border ${
                                        c.pass ? "bg-emerald-50 border-emerald-200/50 text-emerald-900" : "bg-red-50 border-red-200/50 text-red-900"
                                      }`}
                                    >
                                      <span className="truncate pr-2">{c.label}</span>
                                      <span className="font-mono font-bold shrink-0">
                                        {c.current} / {c.required} {c.pass ? "✓" : "✗"}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                {isRosterValid ? (
                                  <div className="bg-emerald-600 text-on-primary p-3 rounded text-center font-mono-metadata text-xs font-bold leading-relaxed shadow-sm animate-pulse flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">verified</span>
                                    {active.id === "altar-of-flame" && (
                                      <span>{en ? "🔥 CHOSEN ALTAR READY! MOLTRES RECRUITMENT PATHWAY PRIMED." : "🔥 烈焰祭壇就緒！火焰鳥召喚力能已達到臨界點！"}</span>
                                    )}
                                    {active.id === "abandoned-power-plant" && (
                                      <span>{en ? "⚡ TURBINES FULLY CHARGED! ZAPDOS RECRUITMENT PATHWAY PRIMED." : "⚡ 廢棄發電廠充能完畢！閃電鳥引雷震盪程序已就緒！"}</span>
                                    )}
                                    {active.id === "freezing-chambers" && (
                                      <span>{en ? "❄️ ICE BARRIERS ENCAPSULATED! ARTICUNO RECRUITMENT PATHWAY PRIMED." : "❄️ 冰結之室密封完成！急凍鳥冷凝喚醒程序已就緒！"}</span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded text-center font-body-base text-xs leading-relaxed flex items-start gap-2">
                                    <span className="material-symbols-outlined text-amber-600 text-[16px] mt-0.5 shrink-0">lock</span>
                                    <span className="text-left font-semibold">
                                      {en 
                                        ? `Awaiting exact 15 dispatched workers meeting the criteria above to trigger ${active.nameEn}'s ancient calling.`
                                        : `合工條件不契合。必須派遣精確 15 隻寶可夢，且完全契合上方所要求的合工班專長配比，才能成功召喚 ${active.nameZh}。`}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                          {/* Roster Pool Board (Available fleet) */}
                          <div className="bg-bone p-4 border border-line-soft rounded">
                            <div className="flex justify-between items-center mb-3">
                              <span className="font-mono-metadata text-xs text-ink-mute uppercase font-bold tracking-wider">
                                {en ? "AVAILABLE FLEET POOL" : "空空鎮與據點全能後備隊"}
                              </span>
                              <span className="text-xs font-mono-metadata text-ink-faint">
                                {en ? "Select up to 15 workers" : "點擊可派遣或移出工作隊"}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto pr-1">
                              {POKEMON_ROSTER_POOL.map((p) => {
                                const crewIds = selectedAltarCrew[active.id] ?? [];
                                const isSelected = crewIds.includes(p.id);
                                return (
                                  <button
                                    type="button"
                                    key={p.id}
                                    disabled={!isSelected && crewIds.length >= 15}
                                    onClick={() => {
                                      if (isSelected) {
                                        setSelectedAltarCrew((prev) => ({
                                          ...prev,
                                          [active.id]: prev[active.id].filter((id) => id !== p.id),
                                        }));
                                      } else if (crewIds.length < 15) {
                                        setSelectedAltarCrew((prev) => ({
                                          ...prev,
                                          [active.id]: [...prev[active.id], p.id],
                                        }));
                                      }
                                    }}
                                    className={`p-2 rounded border text-left flex flex-col justify-between h-20 transition-all ${
                                      isSelected
                                        ? "bg-[#3c6ca5]/10 border-[#3c6ca5] ring-1 ring-[#3c6ca5] text-[#305684]"
                                        : crewIds.length >= 15
                                          ? "bg-stone-50 border-stone-200 opacity-40 cursor-not-allowed text-stone-400"
                                          : "bg-paper hover:bg-stone-50 border-line-soft text-ink-soft"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start w-full gap-1">
                                      <span className="font-bold text-xs truncate leading-tight">
                                        {en ? p.nameEn : p.nameZh}
                                      </span>
                                      <span className="material-symbols-outlined text-[15px] shrink-0 opacity-70">
                                        {p.icon}
                                      </span>
                                    </div>
                                    <div className="w-full">
                                      <div className="flex flex-wrap gap-0.5 mb-1">
                                        {p.specialties.map((spec) => (
                                          <span 
                                            key={spec} 
                                            className="bg-[#3c6ca5]/10 text-[#305684] text-[7px] scale-90 origin-left px-1 py-0.2 rounded font-mono uppercase"
                                          >
                                            {spec}
                                          </span>
                                        ))}
                                      </div>
                                      <div className="text-xs text-ink-faint leading-tight truncate">
                                        {en ? p.descEn : p.descZh}
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      </div>
                    </section>
                  </ScrollFade>
                )}
                  </>
                )}

                <ScrollFade depth="none" scaleEnabled={false} className="w-full">
                  <section className="pt-6 border-t border-dashed border-line-soft">
                    <h3 className="font-label-caps text-label-caps text-ink-mute uppercase mb-4 tracking-wider flex items-center gap-2 font-semibold text-xs">
                      <span className="material-symbols-outlined text-[16px]">menu_book</span>
                      {en ? "Sources & References" : "資料來源與參考"}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {active.sourceLinks.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono-metadata text-mono-metadata text-ink-soft bg-paper-warm/40 border border-line-soft px-4 py-2 rounded-sm hover:text-primary hover:bg-paper-warm/80 transition-all duration-300 shadow-sm"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </section>
                </ScrollFade>
              </div>
            </div>
          </div>
        )}

        {activeItem && (() => {
          const meta = collectibleMeta[activeItem.category];
          return (
            <div
              className="fixed inset-0 z-[72] flex items-center justify-center p-4 bg-ink-soft/40 backdrop-blur-sm"
              onClick={() => setActiveItem(null)}
            >
              <div
                className="bg-paper border hairline-border w-[92vw] max-w-md max-h-[88vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-sm right-sm z-10 text-ink-mute hover:text-primary transition-colors bg-paper/80 backdrop-blur-md rounded-full p-1 border border-line-soft"
                  aria-label={en ? "Close" : "關閉"}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                <div className="p-lg">
                  <div className="flex items-center gap-2 mb-3 pr-8">
                    <span className="material-symbols-outlined text-[20px]" style={{ color: meta?.color }}>
                      {meta?.icon}
                    </span>
                    <span
                      className="font-mono-metadata text-mono-metadata uppercase tracking-wider"
                      style={{ color: meta?.color }}
                    >
                      {en ? meta?.labelEn : meta?.labelZh}
                    </span>
                    <span className="font-mono-metadata text-mono-metadata text-ink-mute ml-auto">
                      {regionName(activeItem.regionId)}
                    </span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-1 break-words">
                    {en ? activeItem.titleEn || activeItem.nameJa : activeItem.nameJa}
                  </h2>
                  {en && activeItem.titleEn && activeItem.nameJa && (
                    <p className="font-body-italic text-body-italic text-ink-mute mb-3 break-words">
                      {activeItem.nameJa}
                    </p>
                  )}
                  {activeItem.image && (
                    <img
                      src={activeItem.image}
                      alt=""
                      loading="lazy"
                      className="w-full rounded-sm border border-line-soft bg-bone my-4"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  {(activeItem.descEn || activeItem.rewardJa) && (
                    <p className="font-body-base text-body-base text-ink-soft leading-relaxed whitespace-pre-wrap mb-3">
                      {activeItem.descEn || activeItem.rewardJa}
                    </p>
                  )}
                  {activeItem.locationJa && (
                    <div className="border-t border-line-soft pt-3 mt-3">
                      <span className="font-mono-metadata text-mono-metadata text-ink-mute uppercase block mb-1">
                        {en ? "Location (JA)" : "位置（日文）"}
                      </span>
                      <p className="font-body-base text-body-base text-ink-soft break-words">{activeItem.locationJa}</p>
                    </div>
                  )}
                  <a
                    href="https://pokopiaguide.com/zh/map"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-4 font-mono-metadata text-mono-metadata text-primary hover:opacity-80"
                  >
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    {en ? "Source: pokopiaguide" : "資料來源：pokopiaguide"}
                  </a>
                </div>
              </div>
            </div>
          );
        })()}

        {showIndex && (
          <div
            className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-ink-soft/40 backdrop-blur-sm"
            onClick={() => setShowIndex(false)}
          >
            <div
              className="bg-paper border hairline-border max-w-3xl w-full max-h-[88vh] overflow-y-auto relative"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 bg-bone/95 backdrop-blur-md flex justify-between items-center px-lg py-md border-b border-line-soft z-10">
                <h2 className="font-headline-sm text-headline-sm text-ink-soft uppercase">
                  {en ? "Full Location Index" : "完整地點索引"}
                </h2>
                <button onClick={() => setShowIndex(false)} className="text-ink-mute hover:text-primary transition-colors" aria-label={en ? "Close" : "關閉"}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <ul className="divide-y divide-line-soft">
                {locations.map((loc) => (
                  <li key={loc.id}>
                    <button
                      onClick={() => {
                        setActive(loc);
                        setShowIndex(false);
                      }}
                      className="w-full text-left px-lg py-md flex items-center gap-md hover:bg-surface-container-high transition-colors group"
                    >
                      <span className="material-symbols-outlined text-ink-mute group-hover:text-ink-main transition-colors">
                        {loc.icon}
                      </span>
                      <span className="flex-grow">
                        <span className="font-headline-sm text-headline-sm text-ink-soft block group-hover:text-primary transition-colors">
                          {en ? loc.nameEn : loc.nameZh}
                        </span>
                        <span className="font-mono-metadata text-mono-metadata text-ink-mute">
                          {en ? loc.categoryEn : loc.categoryZh}
                        </span>
                      </span>
                      <span className="font-mono-metadata text-mono-metadata text-ink-mute shrink-0">
                        {en ? loc.levelEn : loc.levelZh}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </div>
    </>
  );
}
