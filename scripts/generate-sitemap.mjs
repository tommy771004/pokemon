/**
 * Sitemap generator for Pokopia Chronicles.
 *
 * Builds public/sitemap.xml from the static routes plus every guide section
 * id found in public/data/guide.json, so adding a guide automatically adds a
 * sitemap entry. Run on every `vite build` via the Vite plugin in
 * vite.config.ts, and standalone via `npm run generate:sitemap`.
 *
 * The site origin is read from VITE_SITE_URL (falls back to the production
 * domain) so preview/staging deploys can emit their own canonical URLs.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_SITE_URL = "https://pokopiachronicles.com";

/** Static, always-present routes (mirrors the <Route> table in src/App.tsx). */
const STATIC_ROUTES = ["/", "/pokedex", "/characters", "/map", "/guide"];

/** Escape the five XML predefined entities so URLs (e.g. ?id=a&b) stay valid. */
function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function readGuideIds(root) {
  const guidePath = path.resolve(root, "public/data/guide.json");
  const raw = JSON.parse(fs.readFileSync(guidePath, "utf-8"));
  const guides = Array.isArray(raw.guides) ? raw.guides : [];
  return guides.map((g) => g.id).filter(Boolean);
}

/** Build the sitemap XML string. `root` is the repo root. */
export function generateSitemapXml(root, siteUrl = process.env.VITE_SITE_URL || DEFAULT_SITE_URL) {
  const base = siteUrl.replace(/\/+$/, "");
  const lastmod = new Date().toISOString().slice(0, 10);

  const guideUrls = readGuideIds(root).map((id) => `/guide?id=${id}`);
  const paths = [...STATIC_ROUTES, ...guideUrls];

  const entries = paths
    .map((p) => {
      const loc = escapeXml(p === "/" ? `${base}/` : `${base}${p}`);
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

/** Generate and write public/sitemap.xml. Returns the absolute output path. */
export function writeSitemap(root, siteUrl) {
  const xml = generateSitemapXml(root, siteUrl);
  const outPath = path.resolve(root, "public/sitemap.xml");
  fs.writeFileSync(outPath, xml, "utf-8");
  return outPath;
}

// Run directly: `node scripts/generate-sitemap.mjs`
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const outPath = writeSitemap(root);
  console.log(`[sitemap] wrote ${path.relative(root, outPath)}`);
}
