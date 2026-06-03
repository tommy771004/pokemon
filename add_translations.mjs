import fs from 'fs';

const zhTransl = JSON.parse(fs.readFileSync('src/locales/zh/translation.json', 'utf8'));
const enTransl = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));

zhTransl.pokopia = {
    fav: {
        "bitter_flavors": "苦味",
        "blocky_stuff": "塊狀物",
        "cleanliness": "整潔",
        "colorful_stuff": "色彩斑斕的物品",
        "complicated_stuff": "複雜的機制",
        "construction": "建築工程",
        "consturction": "建築工程",
        "containers": "容器與箱子",
        "cute_stuff": "可愛的事物",
        "dry_flavors": "澀味",
        "electronics": "電子設備",
        "exercise": "鍛鍊與運動",
        "fabric": "布料與紡織",
        "garbage": "垃圾與廢料",
        "gatherings": "聚會",
        "glass_stuff": "玻璃製品",
        "group_activities": "團體活動",
        "hard_stuff": "堅硬的物體",
        "healing": "療癒與康復",
        "letter_and_words": "書信與文字",
        "letters_and_words": "書信與文字",
        "looks_like_food": "像食物的東西",
        "lots_of_dirt": "大量的泥土",
        "lots_of_fire": "烈火與熱源",
        "lots_of_nature": "豐富的自然環境",
        "lots_of_water": "充沛的水源",
        "luxury": "奢華品",
        "metal_stuff": "金屬物品",
        "nice_breezes": "舒適的微風",
        "noisy_stuff": "嘈雜的聲響",
        "ocean_vibes": "海洋氣息",
        "play_spaces": "遊戲空間",
        "pretty_flowers": "美麗的花朵",
        "rides": "乘騎設施",
        "round_stuff": "圓形的物體",
        "sharp_stuff": "尖銳的物體",
        "shiny_stuff": "閃亮的物品",
        "slender_objects": "細長的物體",
        "soft_stuff": "柔軟的物品",
        "sour_flavors": "酸味",
        "spicy_flavors": "辣味",
        "spinning_stuff": "旋轉的物體",
        "spooky_stuff": "詭異恐怖的物品",
        "stone_stuff": "石材與岩石",
        "strange_stuff": "奇怪的物品",
        "sweet_flavors": "甜味",
        "symbols": "符號與圖騰",
        "watching_stuff": "觀賞用物品",
        "wobbly_stuff": "搖晃的物品",
        "woblly_stuff": "搖晃的物品",
        "wooden_stuff": "木製品"
    },
    tod: {
        "dawn": "清晨",
        "day": "白天",
        "dusk": "傍晚",
        "night": "夜晚"
    },
    weather: {
        "cloudy": "陰天",
        "rainy": "雨天",
        "sunny": "晴天"
    },
    env: {
        "bright": "明亮",
        "cool": "涼爽",
        "dark": "昏暗",
        "dry": "乾燥",
        "moist": "潮濕",
        "warm": "溫暖"
    },
    method: {
        "craft": "工作臺製作",
        "dream-island": "夢之島招募",
        "event": "特殊活動",
        "habitat": "棲息地自然生成",
        "quest": "解謎與探索任務",
        "story": "主線故事解鎖"
    }
};

enTransl.pokopia = {
    fav: {
        "bitter_flavors": "Bitter flavors",
        "blocky_stuff": "Blocky stuff",
        "cleanliness": "Cleanliness",
        "colorful_stuff": "Colorful stuff",
        "complicated_stuff": "Complicated stuff",
        "construction": "Construction",
        "consturction": "Construction",
        "containers": "Containers",
        "cute_stuff": "Cute stuff",
        "dry_flavors": "Dry flavors",
        "electronics": "Electronics",
        "exercise": "Exercise",
        "fabric": "Fabric",
        "garbage": "Garbage",
        "gatherings": "Gatherings",
        "glass_stuff": "Glass stuff",
        "group_activities": "Group activities",
        "hard_stuff": "Hard stuff",
        "healing": "Healing",
        "letter_and_words": "Letters and words",
        "letters_and_words": "Letters and words",
        "looks_like_food": "Looks like food",
        "lots_of_dirt": "Lots of dirt",
        "lots_of_fire": "Lots of fire",
        "lots_of_nature": "Lots of nature",
        "lots_of_water": "Lots of water",
        "luxury": "Luxury",
        "metal_stuff": "Metal stuff",
        "nice_breezes": "Nice breezes",
        "noisy_stuff": "Noisy stuff",
        "ocean_vibes": "Ocean vibes",
        "play_spaces": "Play spaces",
        "pretty_flowers": "Pretty flowers",
        "rides": "Rides",
        "round_stuff": "Round stuff",
        "sharp_stuff": "Sharp stuff",
        "shiny_stuff": "Shiny stuff",
        "slender_objects": "Slender objects",
        "soft_stuff": "Soft stuff",
        "sour_flavors": "Sour flavors",
        "spicy_flavors": "Spicy flavors",
        "spinning_stuff": "Spinning stuff",
        "spooky_stuff": "Spooky stuff",
        "stone_stuff": "Stone stuff",
        "strange_stuff": "Strange stuff",
        "sweet_flavors": "Sweet flavors",
        "symbols": "Symbols",
        "watching_stuff": "Watching stuff",
        "wobbly_stuff": "Wobbly stuff",
        "woblly_stuff": "Wobbly stuff",
        "wooden_stuff": "Wooden stuff"
    },
    tod: {
        "dawn": "Dawn",
        "day": "Day",
        "dusk": "Dusk",
        "night": "Night"
    },
    weather: {
        "cloudy": "Cloudy",
        "rainy": "Rainy",
        "sunny": "Sunny"
    },
    env: {
        "bright": "Bright",
        "cool": "Cool",
        "dark": "Dark",
        "dry": "Dry",
        "moist": "Moist",
        "warm": "Warm"
    },
    method: {
        "craft": "Crafting",
        "dream-island": "Dream Island",
        "event": "Special Event",
        "habitat": "Habitat Generation",
        "quest": "Quest & Exploration",
        "story": "Story Unlock"
    }
};

fs.writeFileSync('src/locales/zh/translation.json', JSON.stringify(zhTransl, null, 2));
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(enTransl, null, 2));

console.log("Translation definitions updated.");
