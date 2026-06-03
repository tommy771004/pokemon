import fs from 'fs';
let unescaped = fs.readFileSync('unescaped.txt', 'utf8');

// find eventPokemon array
let match = unescaped.match(/"eventPokemon":(\[\{.*?\}\]),"locale"/);
if (match) {
    fs.writeFileSync('remote_event.json', match[1]);
    console.log("Extracted eventPokemon array successfully, length:", match[1].length);
} else {
    console.log("Still could not find it");
}
