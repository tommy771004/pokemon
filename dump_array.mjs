import fs from 'fs';
const txt = fs.readFileSync('joined_proper.txt', 'utf8');
let start = txt.indexOf('[');
while(start !== -1) {
    let bracketCount = 1;
    let end = start + 1;
    let inString = false;
    let escape = false;
    while(end < txt.length && bracketCount > 0) {
        let char = txt[end];
        if (inString) {
            if (escape) escape = false;
            else if (char === '\\') escape = true;
            else if (char === '"') inString = false;
        } else {
            if (char === '"') inString = true;
            else if (char === '[') bracketCount++;
            else if (char === ']') bracketCount--;
        }
        end++;
    }
    if (bracketCount === 0) {
        let snippet = txt.substring(start, end);
        if (snippet.length > 10000) {
            try {
                let parsed = JSON.parse(snippet);
                fs.writeFileSync('public/data/items.json', JSON.stringify(parsed, null, 2));
                console.log("Dumped JSON length:", snippet.length);
            } catch(e) {}
        }
    }
    start = txt.indexOf('[', start + 1);
}
