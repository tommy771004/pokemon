import fs from 'fs';
const data = JSON.parse(fs.readFileSync('public/data/pokedex.json', 'utf8'));
const favs = new Set();
const tod = new Set();
const weather = new Set();
const envs = new Set();
const methods = new Set();

data.pokemon.forEach(p => {
    (p.favorites || []).forEach(f => favs.add(f));
    (p.timeOfDay || []).forEach(t => tod.add(t));
    (p.weather || []).forEach(w => weather.add(w));
    if (p.environmentPreference) envs.add(p.environmentPreference);
    if (p.obtainMethod) methods.add(p.obtainMethod);
});

console.log('FAVS:', [...favs].sort().join(', '));
console.log('TOD:', [...tod].sort().join(', '));
console.log('WEATHER:', [...weather].sort().join(', '));
console.log('ENVS:', [...envs].sort().join(', '));
console.log('METHODS:', [...methods].sort().join(', '));
