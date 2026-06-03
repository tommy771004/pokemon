import fs from 'fs';

const txt = fs.readFileSync('joined_new.txt', 'utf8');

// Find all JSON arrays
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
        if (snippet.length > 50000) {  // big array
            try {
                let parsed = JSON.parse(snippet);
                // check if it's items array
                if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
                    // some next_f objects are wrapped in arrays where the last elt is the data, or first.
                    // Let's just dump it if it seems to contain objects.
                    console.log("Found big array, length:", parsed.length, "string size:", snippet.length);
                    fs.writeFileSync('public/data/items.json', JSON.stringify(parsed, null, 2));
                }
            } catch(e) {}
        }
    }
    start = txt.indexOf('[', start + 1);
}
