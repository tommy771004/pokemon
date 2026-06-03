import fs from 'fs';
const eventData = JSON.parse(fs.readFileSync('remote_event.json', 'utf8'));
console.log(JSON.stringify(eventData.map(p => p.name), null, 2));

const excludedData = JSON.parse(fs.readFileSync('public/data/excluded_pokemon.json', 'utf8'));
console.log("Excluded names:", excludedData.pokemon.map(p => p.nameZh));
