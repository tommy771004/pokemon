import fs from 'fs';

const html = fs.readFileSync('items_fetched.html', 'utf8');
let output = '';
const prefix = 'self.__next_f.push(';
const lines = html.split('\n');
let joined = '';
for (const line of lines) {
    let currentIdx = 0;
    while (true) {
        const start = line.indexOf(prefix, currentIdx);
        if (start === -1) break;
        const argStart = start + prefix.length;
        // Find matching closing parenthesis
        let bracketCount = 1;
        let end = argStart;
        while (end < line.length && bracketCount > 0) {
            if (line[end] === '(') bracketCount++;
            else if (line[end] === ')') bracketCount--;
            end++;
        }
        const jsonStr = line.substring(argStart, end - 1);
        try {
            const parsed = JSON.parse(jsonStr);
            if (Array.isArray(parsed) && parsed[0] === 1 && typeof parsed[1] === 'string') {
                joined += parsed[1];
            }
        } catch (e) {}
        currentIdx = end;
    }
}
fs.writeFileSync('joined_new.txt', joined);
console.log('Joined length:', joined.length);
