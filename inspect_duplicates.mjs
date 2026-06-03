import fs from 'fs';

const localData = JSON.parse(fs.readFileSync('public/data/pokedex.json', 'utf8'));
const remoteData = JSON.parse(fs.readFileSync('remote_pokedex.json', 'utf8'));
const eventData = JSON.parse(fs.readFileSync('remote_event.json', 'utf8'));

const allRemote = [...remoteData, ...eventData];

const matched = [];
for (const p of localData.pokemon) {
    let found = allRemote.find(r => {
        let rs = String(r.id);
        rs = rs.length < 3 ? rs.padStart(3, '0') : rs;
        return rs === p.id || r.name === p.nameZh;
    });
    if (found) {
        matched.push({local: p.nameZh, remote: found.name, remoteId: found.id});
    }
}

let map = new Map();
for(const m of matched) {
    if (!map.has(m.remoteId)) map.set(m.remoteId, []);
    map.get(m.remoteId).push(m.local);
}

for(const [k, v] of map.entries()) {
    if (v.length > 1) {
        console.log("Remote ID:", k, "matched by:", v);
    }
}
