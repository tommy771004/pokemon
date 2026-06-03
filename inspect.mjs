import fs from 'fs';
const remoteData = JSON.parse(fs.readFileSync('remote_pokedex.json', 'utf8'));
console.log(JSON.stringify(remoteData[0], null, 2));
console.log("Total regular pokemon count:", remoteData.length);
