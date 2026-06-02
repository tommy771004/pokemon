const fs = require('fs');
const path = require('path');
const OpenCC = require('opencc-js');

async function convertFiles() {
  // Use s2twp: Simplified to Traditional (Taiwan) with phrases
  const converter = OpenCC.Converter({ from: 'cn', to: 'twp' });
  
  const filesToConvert = [
    'public/data/characters.json',
    'public/data/guide.json',
    'public/data/home.json',
    'public/data/map.json',
    'public/data/pokedex.json',
    'src/locales/zh/translation.json',
    'docs/info1.md',
    'docs/info2.md',
    'docs/info3.md',
    'docs/info4.md',
    'src/pages/Guide.tsx',
    'src/components/Layout.tsx',
    'src/pages/Home.tsx',
    'src/pages/Pokedex.tsx',
    'src/pages/Map.tsx',
    'src/pages/Characters.tsx'
  ];

  for (const file of filesToConvert) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const converted = converter(content);
      if (content !== converted) {
        fs.writeFileSync(filePath, converted, 'utf8');
        console.log(`Converted: ${file}`);
      } else {
        console.log(`No changes needed: ${file}`);
      }
    } else {
      console.log(`File not found: ${file}`);
    }
  }
}

convertFiles().catch(console.error);
