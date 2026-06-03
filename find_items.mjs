import fs from 'fs';

const html = fs.readFileSync('items.html', 'utf8');
const words = ["id", "name", "category", "rarity", "source", "crafting"];
const matches = [...html.matchAll(new RegExp(`{([^}]*?${words[0]}[^}]*)}`, 'g'))];

let longest = "";
for (const match of matches) {
    if (match[0].length > longest.length) longest = match[0];
}

console.log("Longest match length:", longest.length);
console.log(longest.substring(0, 500));
