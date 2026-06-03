import fs from 'fs';

(async () => {
    try {
        const res = await fetch("https://pokopiaguide.com/zh/items");
        const html = await res.text();
        fs.writeFileSync("items.html", html);
        console.log("Fetched items.html");
    } catch (e) {
        console.error(e);
    }
})();
