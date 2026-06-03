import fs from 'fs';
let unescaped = fs.readFileSync('unescaped.txt', 'utf8');

// find regularPokemon array
let match = unescaped.match(/"regularPokemon":(\[\{.*?\}\]),"eventPokemon"/);
if (match) {
    fs.writeFileSync('remote_pokedex.json', match[1]);
    console.log("Extracted regularPokemon array successfully, length:", match[1].length);
} else {
    console.log("Still could not find it");
}
