<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/1fed5a9e-7582-4d06-96a6-9f00e471c91c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## SEO: sitemap & Google Search Console

- **Auto sitemap** — `npm run build` regenerates `public/sitemap.xml` from the
  routes in `src/App.tsx` plus every guide id in `public/data/guide.json`
  (`scripts/generate-sitemap.mjs`). It is copied to `dist/sitemap.xml` on every
  deploy, so adding a guide updates the sitemap with no manual edit. Run it
  standalone with `npm run generate:sitemap`.
- **Site origin** — set `VITE_SITE_URL` to control the `<loc>` host
  (defaults to `https://pokopiachronicles.com`).
- **Google Search Console** — pick "HTML tag" verification in GSC and set the
  token as `VITE_GSC_VERIFICATION` (the `content="..."` value only) in your host
  env (e.g. Vercel) or `.env.local`. The build injects
  `<meta name="google-site-verification" ...>` into `index.html`. Leave it empty
  to skip injection. See [.env.example](.env.example).
