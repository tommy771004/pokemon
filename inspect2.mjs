import fs from 'fs';
const localData = JSON.parse(fs.readFileSync('public/data/pokedex.json', 'utf8'));
console.log("Total local pokemon count:", localData.pokemon.length);
