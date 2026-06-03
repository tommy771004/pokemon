import fs from 'fs';

const pokedex = JSON.parse(fs.readFileSync('public/data/pokedex.json', 'utf8'));

for (const p of pokedex.pokemon) {
    if (p.pokopia) {
        p.favorites = p.pokopia.favorites;
        p.habitats = p.pokopia.habitats;
        p.timeOfDay = p.pokopia.timeOfDay;
        p.weather = p.pokopia.weather;
        p.environmentPreference = p.pokopia.environmentPreference;
        p.obtainMethod = p.pokopia.obtainMethod;
        p.obtainDetails = p.pokopia.obtainDetails;
        p.evolvesFrom = p.pokopia.evolvesFrom;
        p.evolvesTo = p.pokopia.evolvesTo;

        delete p.likes;
        delete p.pokopia;
    }
}

fs.writeFileSync('public/data/pokedex.json', JSON.stringify(pokedex, null, 2));
console.log("Flattened pokopia properties.");
