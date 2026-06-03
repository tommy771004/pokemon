import fs from 'fs';

const content = fs.readFileSync('next_chunks.json', 'utf8');
let jsonLines = [];
const regex = /self\.__next_f\.push\(\[\d+,\s*"(.*?)"\]\)/g;
let match;
while ((match = regex.exec(content)) !== null) {
    let str = match[1];
    str = str.replace(/\\"/g, '"')
             .replace(/\\\\/g, '\\')
             .replace(/\\n/g, '\n');
    jsonLines.push(str);
}

const joined = jsonLines.join('');
fs.writeFileSync('joined.txt', joined);
console.log("Joined lines");

let itemMatch = joined.match(/"items":\s*(\[\{.*?\}\])/);
if (itemMatch) {
    console.log("Found items array in joined!");
    fs.writeFileSync('items_raw.json', itemMatch[1]);
} else {
    console.log("Not found in joined");
}
