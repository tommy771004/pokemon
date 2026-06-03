import fs from 'fs';

const html = fs.readFileSync('items.html', 'utf8');
const regex = /\[\{[^\]]+\]/g;
let match;
let largest = "";
while ((match = regex.exec(html)) !== null) {
    if (match[0].length > largest.length && match[0].includes("id")) {
        largest = match[0];
    }
}
fs.writeFileSync('largest_array.json', largest);
console.log("Largest array length:", largest.length);
