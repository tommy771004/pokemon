import fs from 'fs';

let localData = JSON.parse(fs.readFileSync('public/data/pokedex.json', 'utf8'));
let excludedData = JSON.parse(fs.readFileSync('public/data/excluded_pokemon.json', 'utf8'));

// All available pokemon (the combined dataset)
const allPokemons = [...localData.pokemon, ...excludedData.pokemon];

// Dedup just to be safe
const uniqueMap = new Map();
for (const p of allPokemons) {
    uniqueMap.set(p.nameZh, p);
}
const allUniquePokemons = Array.from(uniqueMap.values());

const remoteData = JSON.parse(fs.readFileSync('remote_pokedex.json', 'utf8'));
const eventData = JSON.parse(fs.readFileSync('remote_event.json', 'utf8'));
const allRemote = [...remoteData, ...eventData];

const validNames = new Set(allRemote.map(p => p.name));

const newPokemon = [];
const excludedPokemon = [];

for (const p of allUniquePokemons) {
    if (validNames.has(p.nameZh)) {
        newPokemon.push(p);
    } else {
        excludedPokemon.push(p);
    }
}

// Sort the newPokemon by their original National Dex ID
newPokemon.sort((a,b) => parseInt(a.id) - parseInt(b.id));

console.log("Matched strictly by name:", newPokemon.length);
console.log("Excluded:", excludedPokemon.length);

fs.writeFileSync('public/data/pokedex.json', JSON.stringify({ pokemon: newPokemon }, null, 2));
fs.writeFileSync('public/data/excluded_pokemon.json', JSON.stringify({ pokemon: excludedPokemon }, null, 2));

console.log("Done carefully refiltering!");
