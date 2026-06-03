import fs from 'fs';

let localData = JSON.parse(fs.readFileSync('public/data/pokedex.json', 'utf8'));
let excludedData = JSON.parse(fs.readFileSync('public/data/excluded_pokemon.json', 'utf8'));

// All available pokemon (the combined dataset)
const allPokemons = [...localData.pokemon, ...excludedData.pokemon];
const localMap = new Map();
for (const p of allPokemons) {
    localMap.set(p.nameZh, p);
}
const allUniquePokemons = Array.from(localMap.values());

const remoteData = JSON.parse(fs.readFileSync('remote_pokedex.json', 'utf8'));
const eventData = JSON.parse(fs.readFileSync('remote_event.json', 'utf8'));
const allRemote = [...remoteData, ...eventData]; // 303 pokemons

// Pokemon Types Translation Map
const typeMap = {
    normal: { en: "NORMAL", zh: "一般" }, fire: { en: "FIRE", zh: "火" }, water: { en: "WATER", zh: "水" },
    electric: { en: "ELECTRIC", zh: "電" }, grass: { en: "GRASS", zh: "草" }, ice: { en: "ICE", zh: "冰" },
    fighting: { en: "FIGHTING", zh: "格鬥" }, poison: { en: "POISON", zh: "毒" }, ground: { en: "GROUND", zh: "地面" },
    flying: { en: "FLYING", zh: "飛行" }, psychic: { en: "PSYCHIC", zh: "超能力" }, bug: { en: "BUG", zh: "蟲" },
    rock: { en: "ROCK", zh: "岩石" }, ghost: { en: "GHOST", zh: "幽靈" }, dragon: { en: "DRAGON", zh: "龍" },
    dark: { en: "DARK", zh: "惡" }, steel: { en: "STEEL", zh: "鋼" }, fairy: { en: "FAIRY", zh: "妖精" }
};

const newPokemon = [];
for (const r of allRemote) {
    let existing = localMap.get(r.name);
    if (existing) {
        // preserve the existing, but update types and image to match
        existing.id = String(r.id).padStart(3, '0');
        existing.image = r.image;
        newPokemon.push(existing);
    } else {
        let typesEn = [];
        let typesZh = [];
        for (let t of r.types) {
            if (typeMap[t]) {
                typesEn.push(typeMap[t].en);
                typesZh.push(typeMap[t].zh);
            } else {
                typesEn.push(t.toUpperCase());
                typesZh.push(t);
            }
        }
        
        let p = {
            id: String(r.id).padStart(3, '0'),
            roman: "X.", // generic
            nameEn: r.slug.charAt(0).toUpperCase() + r.slug.slice(1),
            nameZh: r.name,
            typesEn: typesEn,
            typesZh: typesZh,
            roleEn: "Resident",
            roleZh: "居民",
            specialtyEn: r.pokopia?.specialties?.[0] || "Unknown",
            specialtyZh: r.pokopia?.specialties?.[0] || "未知",
            descriptionEn: "A Pokemon discovered in the expansive Pokopia world. Awaiting further ecological observation.",
            descriptionZh: "在廣闊的 Pokopia 世界被發現的寶可夢。詳細的生態資料仍待進一步觀察。",
            image: r.image,
            known: true,
            likes: [],
            rarity: "C",
            requires_friendship: 1,
            skills: []
        };
        newPokemon.push(p);
    }
}

console.log("Generated mapped pokedex:", newPokemon.length);

fs.writeFileSync('public/data/pokedex.json', JSON.stringify({ pokemon: newPokemon }, null, 2));

const validNames = new Set(allRemote.map(p => p.name));
const excludedPokemon = [];
for (const p of allUniquePokemons) {
    if (!validNames.has(p.nameZh)) {
        excludedPokemon.push(p);
    }
}
fs.writeFileSync('public/data/excluded_pokemon.json', JSON.stringify({ pokemon: excludedPokemon }, null, 2));

console.log("Done carefully building the full pokedex!");
