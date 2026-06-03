import fs from 'fs';

const html = fs.readFileSync('items.html', 'utf8');
const count = html.split('items').length - 1;
console.log("Count of 'items':", count);

const iLoc = html.indexOf('items');
if (iLoc !== -1) {
    console.log("Context:", html.substring(Math.max(0, iLoc - 50), iLoc + 50));
}
