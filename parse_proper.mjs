import fs from 'fs';

const html = fs.readFileSync('items.html', 'utf8');

const prefix = 'self.__next_f.push(';
let parts = html.split(prefix);
let allStrings = [];

for (let i = 1; i < parts.length; i++) {
    let chunk = parts[i].substring(0, parts[i].indexOf('</script>') - 1);
    if (!chunk.endsWith(')')) {
        chunk = parts[i].substring(0, parts[i].indexOf(')') + 1);
    }
    if (chunk.endsWith(')')) {
        chunk = chunk.substring(0, chunk.length - 1);
    }
    try {
        let arr = JSON.parse(chunk);
        if (Array.isArray(arr) && arr.length > 1 && typeof arr[1] === 'string') {
            allStrings.push(arr[1]);
        }
    } catch(e) {
        // ignore
    }
}

const joined = allStrings.join('');
fs.writeFileSync('joined_proper.txt', joined);

// Now try to find JSON objects inside joined
let testPattern = /"items":\s*(\[\{.*\}\])/;
let m = joined.match(testPattern);
if (m) {
    console.log("Found items array:", m[1].length);
} else {
    // try to find a large array
    let arrMatch = joined.match(/\[\{.*?\}\]/g);
    if (arrMatch) {
        let largest = "";
        for (let a of arrMatch) {
            if (a.length > largest.length) {
                largest = a;
            }
        }
        console.log("Largest array length:", largest.length);
        console.log(largest.substring(0, 100));
        fs.writeFileSync('items.json', largest);
    }
}

