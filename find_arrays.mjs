import fs from 'fs';
const txt = fs.readFileSync('joined_proper.txt', 'utf8');
console.log("Length:", txt.length);
let start = txt.indexOf('[');
while(start !== -1) {
    // trying to safely parse JSON arrays
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
            console.log("Found array of length:", snippet.length);
            try {
                let parsed = JSON.parse(snippet);
                console.log("Parsed! Length:", parsed.length);
            } catch(e) {
                console.log("Parse failed", e.message);
            }
        }
    }
    start = txt.indexOf('[', start + 1);
}
