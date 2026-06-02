import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';
import {writeSitemap} from './scripts/generate-sitemap.mjs';

/**
 * Regenerate public/sitemap.xml on every build and dev server start, derived
 * from src/App.tsx routes + public/data/guide.json. Runs in buildStart so the
 * fresh file is copied into dist/ during the public-dir copy step.
 */
function sitemapPlugin(siteUrl?: string): Plugin {
  return {
    name: 'pokopia-sitemap',
    buildStart() {
      const out = writeSitemap(__dirname, siteUrl);
      this.info?.(`generated ${path.relative(__dirname, out)}`);
    },
  };
}

/**
 * Inject the Google Search Console verification meta tag when
 * VITE_GSC_VERIFICATION is set (e.g. in the Vercel/host env or .env.local).
 * Keeps the token out of source control while still verifying on deploy.
 */
function gscVerificationPlugin(token?: string): Plugin {
  return {
    name: 'pokopia-gsc-verification',
    transformIndexHtml(html) {
      // Skip if no token, or if a verification tag is already hardcoded in index.html.
      if (!token || html.includes('google-site-verification')) return html;
      const tag = `<meta name="google-site-verification" content="${token}" />`;
      return html.replace('</head>', `    ${tag}\n  </head>`);
    },
  };
}

export default defineConfig(({mode}) => {
  // Load all env (no prefix filter) so non-VITE_ host vars are also visible.
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = env.VITE_SITE_URL || process.env.VITE_SITE_URL;
  const gscToken = env.VITE_GSC_VERIFICATION || process.env.VITE_GSC_VERIFICATION;

  return {
    plugins: [
      react(),
      tailwindcss(),
      sitemapPlugin(siteUrl),
      gscVerificationPlugin(gscToken),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
