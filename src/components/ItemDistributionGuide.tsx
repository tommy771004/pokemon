import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import MapBackdrop from "./MapBackdrop";

interface LocationEntry {
  id: string;
  x: number;
  y: number;
  regionId: string;
  kind?: string;
}

interface CollectibleItem {
  id: string;
  regionId: string;
  category: string;
  nameJa: string;
  titleEn: string;
  descEn: string;
  rewardJa: string;
  locationJa: string;
  image: string;
}

interface ItemDistributionGuideProps {
  active: LocationEntry;
  items: CollectibleItem[];
  locations: LocationEntry[];
  en: boolean;
  collectedItems: Set<string>;
  toggleItemCollected: (id: string, e?: React.MouseEvent) => void;
  collectibles: any[];
}

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
  "ゲームコーナーだより": "《遊戲城通訊》",
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
  "伝説 of ニンジャ一族": "《傳說中的忍者一族》",
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

const LAND =
  "M16,34 C14,22 24,16 36,18 C46,12 58,14 64,22 C76,22 86,30 84,44 C88,56 86,70 78,78 C70,88 54,88 44,84 C30,86 18,80 16,68 C8,62 8,46 16,34 Z";

export default function ItemDistributionGuide({
  active,
  items,
  locations,
  en,
  collectedItems,
  toggleItemCollected,
  collectibles,
}: ItemDistributionGuideProps) {
  const [selectedItem, setSelectedItem] = useState<CollectibleItem | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

  const regionItems = items.filter(
    (it) => it.regionId === active.regionId || it.regionId === active.id
  );

  // Set initial selected item when active region changes or region items change
  useEffect(() => {
    if (regionItems.length > 0) {
      setSelectedItem(regionItems[0]);
    } else {
      setSelectedItem(null);
    }
  }, [active.id, items]);

  const collectibleMeta: Record<string, { color: string; icon: string; labelEn: string; labelZh: string }> =
    Object.fromEntries(
      collectibles.map((c) => [c.key, { color: c.color, icon: c.icon, labelEn: c.labelEn, labelZh: c.labelZh }])
    );

  const regionCenter = (rid: string) => {
    const l = locations.find((x) => x.regionId === rid && x.kind === "region");
    return l ? { x: l.x, y: l.y } : { x: 50, y: 50 };
  };

  const center = regionCenter(active.regionId || active.id);
  const mapSize = 36;
  const minX = Math.max(0, Math.min(100 - mapSize, center.x - mapSize / 2));
  const minY = Math.max(0, Math.min(100 - mapSize, center.y - mapSize / 2));

  // Determine item coordinates
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

  const categoriesPresent = Array.from(new Set(regionItems.map((it) => it.category)));
  const filteredRegionItems = activeCategoryFilter
    ? regionItems.filter((it) => it.category === activeCategoryFilter)
    : regionItems;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 select-none">
        
        {/* Left Aspect: Local Radar Map & Category Toggles */}
        <div className="xl:col-span-5 flex flex-col gap-5">
          <div className="border border-line-soft bg-bone p-4 rounded-sm flex flex-col gap-3 relative overflow-hidden">
            <div className="flex justify-between items-center z-10">
              <h4 className="font-mono-metadata text-xs text-primary font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] animate-pulse">radar</span>
                {en ? "Earthy Collectible Radar" : "地形物資聲納雷達"}
              </h4>
              <span className="text-[10px] font-mono text-ink-mute uppercase">
                {en ? `Center: [X:${center.x.toFixed(1)}, Y:${center.y.toFixed(1)}]` : `區域中心引力：[X:${center.x.toFixed(1)}, Y:${center.y.toFixed(1)}]`}
              </span>
            </div>

            <div className="aspect-square relative w-full bg-bone border border-line-soft rounded-xs overflow-hidden shadow-inner flex items-center justify-center">
              {/* Zoomed in region SVG landscape styling using MapBackdrop */}
              <MapBackdrop
                viewBox={`${minX} ${minY} ${mapSize} ${mapSize}`}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Hover region center indicator dot */}
                <circle
                  cx={center.x}
                  cy={center.y}
                  r="1.5"
                  fill="var(--color-primary)"
                  opacity="0.12"
                  className="animate-ping"
                  style={{ transformOrigin: `${center.x}px ${center.y}px` }}
                />
                <circle
                  cx={center.x}
                  cy={center.y}
                  r="0.5"
                  fill="var(--color-primary)"
                />

                {/* Placement of interactive dots representing regional collectibles */}
                {regionItems.map((it) => {
                  const pos = itemPos[it.id];
                  if (!pos) return null;
                  const isSelected = selectedItem?.id === it.id;
                  const isDone = collectedItems.has(it.id);
                  const meta = collectibleMeta[it.category];

                  // Fade out inactive categories
                  const isFilteredOut = activeCategoryFilter && activeCategoryFilter !== it.category;

                  return (
                    <g
                      key={"radarPt-" + it.id}
                      className="cursor-pointer transition-opacity duration-300"
                      opacity={isFilteredOut ? 0.15 : 1}
                      onClick={() => setSelectedItem(it)}
                    >
                      {isSelected && (
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="1.4"
                          fill="none"
                          stroke={meta?.color || "var(--color-primary)"}
                          strokeWidth="0.15"
                          className="animate-pulse"
                        />
                      )}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isSelected ? "0.9" : "0.55"}
                        fill={isDone ? "#3d5a45" : (meta?.color || "var(--color-primary)")}
                        stroke="#ffffff"
                        strokeWidth="0.1"
                      />
                      {isDone && (
                        <path
                          d={`M${pos.x - 0.15} ${pos.y} L${pos.x - 0.04} ${pos.y + 0.12} L${pos.x + 0.18} ${pos.y - 0.1}`}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="0.08"
                          strokeLinecap="round"
                        />
                      )}
                    </g>
                  );
                })}
              </MapBackdrop>
              <div className="absolute bottom-1.5 left-1.5 bg-paper/90 backdrop-blur-md px-2 py-0.5 border border-line-soft rounded-[2px] text-[9px] font-mono text-ink-mute flex items-center gap-1.5 shadow-xs z-10">
                <span className="w-1.5 h-1.5 bg-[#3d5a45] rounded-full inline-block"></span>
                {en ? "Green = Tagged Collected" : "深綠 = 已標記收集"}
              </div>
            </div>
          </div>

          {/* Filtering Categories Chips list */}
          <div className="flex flex-col gap-2">
            <span className="font-mono-metadata text-[10px] text-ink-mute uppercase tracking-widest font-bold">
              {en ? "Statistics & Filter Options" : "種類過濾與收集統計"}
            </span>
            {regionItems.length === 0 ? (
              <p className="text-xs text-ink-faint italic">{en ? "No distinct materials cataloged." : "尚未登載到任何地圖物品物資。"}</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter(null)}
                  className={`px-2.5 py-1 rounded-sm border font-mono-metadata text-[11px] flex items-center gap-1.5 transition-all ${
                    activeCategoryFilter === null
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-line-soft text-ink-soft hover:bg-[#ccdcb9]/20 bg-[#ccdcb9]/5"
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">all_inclusive</span>
                  {en ? "All" : "全部顯示"} ({regionItems.length})
                </button>
                {categoriesPresent.map((catKey) => {
                  const meta = collectibleMeta[catKey];
                  const label = en ? meta?.labelEn : meta?.labelZh;
                  const catTotal = regionItems.filter((it) => it.category === catKey).length;
                  const catDone = regionItems.filter((it) => it.category === catKey && collectedItems.has(it.id)).length;
                  const isFilterActive = activeCategoryFilter === catKey;
                  return (
                    <button
                      type="button"
                      key={catKey}
                      onClick={() => setActiveCategoryFilter(isFilterActive ? null : catKey)}
                      className={`px-2.5 py-1 rounded-sm border font-mono-metadata text-[11px] flex items-center gap-1.5 transition-all ${
                        isFilterActive
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                          : "border-line-soft text-ink-soft hover:bg-[#ccdcb9]/20 bg-[#ccdcb9]/5"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]" style={{ color: meta?.color }}>
                        {meta?.icon || "radio_button_checked"}
                      </span>
                      {label}
                      <span className="bg-bone-dark/50 px-1 rounded-full text-[9px] font-mono font-bold">
                        {catDone}/{catTotal}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Aspect: Materials Directory Table & Snapshot Preview Panel */}
        <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Inventory Catalog Directory List (span-6) */}
          <div className="md:col-span-6 flex flex-col gap-2">
            <span className="font-mono-metadata text-[10px] text-ink-mute uppercase tracking-widest font-bold">
              {en ? "Region Material Inventory Directory" : "本區特有物資列表"} ({filteredRegionItems.length})
            </span>
            {filteredRegionItems.length === 0 ? (
              <div className="bg-bone border border-dashed border-line-soft p-8 rounded text-center text-xs text-ink-faint">
                {en ? "No items correspond to selected filter." : "無對應此過濾種類的特殊物資。"}
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[300px] md:max-h-[396px] overflow-y-auto pr-1">
                {filteredRegionItems.map((it) => {
                  const meta = collectibleMeta[it.category];
                  const isSelected = selectedItem?.id === it.id;
                  const isDone = collectedItems.has(it.id);
                  return (
                    <div
                      key={"invItem-" + it.id}
                      onClick={() => setSelectedItem(it)}
                      className={`cursor-pointer w-full text-left border p-2.5 rounded-sm flex items-center justify-between transition-all duration-300 ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs"
                          : "border-line-soft hover:bg-bone/40 bg-paper"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 mr-2">
                        <span className="material-symbols-outlined text-[18px] shrink-0" style={{ color: meta?.color }}>
                          {meta?.icon || "radio_button_checked"}
                        </span>
                        <div className="min-w-0">
                          <span className="font-mono text-[8px] text-ink-mute block uppercase">
                            ID: {it.id} · {en ? meta?.labelEn : meta?.labelZh}
                          </span>
                          <h6 className="font-sans text-xs font-bold text-ink-soft truncate leading-tight mt-0.5">
                            {translateJaToZh(it.nameJa)}
                          </h6>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleItemCollected(it.id, e);
                        }}
                        className={`material-symbols-outlined text-[15px] rounded-full w-[22px] h-[22px] flex items-center justify-center border transition-all shrink-0 ${
                          isDone
                            ? "bg-[#3d5a45] text-white border-[#3d5a45] shadow-xs"
                            : "text-ink-mute border-line-soft hover:text-primary hover:border-primary bg-bone"
                        }`}
                      >
                        {isDone ? "check font-extrabold" : "radio_button_unchecked"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Snap Preview Details Container (span-6) */}
          <div className="md:col-span-6">
            {selectedItem ? (() => {
              const meta = collectibleMeta[selectedItem.category];
              const isDone = collectedItems.has(selectedItem.id);
              return (
                <div className="border border-line-soft bg-paper p-4 rounded-sm flex flex-col gap-3.5 relative h-full justify-between shadow-xs">
                  <div className="flex flex-col gap-3.5">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]" style={{ color: meta?.color }}>
                          {meta?.icon || "radio_button_checked"}
                        </span>
                        <span className="font-mono-metadata text-[10px] font-bold uppercase tracking-widest" style={{ color: meta?.color }}>
                          {en ? meta?.labelEn : meta?.labelZh}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-ink-mute">
                        ID: #{selectedItem.id}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-sans font-bold text-sm md:text-base text-ink-main leading-snug">
                        {translateJaToZh(selectedItem.nameJa)}
                      </h5>
                      <p className="font-body-italic text-[10px] text-ink-mute italic mt-0.5">
                        {selectedItem.nameJa}
                      </p>
                    </div>

                    <div className="bg-bone border border-line-soft p-3 rounded-xs text-xs flex flex-col gap-1 shadow-inner">
                      <span className="text-ink-mute font-mono-metadata font-bold tracking-wider text-[8.5px]">
                        {en ? "LOCATION GUIDE & COORDS" : "地理位置指引與地貌描述"}
                      </span>
                      <p className="text-ink-soft leading-relaxed font-sans mt-0.5 text-[11px]">
                        {translateLocationToZh(selectedItem.locationJa) || (en ? "Scattered openly in the region." : "分布於區域大自然開闊處。")}
                      </p>
                      {selectedItem.locationJa && (
                        <p className="text-[9px] text-ink-faint italic font-mono mt-1 border-t border-line-soft/40 pt-1">
                          日文原文: {selectedItem.locationJa}
                        </p>
                      )}
                    </div>

                    {selectedItem.rewardJa && (
                      <div className="p-2.5 bg-primary/5 border border-primary/10 rounded-xs text-[11px] flex flex-col gap-0.5">
                        <span className="text-primary font-mono-metadata font-bold tracking-wider text-[8.5px] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[11px]">emoji_events</span>
                          {en ? "REASON FOR COLLECTION" : "解鎖建造獎勵"}
                        </span>
                        <p className="text-ink-soft font-semibold">{translateJaToZh(selectedItem.rewardJa)}</p>
                      </div>
                    )}

                    {selectedItem.image && (
                      <div className="relative border border-line-soft overflow-hidden rounded bg-bone aspect-video max-h-[140px] flex items-center justify-center shadow-xs">
                        <img
                          src={selectedItem.image}
                          alt=""
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => toggleItemCollected(selectedItem.id, e)}
                    className={`w-full font-mono-metadata text-xs font-bold py-2 px-3 rounded-sm transition-all flex items-center justify-center gap-2 ${
                      isDone
                        ? "bg-[#3d5a45] text-white hover:opacity-95 shadow-xs"
                        : "bg-primary text-on-primary hover:opacity-95 shadow-xs hover:-translate-y-0.5"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isDone ? "check_circle" : "circle"}
                    </span>
                    {isDone ? (en ? "Marked Collected!" : "已標記收集！") : (en ? "Mark Collected" : "標記為已收集")}
                  </button>
                </div>
              );
            })() : (
              <div className="border border-dashed border-line-soft bg-paper h-full flex flex-col items-center justify-center p-6 text-center text-xs text-ink-mute">
                <span className="material-symbols-outlined text-[32px] text-ink-faint mb-2">touch_app</span>
                {en ? "Select an item to preview coordinates & snapshot guide" : "請從左側點選具體物資以載入高精細度截圖與指引"}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
