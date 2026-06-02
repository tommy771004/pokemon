const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "public/data/pokedex.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

const CATEGORY = {
  life: { en: "Life Skill", zh: "生活技能" },
  attack: { en: "Attack Skill", zh: "攻擊技能" },
  support: { en: "Support Skill", zh: "輔助技能" },
};

function makeSkill(kind, nameEn, nameZh, detailEn, detailZh) {
  return {
    categoryEn: CATEGORY[kind].en,
    categoryZh: CATEGORY[kind].zh,
    nameEn,
    nameZh,
    detailEn,
    detailZh,
  };
}

const lifeProfiles = {
  Automation: ["Routine Sync", "例行同步", "Keeps machines and production timing in step around automated worksites.", "讓機具與產線節奏維持同步，適合自動化工地與加工點。"],
  Build: ["Site Assembly", "工地搭建", "Carries heavy materials and helps raise large structures with stable output.", "擅長搬運重物並穩定推進大型建築施工。"],
  Burn: ["Heatcraft", "熱源加工", "Supplies controlled heat for kilns, furnaces, and field smelting tasks.", "能為窯爐、熔爐與野外冶煉提供穩定熱源。"],
  "Burn / Fly": ["Aerial Haul", "空運搬料", "Combines lift power and fire control to move supplies across difficult terrain.", "結合飛行與控火能力，能跨越地形搬運施工物資。"],
  Cooking: ["Field Kitchen", "野外料理", "Turns gathered ingredients into meals that power later quests and upgrades.", "可將採集食材製成能推動主線與強化流程的料理。"],
  Crush: ["Ore Breaking", "礦脈破碎", "Breaks dense rock, buried blocks, and sealed resource nodes into usable fragments.", "擅長擊碎厚重岩層、埋藏障礙與高硬度資源塊。"],
  Cut: ["Timber Cut", "木材切削", "Processes logs, undergrowth, and blocked routes into workable building stock.", "可處理原木、雜草與路障，轉化成可用建材。"],
  Farming: ["Crop Care", "作物照護", "Accelerates growth cycles and keeps planting plots productive through bad weather.", "加速作物成長循環，讓農地在惡劣環境下仍保持收成。"],
  Freeze: ["Cold Storage", "低溫保鮮", "Preserves food and rare materials that would spoil during long build phases.", "能保鮮食材與稀有材料，適合長工期的備料階段。"],
  Generate: ["Grid Charge", "電網供能", "Feeds stable power into lights, stations, and industrial equipment.", "可為照明、充電站與工業設備提供穩定電力。"],
  Glide: ["Sky Traverse", "空域滑行", "Crosses wide gaps and floating routes without relying on permanent bridges.", "能跨越大範圍裂谷與浮空路線，減少對固定橋樑的依賴。"],
  "Magnet Rise": ["Remote Lift", "隔空搬運", "Manipulates heavy terrain pieces from a distance for fast landscape rework.", "可遠距操縱大型地形物件，快速重整地貌。"],
  Professor: ["Field Research", "野外調查", "Reads ecosystems quickly and translates discoveries into restoration objectives.", "能快速判讀生態狀況，並轉化成清楚的復育目標。"],
  Recycle: ["Scrap Sorting", "廢料分揀", "Separates useful materials from junk piles and keeps settlements clean.", "可從垃圾堆中分離有用材料，同時維持聚落整潔。"],
  Rotom: ["Town Broadcast", "聚落播送", "Animates a settlement with signals, music, and active electrical presence.", "以訊號、音樂與活化電流為聚落帶來生氣。"],
  Search: ["Relic Scan", "遺跡探測", "Detects hidden dig spots, murals, and buried quest items in the field.", "能感測隱藏挖掘點、壁畫機關與埋藏任務物件。"],
  Smeargle: ["Pattern Sketch", "藍圖描畫", "Copies layouts, decorative motifs, and visual ideas into usable plans.", "可臨摹布局、裝飾樣式與視覺靈感，轉為可用藍圖。"],
  Smithing: ["Forge Work", "鍛造作業", "Shapes metal components, tools, and gears needed for advanced construction.", "能鍛造金屬零件、工具與高階建築所需齒輪。"],
  Snorlax: ["Path Clearing", "路障清除", "Uses overwhelming bulk to unblock routes and wake stalled town systems.", "能以壓倒性的體型清除障礙，推動卡住的城鎮流程。"],
  Trade: ["Market Exchange", "市集交易", "Specializes in bartering, recipe exchange, and supplying comfort items.", "擅長交易、換取食譜與補足棲地需求的舒適道具。"],
  Transform: ["Adaptive Form", "適應擬態", "Reads the situation and changes form to fit different tasks across the region.", "可依環境與任務需求改變姿態，適應各類工作。"],
  Transport: ["Dream Ferry", "夢境運輸", "Carries people and cargo into special routes that normal travel cannot reach.", "能將人員與物資送往一般移動方式無法抵達的特殊路線。"],
  "Water Gun": ["Terrain Watering", "地貌灌溉", "Restores dry ground, clears sludge, and sustains fragile habitat patches.", "能滋潤乾地、沖刷泥堆並維持脆弱棲地。"],
  "—": ["Habitat Presence", "棲地共鳴", "Strengthens the identity of a habitat even when no explicit utility skill is listed.", "即使沒有明確的工作專長，也能強化棲地的存在感與穩定度。"],
};

const supportProfiles = {
  Automation: ["Line Calibration", "產線校準", "Reduces downtime by tuning adjacent machines and conveyor-style loops.", "可校準周邊機具與自動流程，降低停機時間。"],
  Build: ["Crew Coordination", "工班協調", "Improves work pace when multiple builders are assigned to the same project.", "多名建造夥伴同場施工時，能顯著提升協作效率。"],
  Burn: ["Kiln Ignite", "窯火點燃", "Maintains high-temperature stations without constant manual oversight.", "可長時間維持高溫設備運作，減少手動照看。"],
  "Burn / Fly": ["Aerial Furnace Supply", "空中爐火補給", "Supports elevated forges and keeps remote stations supplied from above.", "能支援高處熔爐，從空中持續補給偏遠站點。"],
  Cooking: ["Meal Boost", "餐點增益", "Prepares dishes that unlock strength checks and temporary production boosts.", "可製作解鎖力量檢定與短期增益的關鍵料理。"],
  Crush: ["Vein Exposure", "礦脈揭露", "Reveals deeper ore veins and hidden chambers after breaking surface blocks.", "擊碎表層後能進一步暴露深層礦脈與隱藏空間。"],
  Cut: ["Access Clearing", "開路整備", "Cuts clean passages through sealed walls, brush, and gated shortcuts.", "能切開封閉牆面、植被與近路障礙，打通行進路線。"],
  Farming: ["Harvest Boost", "豐收加成", "Raises the output of crops, seeds, and greenery-based habitats nearby.", "可提升附近農作物、種子與植栽棲地的產出。"],
  Freeze: ["Cooling Aura", "冷卻場域", "Stabilizes temperature-sensitive rooms and preserves crafted ingredients.", "能穩定低溫空間，保存加工中的食材與材料。"],
  Generate: ["Power Relay", "電力轉接", "Relays energy into larger networks such as lighthouses, towers, and hubs.", "可把電力穩定轉接到燈塔、高塔與樞紐等大型設施。"],
  Glide: ["Aerial Recon", "空中偵查", "Scouts routes, rooftops, and island gaps before committing resources.", "可先行偵查高處、屋頂與浮島裂谷，降低施工風險。"],
  "Magnet Rise": ["Bulk Relocation", "大型移位", "Repositions trees, boulders, and scrap piles for large-scale redesign work.", "擅長移動樹木、巨石與廢料堆，適合大規模重建。"],
  Professor: ["Quest Guidance", "任務導引", "Connects discoveries to the next restoration milestone and mission briefing.", "能把現場發現整理成下一個復育里程碑與任務提示。"],
  Recycle: ["Waste Conversion", "廢料轉化", "Turns discarded clutter into ore, paper, and reusable industrial inputs.", "可把廢棄物轉化為礦砂、紙張與可再利用工業原料。"],
  Rotom: ["Mood Uplift", "氛圍提振", "Improves settlement morale and makes rebuilt areas feel properly inhabited.", "能提升聚落氛圍，讓重建區域更像真正有人生活的城鎮。"],
  Search: ["Hidden Spot Sense", "隱藏點感知", "Shortens the hunt for secret murals, slates, and golden dig sites.", "可縮短尋找隱藏壁畫、石板與發光挖掘點的時間。"],
  Smeargle: ["Decor Blueprint", "裝飾藍圖", "Helps copy decorative concepts into repeatable settlement layouts.", "能把裝飾創意轉成可重複套用的聚落設計。"],
  Smithing: ["Gear Commission", "齒輪訂製", "Produces special gears and forged parts for lifts and high-tier builds.", "可打造升降平台與高階工程需要的特殊齒輪與鍛件。"],
  Snorlax: ["Power Wake", "巨力喚醒", "Anchors major quest beats that require waking or shifting massive objects.", "能推動需要喚醒大型裝置或移動巨物的關鍵劇情節點。"],
  Trade: ["Recipe Brokerage", "配方仲介", "Unlocks specialty foods and milestone items through careful exchange.", "可透過交易解鎖特殊食物與里程碑道具。"],
  Transform: ["Skill Mimicry", "技能複製", "Copies proven techniques from other Pokémon and reuses them on demand.", "能複製其他寶可夢的成熟技能，於需要時再次施展。"],
  Transport: ["Route Beacon", "路線引渡", "Links distant or random spaces to the main adventure flow.", "把遙遠或隨機生成的區域重新接回主線探索流程。"],
  "Water Gun": ["Mud Clearing", "泥堆沖洗", "Washes away compacted mud and reveals routes, items, and buried targets.", "能沖開厚重泥堆，露出路線、素材與埋藏目標。"],
  "—": ["Legend Signal", "傳說號令", "Represents exceptional presence that changes a region when this Pokémon arrives.", "象徵足以改變區域氣場的特殊存在感。"],
};

const attackProfiles = {
  Normal: ["Body Slam", "身體衝撞", "Uses direct force to shove obstacles, break light barriers, or win close encounters.", "以直接衝撞破除障礙、撞開輕型封鎖或壓制近距目標。"],
  Grass: ["Leafage", "樹葉", "Launches sharp leaves to prune growth, trigger plant systems, or strike from mid-range.", "拋射葉刃修整植被、啟動植物機關，並進行中距離打擊。"],
  Fire: ["Fire Breath", "火焰吐息", "Projects controlled flame for combat pressure and heavy-duty ignition work.", "可噴出穩定火焰，兼具戰鬥壓制與高強度點火能力。"],
  Water: ["Water Gun", "水槍", "Fires a strong stream that drenches dry land, clears sludge, and knocks targets back.", "噴射強力水流，可澆灌乾地、沖刷泥堆並擊退目標。"],
  Electric: ["Thunder Jolt", "電光衝擊", "Delivers a sharp electrical burst suited for generators, traps, and quick strikes.", "釋放瞬間強電流，適合啟動設備、癱瘓機關與快速打擊。"],
  Rock: ["Stone Crash", "岩崩撞擊", "Breaks brittle walls and hits with the force of falling rubble.", "以落石般的重擊粉碎脆弱牆面與地形障礙。"],
  Ground: ["Earth Break", "大地裂擊", "Splits hardened earth and destabilizes buried structures from below.", "可震裂硬化地表，從下方破壞埋藏結構。"],
  Flying: ["Gust Dive", "疾風俯衝", "Uses wind pressure and aerial momentum to attack hard-to-reach targets.", "以風壓與俯衝動能打擊高處或難以接近的目標。"],
  Psychic: ["Mind Pulse", "念力波", "Channels focused mental force to strike, lift, or disable hostile mechanisms.", "以集中念力打擊、搬動物件或癱瘓危險機關。"],
  Bug: ["Silk Cutter", "絲刃斬", "Slices through web-like barriers and swarms with fine, fast strikes.", "以細密迅捷的斬擊切開絲網型障礙與成群干擾。"],
  Poison: ["Venom Sting", "毒針", "Uses venom-tipped hits to weaken threats and secure hazardous spaces.", "以帶毒攻擊削弱威脅，穩定危險區域。"],
  Steel: ["Metal Bash", "鋼鐵猛撞", "Rams with hardened metal force to crush durable blocks or armored foes.", "以鋼鐵般的衝擊力擊碎耐久方塊或重裝目標。"],
  Fairy: ["Charm Gleam", "魅光閃耀", "Releases a radiant burst that disrupts darkness and hostile moods alike.", "放出明亮妖精光芒，能驅散黑暗與敵意。"],
  Ghost: ["Shadow Drift", "幽影漂行", "Slips through danger and strikes from angles normal movement cannot use.", "能從常規移動無法利用的角度穿梭並發動襲擊。"],
  Dark: ["Night Pounce", "暗影突襲", "Ambushes from low light and pressures wary opponents before they react.", "擅長自昏暗處突襲，在目標反應前先行壓制。"],
  Fighting: ["Power Knuckle", "重拳擊", "Relies on disciplined strength to smash barriers and overpower strong foes.", "以紮實力道擊破障礙，也能正面壓制強敵。"],
  Ice: ["Frost Breath", "霜息", "Expels freezing air to halt motion, chill materials, or slow dangerous flows.", "吐出寒氣凍結目標，可止住移動、冷卻材料或放緩危險流體。"],
  Dragon: ["Sky Roar", "蒼空龍吼", "Unleashes a powerful draconic burst suited for late-game combat pressure.", "釋放龍系爆發力，在後期戰鬥與高壓場景中極具威懾。"],
};

const specialtyAttackProfiles = {
  Automation: attackProfiles.Normal,
  Build: attackProfiles.Fighting,
  Burn: attackProfiles.Fire,
  "Burn / Fly": attackProfiles.Fire,
  Cooking: attackProfiles.Normal,
  Crush: attackProfiles.Rock,
  Cut: ["Blade Slash", "利刃斬", "Carves through undergrowth and lighter barriers with clean cutting force.", "以俐落斬擊切開植被與較薄的障礙物。"],
  Farming: attackProfiles.Grass,
  Freeze: attackProfiles.Ice,
  Generate: attackProfiles.Electric,
  Glide: attackProfiles.Flying,
  "Magnet Rise": ["Magnetic Pulse", "磁場脈衝", "Fires a vibrating magnetic shock that rattles metal-heavy structures.", "釋放震盪磁場，特別擅長撼動金屬結構。"],
  Professor: attackProfiles.Grass,
  Recycle: ["Scrap Burst", "廢料衝擊", "Uses compressed scrap as a rough but effective impact weapon.", "可把壓縮廢料化作粗暴但有效的打擊手段。"],
  Rotom: attackProfiles.Electric,
  Search: ["Pinpoint Strike", "定點突擊", "Targets weak spots after locking onto hidden seams or buried objects.", "在鎖定裂縫與埋藏目標後，能精準打擊弱點。"],
  Smeargle: ["Ink Splash", "墨彩潑擊", "Uses broad paint strokes to distract targets and mark interactive surfaces.", "能以大範圍塗抹干擾目標，也能標示互動表面。"],
  Smithing: ["Hammer Crash", "巨鎚猛擊", "Brings down a decisive hammer strike suited for metal-heavy obstacles.", "能用巨鎚打出決定性重擊，對金屬障礙尤其有效。"],
  Snorlax: ["Mossy Slam", "苔原重壓", "Drops its full weight in a heavy strike that shakes stubborn mechanisms awake.", "以全身重量重擊目標，能把頑固裝置硬生生震醒。"],
  Trade: attackProfiles.Normal,
  Transform: ["Copy Strike", "複製猛擊", "Turns borrowed techniques into immediate action the moment a new challenge appears.", "可把學來的技能立刻投入現場，面對新挑戰也能迅速應對。"],
  Transport: ["Floating Feint", "飄行佯擊", "Slips around obstacles and startles targets with drifting aerial pressure.", "可繞開障礙並以飄移軌跡製造出奇不意的壓迫。"],
  "Water Gun": attackProfiles.Water,
};

const roleFallbacks = {
  Protagonist: ["World Restore", "世界復育", "Supports every restoration arc by adapting to whatever the region demands next.", "能配合每個區域的需求調整自身，是推動世界復育的核心。"],
  Mentor: ["Field Briefing", "現場教學", "Clarifies the next objective and ties discoveries back to the larger mission.", "能把現地發現整理成清楚的教學與下一步任務方向。"],
  "Story Character": ["Quest Trigger", "劇情推進", "Opens a specific story beat, construction phase, or regional breakthrough.", "會在特定章節解鎖劇情、施工節點或區域突破。"],
  Partner: ["Work Companion", "工作夥伴", "Supports repeated field tasks and makes day-to-day restoration work more efficient.", "可穩定支援反覆的野外作業，提升日常復育效率。"],
  Legendary: ["Region Blessing", "區域祝福", "Its arrival dramatically upgrades a region's status, atmosphere, or output.", "一旦加入，就能大幅提升區域狀態、氛圍或生產力。"],
  Mythical: ["Ancient Wish", "古代心願", "Connects hidden puzzles, rare relics, and the world's deepest secrets.", "與隱藏謎題、古代遺物及世界最深層的秘密緊密相連。"],
  Eeveelution: ["Habitat Harmony", "棲地和諧", "Enhances the comfort and identity of carefully prepared endgame habitats.", "能提升終局棲地的舒適度與風格完整性。"],
  "Event Pokémon": ["Seasonal Encore", "季節返場", "Appears around limited conditions and rewards players who watch event timing.", "會在限時條件下現身，回饋留意活動時機的玩家。"],
};

const pokemonOverrides = {
  "025": [
    makeSkill("life", "Grid Charge", "電網供能", "Feeds early automation lines and keeps Bleak Beach's recovery grid alive.", "能驅動早期自動化產線，並維持荒涼海灘的復原電網。"),
    makeSkill("attack", "Thunder Jolt", "電光衝擊", "Releases a fast electric burst that powers devices and shocks obstacles apart.", "能瞬間釋放電流，既可啟動設備，也能擊散障礙。"),
    makeSkill("support", "Peakychu Rally", "Peakychu 集結", "Its named counterpart Peakychu later joins the Huge Building crew as an irreplaceable helper.", "其特殊個體 Peakychu 之後會成為巨大建築 4F 施工隊不可替代的一員。"),
  ],
  "081": [
    makeSkill("life", "Remote Lift", "隔空搬運", "Magnetically lifts terrain pieces, barrels, and scrap for rapid post-game remodeling.", "可用磁力搬動地形塊、金屬桶與廢料，適合通關後的大改造。"),
    makeSkill("attack", "Magnetic Pulse", "磁場脈衝", "Generates a short-range metal shock that rattles machines and loose structures.", "可釋放短距離金屬脈衝，震開鬆動機具與構造。"),
    makeSkill("support", "Instant Rebuild", "瞬拆重建", "Turns dismantling and terrain relocation into a near-instant maintenance loop.", "讓拆除與地形移位幾乎變成即時維護流程，大幅提升重建效率。"),
  ],
  "132": [
    makeSkill("life", "Adaptive Form", "適應擬態", "Reads each biome's needs and changes form to keep the restoration effort moving.", "能因應每個生態區的需求調整姿態，持續推進復育流程。"),
    makeSkill("attack", "Copy Strike", "複製猛擊", "Turns borrowed techniques into immediate action the moment a new challenge appears.", "可把學來的技能立刻投入現場，面對新挑戰也能迅速應對。"),
    makeSkill("support", "Skill Mimicry", "技能複製", "Learns signature field abilities from partner Pokémon and reuses them anywhere.", "能向夥伴學習招牌專長，之後在任何區域重複施展。"),
  ],
  "143": [
    makeSkill("life", "Path Clearing", "路障清除", "Its massive body helps clear blocked streets and restart stalled town systems.", "能以龐大身軀清除堵塞街道，讓停滯的城鎮機能重新運作。"),
    makeSkill("attack", "Mossy Slam", "苔原重壓", "Drops its full weight in a heavy strike that shakes stubborn mechanisms awake.", "以全身重量重擊目標，能把頑固裝置硬生生震醒。"),
    makeSkill("support", "Power Wake", "巨力喚醒", "Mosslax is the turning point for Bleak Beach's 'Brighten Things Up!' restoration.", "作為 Mosslax，牠正是荒涼海灘「Brighten Things Up!」的關鍵轉折點。"),
  ],
  "150": [
    makeSkill("life", "Rooftop Trial", "屋頂試煉", "Marks the summit of the Huge Building as a final test of the reconstruction route.", "坐鎮巨大建築屋頂，象徵整條重建路線的最終試煉。"),
    makeSkill("attack", "Psychic Dominion", "精神支配", "Overwhelms the air around it with precise telekinetic force and pressure.", "以精準念力與壓迫感籠罩整片空域，展現壓倒性存在。"),
    makeSkill("support", "Skyline Pressure", "天際威壓", "Its appearance turns the completed rooftop into one of the game's signature moments.", "牠的現身會把完工屋頂轉化成全作最具代表性的終局場景之一。"),
  ],
  "151": [
    makeSkill("life", "Slate Resonance", "石板共鳴", "Answers the hidden mural only after all 27 mysterious slates are restored.", "只有在 27 塊神秘石板全部歸位後，才會回應地下壁畫。"),
    makeSkill("attack", "Prismatic Burst", "幻彩衝擊", "Releases a playful but overwhelming burst of ancient psychic energy.", "能釋放帶有古老氣息、卻又難以招架的超能力爆發。"),
    makeSkill("support", "Ancient Wish", "古代心願", "Represents the deepest secret route in Pokopia's restoration history.", "象徵 Pokopia 復育歷史中最深層的祕密路線與終極獎勵。"),
  ],
  "235": [
    makeSkill("life", "Pattern Sketch", "藍圖描畫", "Copies visual patterns and decorative concepts into build-ready ideas.", "可把看見的圖樣與裝飾概念轉成可直接實作的設計。"),
    makeSkill("attack", "Ink Splash", "墨彩潑擊", "Uses broad paint strokes to distract targets and mark interactive surfaces.", "能以大範圍塗抹干擾目標，也能標示互動表面。"),
    makeSkill("support", "Decor Blueprint", "裝飾藍圖", "Smearguru helps restored towns feel personalized rather than merely repaired.", "作為 Smearguru，牠讓重建後的聚落不只恢復功能，還能展現個性。"),
  ],
  "243": [
    makeSkill("life", "Storm Charger", "風暴蓄電", "Stabilizes major power networks once a region has proven worthy of its trust.", "當區域通過考驗後，牠能穩定大型電網並帶來持續能量。"),
    makeSkill("attack", "Thunder Crest", "雷牙天擊", "Calls down a high-voltage strike fit for clifftops, generators, and legendary trials.", "可喚下高壓雷擊，特別適合懸崖、高能設備與傳說試煉。"),
    makeSkill("support", "Environment Surge", "環境躍升", "Recruiting Raikou sharply raises the environment level of the active region.", "成功招募後，可讓所在區域的環境等級明顯躍升。"),
  ],
  "244": [
    makeSkill("life", "Lava March", "熔炎行軍", "Thrives in scorched routes and keeps volcanic restoration moving forward.", "能在灼熱路線中穩定行動，維持火山區復育進度。"),
    makeSkill("attack", "Magma Burst", "岩漿爆燃", "Unleashes a sweeping burst of fire suited for the harshest late-game threats.", "能放出覆蓋範圍極大的灼炎爆發，應對高壓後期威脅。"),
    makeSkill("support", "Beast of Resolve", "聖獸決意", "Its recruitment reinforces the Johto beast chain that leads to Ho-Oh.", "牠是城都聖獸招募鏈的重要一環，最終通往鳳王。"),
  ],
  "245": [
    makeSkill("life", "Pure Spring", "清泉淨域", "Purifies tainted water and helps troubled habitats recover their balance.", "可淨化受污染水域，協助失衡棲地回復穩定。"),
    makeSkill("attack", "Aqua Dash", "淨流衝刺", "Strikes with graceful momentum while sweeping contamination from its path.", "以優雅卻強勁的水流衝擊，順勢洗去沿路污染。"),
    makeSkill("support", "Beast of Mercy", "聖獸慈流", "Completes the legendary beast route that unlocks the final bell recipes.", "是完成聖獸路線、解鎖終極鈴鐺配方的重要一角。"),
  ],
  "249": [
    makeSkill("life", "Tidal Bell", "海神鈴鐺", "Answers the crafted Tidal Bell and emerges when the legendary birds are fully resolved.", "會回應海神鈴鐺，在三神鳥路線完整收束後現身。"),
    makeSkill("attack", "Ocean Wing", "深海翼擊", "Sweeps the battlefield with immense wing force and pressure from the deep sea.", "以來自深海的龐大翼壓橫掃戰場，威勢驚人。"),
    makeSkill("support", "Abyss Guard", "深洋守護", "Embodies the calm, vast authority of the sea once coastal routes are mastered.", "當海岸與傳說鳥路線完成後，牠象徵整片海洋的終極守護。"),
  ],
  "250": [
    makeSkill("life", "Clear Bell", "透明鈴鐺", "Descends only after the final Johto beast has been recruited from the Dream Islands.", "只有在夢境群島招募完最後一隻城都聖獸後才會降臨。"),
    makeSkill("attack", "Rainbow Flame", "虹焰天火", "Bathes the area in sacred fire and brilliant avian force from the heavens.", "能以神聖彩焰與神鳥之力覆蓋整片區域。"),
    makeSkill("support", "Sky Blessing", "天穹祝福", "Represents the completion of the beast route and the reward of full perseverance.", "象徵三聖獸路線圓滿完成，也是堅持探索後的最高回報。"),
  ],
  "425": [
    makeSkill("life", "Dream Ferry", "夢境運輸", "Carries dolls and travelers into randomly generated Dream Islands.", "能帶著娃娃與旅人前往隨機生成的夢境群島。"),
    makeSkill("attack", "Floating Feint", "飄行佯擊", "Slips around obstacles and startles targets with drifting aerial pressure.", "可繞開障礙並以飄移軌跡製造出奇不意的壓迫。"),
    makeSkill("support", "Route Beacon", "路線引渡", "Determines which dream biome you reach based on the entrusted doll.", "會依照交付的娃娃種類，把你引向不同夢境生物群系。"),
  ],
  "465": [
    makeSkill("life", "Field Research", "野外調查", "Reads the state of the world and frames each region's next restoration target.", "能判讀世界現況，並定義每個區域下一個復育目標。"),
    makeSkill("attack", "Vine Lash", "藤蔓鞭擊", "Whips out long-reaching vines to control terrain and keep danger at bay.", "可用長距離藤蔓控制地形，並把威脅隔離在外。"),
    makeSkill("support", "Quest Guidance", "任務導引", "Professor Tangrowth anchors the story and keeps Ditto moving toward the true ending.", "作為巨蔓藤博士，牠負責串起全劇，帶領百變怪走向真正結局。"),
  ],
  "479": [
    makeSkill("life", "Town Broadcast", "聚落播送", "Keeps the settlement lively with sound, current, and responsive machines.", "以聲音、電流與活化設備讓聚落保持生氣。"),
    makeSkill("attack", "Static Spin", "靜電迴旋", "Crackles with fast electrical arcs that can jolt nearby hazards into place.", "可釋放快速電弧，震住周邊危險裝置或擾動目標。"),
    makeSkill("support", "Mood Uplift", "氛圍提振", "As the resident DJ, it gives rebuilt towns identity rather than mere functionality.", "作為 DJ 角色，牠讓重建聚落不只有功能，還真正擁有生活感。"),
  ],
  "534": [
    makeSkill("life", "Concrete Mix", "混凝土攪拌", "Operates the mixer and turns limestone into construction-grade concrete.", "可操作攪拌機，把石灰岩加工成可施工的混凝土。"),
    makeSkill("attack", "Pillar Crush", "巨柱重擊", "Uses builder's strength to break obstacles and force open sealed paths.", "能以工匠級力量粉碎障礙，強行打開封閉路線。"),
    makeSkill("support", "Crew Coordination", "工班協調", "Acts as a backbone member of major construction crews in the Skylands.", "是空島大型施工隊的重要骨幹成員。"),
  ],
  "568": [
    makeSkill("life", "Scrap Sorting", "廢料分揀", "Breaks down beach junk into usable iron ore and paper inputs.", "可把海灘垃圾分解成鐵礦與紙張原料。"),
    makeSkill("attack", "Trash Toss", "廢料投擲", "Flings compacted refuse to disrupt hazards and clear tight work zones.", "能把壓實垃圾當作投擲物，清出狹窄作業空間。"),
    makeSkill("support", "Waste Conversion", "廢料轉化", "Turns the most neglected materials in the game into industrial progress.", "能把最不起眼的垃圾直接轉化成推進工業鏈的關鍵資源。"),
  ],
  "569": [
    makeSkill("life", "Heavy Recycle", "重型回收", "Processes huge refuse piles at scale and keeps automation supplied with ore.", "能大規模處理廢料堆，穩定供應自動化系統所需礦料。"),
    makeSkill("attack", "Debris Surge", "垃圾洪擊", "Uses sheer refuse mass to overwhelm obstacles and hard-to-clear spaces.", "以龐大垃圾量壓制障礙，清出難以處理的區域。"),
    makeSkill("support", "Automation Backbone", "自動化支柱", "Forms the late-game factory trio with Aipom and Pikachu.", "與長尾怪手、皮卡丘共同構成後期自動化工廠三人組。"),
  ],
  "700": [
    makeSkill("life", "Ribbon Harmony", "緞帶和鳴", "Adds warmth and beauty to carefully curated Palette Town habitats.", "能為精心布置的真新鎮棲地增添柔和又明亮的氛圍。"),
    makeSkill("attack", "Charm Gleam", "魅光閃耀", "Radiates fairy light that repels gloom and steadies anxious surroundings.", "能放出妖精光輝，驅散低迷氣氛並穩定周遭環境。"),
    makeSkill("support", "Celebration Aura", "慶典光環", "Rewards broad exploration by brightening the endgame sandbox's social atmosphere.", "作為廣泛探索的回報，牠能讓終局沙盒更有節慶般的生命力。"),
  ],
  "820": [
    makeSkill("life", "Field Kitchen", "野外料理", "Turns raw ingredients into bread, patties, and morale-boosting meals.", "可把原料轉成麵包、漢堡排與振奮士氣的料理。"),
    makeSkill("attack", "Pan Slam", "平底鍋重擊", "Uses kitchen strength and heavy utensils to smash through immediate threats.", "能用厚重鍋具與驚人臂力擊退眼前威脅。"),
    makeSkill("support", "Burger Boost", "漢堡強化", "Chef Dente's dishes are the key to upgrading Ditto's Rock Smash power.", "作為主廚 Dente，牠做出的料理正是強化百變怪碎岩能力的關鍵。"),
  ],
  "959": [
    makeSkill("life", "Forge Work", "鍛造作業", "Forges the special gears needed to raise lifts and complete sky projects.", "可鍛造升降平台與空島工程所需的特殊齒輪。"),
    makeSkill("attack", "Hammer Crash", "巨鎚猛擊", "Brings down a decisive hammer strike suited for metal-heavy obstacles.", "能用巨鎚打出決定性重擊，對金屬障礙尤其有效。"),
    makeSkill("support", "Lift Platform", "升降平台", "Tinkmaster enables the vertical expansion that defines Sparkling Skylands.", "作為 Tinkmaster，牠讓閃耀空島的垂直拓展真正成為可能。"),
  ],
};

function getTypeAttack(primaryType) {
  return attackProfiles[primaryType] || attackProfiles.Normal;
}

function getAttackProfile(pokemon, primaryType) {
  if (primaryType === "Normal" || primaryType === "UNKNOWN") {
    return specialtyAttackProfiles[pokemon.specialtyEn] || getTypeAttack(primaryType);
  }
  return specialtyAttackProfiles[pokemon.specialtyEn] || getTypeAttack(primaryType);
}

function getLifeProfile(pokemon) {
  return lifeProfiles[pokemon.specialtyEn] || roleFallbacks[pokemon.roleEn] || lifeProfiles["—"];
}

function getSupportProfile(pokemon) {
  return supportProfiles[pokemon.specialtyEn] || roleFallbacks[pokemon.roleEn] || supportProfiles["—"];
}

function buildSkills(pokemon) {
  if (pokemonOverrides[pokemon.id]) {
    return pokemonOverrides[pokemon.id];
  }

  const primaryType = (pokemon.typesEn || []).find((type) => type && type !== "UNKNOWN") || "Normal";
  const [lifeEn, lifeZh, lifeDetailEn, lifeDetailZh] = getLifeProfile(pokemon);
  const [attackEn, attackZh, attackDetailEn, attackDetailZh] = getAttackProfile(pokemon, primaryType);
  const [supportEn, supportZh, supportDetailEn, supportDetailZh] = getSupportProfile(pokemon);

  return [
    makeSkill("life", lifeEn, lifeZh, lifeDetailEn, lifeDetailZh),
    makeSkill("attack", attackEn, attackZh, attackDetailEn, attackDetailZh),
    makeSkill("support", supportEn, supportZh, supportDetailEn, supportDetailZh),
  ];
}

data.pokemon = data.pokemon.map((pokemon) => ({
  ...pokemon,
  skills: buildSkills(pokemon),
}));

fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Updated skills for ${data.pokemon.length} Pokedex entries.`);
