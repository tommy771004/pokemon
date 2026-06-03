import fs from 'fs';
const remoteData = JSON.parse(fs.readFileSync('remote_pokedex.json', 'utf8'));

console.log(remoteData.slice(0, 20).map(r => r.name + ": " + r.id));
