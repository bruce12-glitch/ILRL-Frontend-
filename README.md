# ILRL — Frontend

Public lab website for the Inference-in-Loop & Recurrence Lab (ILRL).
React 19 + Vite 7 + TypeScript + Tailwind CSS 4. Hash-routed single-page app
(`vite-plugin-singlefile` inlines everything into one `dist/index.html`).

Pages: Home, Research, Publications, People. Site content lives in
`src/data/lab.ts` — edit people, papers, projects and news there.

Backend API (optional): [`ILRL-Backend`](https://github.com/bruce12-glitch/ILRL-Backend).

## Prerequisites

- Node.js 22 (see `.nvmrc`)

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_URL to your local backend URL
npm run dev            # http://localhost:5173
```

## Scripts

| Command           | Purpose                              |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Local dev server                     |
| `npm run build`   | Production build → `dist/index.html` |
| `npm run preview` | Preview the production build         |
| `npm run typecheck` | TypeScript check, no emit          |

## Environment

| Variable       | Purpose                              | Default                 |
| -------------- | ------------------------------------ | ----------------------- |
| `VITE_API_URL` | Base URL of the backend API          | `http://localhost:5000` |

Only `VITE_`-prefixed variables reach the browser. `.env` is git-ignored;
`.env.example` documents the expected values. All backend calls go through
`src/utils/api.ts` (`API_BASE` + `apiFetch`), so the base URL is never
hardcoded in pages.

## Project structure

```
src/
├── components/   # Nav, Footer, Diagrams, Reveal, icons
├── data/lab.ts   # Site content (single source of truth)
├── pages/        # Home, Research, Publications, People
├── utils/        # api.ts (env-based client), cn.ts
├── router.tsx    # Hash router (#/research, #/people, …)
├── App.tsx
└── main.tsx
```

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs `npm ci`, `typecheck`
and `build` on pushes/PRs to `main`.
