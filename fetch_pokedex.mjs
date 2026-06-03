import fs from 'fs';

async function run() {
  try {
    const res = await fetch('https://pokopiaguide.com/zh/pokedex');
    const html = await res.text();
    fs.writeFileSync('pokemon_html.txt', html);
    console.log('done, total length:', html.length);
  } catch (e) {
    console.log('error', e);
  }
}
run();
