import fs from 'fs';

let content = fs.readFileSync('joined.txt', 'utf8');

// The items might be in an array containing an object with "source" or "materials"
let matchIndex = content.indexOf('"category":');
let lastIndex = 0;
while (matchIndex !== -1 && lastIndex < 10) {
    console.log("Found category at:", matchIndex);
    console.log("Context:", content.substring(Math.max(0, matchIndex - 50), matchIndex + 100));
    matchIndex = content.indexOf('"category":', matchIndex + 1);
    lastIndex++;
}

