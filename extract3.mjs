import fs from 'fs';
let text = fs.readFileSync('chunk_19.txt', 'utf8');
let jsonStr = text.match(/self\.__next_f\.push\(\[\d+,"(.*)"\]\)/s);
if (jsonStr) {
    let unescaped = jsonStr[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    fs.writeFileSync('unescaped.txt', unescaped);
    console.log("Wrote unescaped.txt", unescaped.substring(0, 100));
}
