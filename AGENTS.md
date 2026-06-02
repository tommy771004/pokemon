# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server on port 3000
npm run build     # Production build → dist/
npm run preview   # Preview production build
npm run lint      # TypeScript type-check (no emit)
npm run clean     # Remove dist/ and server.js
```

No test runner is configured. Type checking via `npm run lint` is the primary code correctness gate.

## Architecture

**Pokopia Chronicles** is a React 19 + TypeScript editorial website for a fictional Pokémon game, built with Vite, Tailwind CSS 4, React Router v7, and i18next (EN/ZH).

### Data flow

Each page fetches its own JSON from `public/data/` using native `fetch`, stores results in local `useState`, and re-renders. There is no global state (no Context, no Redux). i18next is initialized at app root and consumed via `useTranslation()` throughout.

```
src/App.tsx          ← root router (4 routes)
src/components/
  Layout.tsx         ← shared header, nav, footer
src/pages/
  Home.tsx           ← fetches public/data/home.json
  Pokedex.tsx        ← fetches public/data/pokedex.json (type filter UI)
  Map.tsx            ← fetches public/data/map.json (hover interaction)
  Guide.tsx          ← fetches public/data/guide.json (table of contents)
src/i18n.ts          ← i18next config; default lang: zh, fallback: en
src/locales/
  en/translation.json
  zh/translation.json
src/index.css        ← Tailwind theme + 60+ CSS custom properties (MD3 palette)
```

### Key config details

- **Path alias:** `@/*` maps to repo root (configured in both `vite.config.ts` and `tsconfig.json`)
- **HMR:** disabled when `DISABLE_HMR=true` (used in AI Studio agent mode)
- **Environment:** `GEMINI_API_KEY` and `APP_URL` — see `.env.example`
- **Design tokens:** Material Design 3 warm-earthy color palette + 8px spacing unit (`xs`=8px → `xl`=128px), custom utilities: `.ambient-shadow`, `.glass-header`, `.hairline-border`

### Adding content

Game data lives in `public/data/*.json` — update those files to change displayed content without touching component code. Localized UI strings go in `src/locales/{en,zh}/translation.json`.

### Game context (docs/)

`docs/info3.md` contains comprehensive game mechanics (regions, resource chains, legendary encounters, sandbox systems). Refer to it when generating or verifying game content in the JSON data files.
