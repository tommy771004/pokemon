import fs from 'fs';

(async () => {
    const res = await fetch("https://pokopiaguide.com/data/items.json");
    if (res.ok) {
        fs.writeFileSync("items_direct.json", await res.text());
        console.log("Success");
    } else {
        console.log("Error:", res.status);
    }
})();
