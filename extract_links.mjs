import fs from 'fs';

const html = fs.readFileSync('items.html', 'utf8');

const regex = /(https?:\/\/[^\s"'<]+)/g;
let links = new Set();
let match;
while ((match = regex.exec(html)) !== null) {
    if (match[1].endsWith('.json')) {
        links.add(match[1]);
    }
}
console.log("JSON links:", [...links]);
