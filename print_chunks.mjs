import fs from 'fs';
const data = fs.readFileSync('next_chunks.json', 'utf8');
console.log(data.substring(0, 2000));
