import fs from 'fs';

let localData = JSON.parse(fs.readFileSync('public/data/pokedex.json', 'utf8'));
const remoteData = JSON.parse(fs.readFileSync('remote_pokedex.json', 'utf8'));
const eventData = JSON.parse(fs.readFileSync('remote_event.json', 'utf8'));
const allRemote = [...remoteData, ...eventData];

const remoteMap = new Map();
for (const p of allRemote) {
    remoteMap.set(p.name, p);
}

for (const p of localData.pokemon) {
    const remote = remoteMap.get(p.nameZh);
    if (remote) {
        // Just inject the remote pokopia object as is under p.pokopia
        p.pokopia = remote.pokopia;
    }
}

fs.writeFileSync('public/data/pokedex.json', JSON.stringify(localData, null, 2));
console.log("Injected pokopia data into local pokedex.");
