const fs = require("fs");
const path = require("path");

const pokedexPath = path.join(process.cwd(), "public/data/pokedex.json");
const excludedPath = path.join(process.cwd(), "public/data/excluded_pokemon.json");

try {
  if (!fs.existsSync(pokedexPath)) {
    console.error("pokedex.json not found!");
    process.exit(1);
  }

  if (!fs.existsSync(excludedPath)) {
    console.log("excluded_pokemon.json not found, skipping overlap cleaning.");
    process.exit(0);
  }

  const pokedexData = JSON.parse(fs.readFileSync(pokedexPath, "utf8"));
  const excludedData = JSON.parse(fs.readFileSync(excludedPath, "utf8"));

  const excludedIds = new Set(excludedData.pokemon.map(p => String(p.id).trim()));

  const initialCount = pokedexData.pokemon.length;

  const filteredPokemon = pokedexData.pokemon.filter(p => {
    const idStr = String(p.id).trim();
    const isOverlapping = excludedIds.has(idStr);
    if (isOverlapping) {
      console.log(`Found and removing overlapping Pokémon: ID ${p.id} (${p.nameEn} / ${p.nameZh})`);
    }
    return !isOverlapping;
  });

  const finalCount = filteredPokemon.length;
  const removedCount = initialCount - finalCount;

  console.log(`[Overlap Cleaner] Initial Pokémon in pokedex.json: ${initialCount}`);
  console.log(`[Overlap Cleaner] Excluded IDs loaded: ${excludedIds.size}`);
  console.log(`[Overlap Cleaner] Overlaps removed: ${removedCount}`);

  if (removedCount > 0) {
    pokedexData.pokemon = filteredPokemon;
    fs.writeFileSync(pokedexPath, JSON.stringify(pokedexData, null, 2) + "\n", "utf8");
    console.log("[Overlap Cleaner] Update complete: pokedex.json successfully pruned.");
  } else {
    console.log("[Overlap Cleaner] No overlapping Pokémon found. No changes needed.");
  }
} catch (error) {
  console.error("Error during comparison and pruning:", error);
  process.exit(1);
}
