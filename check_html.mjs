import fs from 'fs';
const html = fs.readFileSync('items.html', 'utf8');
console.log("HTML length:", html.length);
console.log(html.substring(html.length - 2000));
