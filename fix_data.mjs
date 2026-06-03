import fs from 'fs';

// Read original pokedex from git history to revert the destructive filter
// I didn't actually overwrite it completely, I can just use my localData which might be messed up now
// Ah wait, `filter.mjs` overwrote `public/data/pokedex.json` and `public/data/excluded_pokemon.json`!
// Let me use `git restore` first!
