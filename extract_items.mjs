import fs from 'fs';

const html = fs.readFileSync('items.html', 'utf8');
const start = html.indexOf('<script id="__NEXT_DATA__"');
if (start !== -1) {
    const end = html.indexOf('</script>', start);
    const scriptTag = html.substring(start, end);
    const jsonStr = scriptTag.substring(scriptTag.indexOf('>') + 1);
    fs.writeFileSync('next_data.json', jsonStr);
    console.log("Extracted next_data.json");
} else {
    // maybe app routing?
    const chunks = html.match(/self\.__next_f\.push\([^)]+\)/g);
    if (chunks) {
        fs.writeFileSync('next_chunks.json', chunks.join('\n'));
        console.log("Extracted next_chunks.json");
    } else {
        console.log("Not found");
    }
}
