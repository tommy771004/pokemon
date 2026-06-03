import fs from 'fs';

const localData = JSON.parse(fs.readFileSync('public/data/pokedex.json', 'utf8'));
const remoteData = JSON.parse(fs.readFileSync('remote_pokedex.json', 'utf8'));

// build a set of valid IDs
const validIds = new Set(remoteData.map(p => String(p.id).padStart(3, '0')));
// also match by nameZh just in case id doesn't match perfectly
const validNames = new Set(remoteData.map(p => p.name));

const newPokemon = [];
const excludedPokemon = [];

for (const p of localData.pokemon) {
    if (validIds.has(p.id) || validNames.has(p.nameZh)) {
        newPokemon.push(p);
    } else {
        excludedPokemon.push(p);
    }
}

console.log("Matched:", newPokemon.length);
console.log("Excluded:", excludedPokemon.length);

fs.writeFileSync('public/data/pokedex.json', JSON.stringify({ pokemon: newPokemon }, null, 2));

// load existing excluded if any
let existingExcluded = { pokemon: [] };
if (fs.existsSync('public/data/excluded_pokemon.json')) {
    existingExcluded = JSON.parse(fs.readFileSync('public/data/excluded_pokemon.json', 'utf8'));
}
const allExcluded = existingExcluded.pokemon.concat(excludedPokemon);
fs.writeFileSync('public/data/excluded_pokemon.json', JSON.stringify({ pokemon: allExcluded }, null, 2));

console.log("Done updating pokedex.json and excluded_pokemon.json");
