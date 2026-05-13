# SmartStocks (frontend)

Vite + React application. Run all `npm` commands from this **`frontend/`** directory.

## Running with the FastAPI backend

1. **Backend** (from repo `backend/`, with dependencies installed): start Uvicorn on port **8000**, for example `uvicorn main:app --reload`. The API should answer at `http://localhost:8000/health`.
2. **Frontend**: `npm run dev` — Vite serves the app (default **http://localhost:5173**).
3. **Base URL**: set **`VITE_API_URL`** to the API origin if it is not `http://localhost:8000`. A default is checked in at build time from [`src/api/api.js`](src/api/api.js); for local dev you can use [`.env.development`](.env.development) (`VITE_API_URL=http://localhost:8000`).

The FastAPI app allows browser origins **`http://localhost:5173`** and **`http://127.0.0.1:5173`** (and preview ports) so `fetch` from Vite is not blocked by CORS. Use **`localhost`** or **`127.0.0.1`** consistently for both tabs if you hit network errors.

[`src/api/api.js`](src/api/api.js) calls **`GET /stock/{ticker}`**, **`POST /recommend/`**, and wraps `fetch` with clearer errors when the server is unreachable.

## Files created (manifest)

Paths below are relative to **`frontend/`**.

| Path | Purpose |
|------|---------|
| `.env.development` | Optional `VITE_API_URL` for local API host |
| `package.json` | Dependencies and npm scripts |
| `vite.config.js` | Vite + React plugin + `@` alias to `src/` |
| `tailwind.config.js` | Tailwind content paths and Inter extension |
| `postcss.config.js` | PostCSS pipeline for Tailwind |
| `index.html` | Root HTML + Google Fonts (Inter) |
| `public/vite.svg` | Vite favicon asset |
| `src/main.jsx` | React root + Router + `AuthProvider` |
| `src/App.jsx` | Route table and authenticated shell |
| `src/index.css` | Tailwind layers + base body styles |
| `src/context/AuthContext.jsx` | Username + login/logout |
| `src/api/api.js` | `fetch` helpers for stock detail, recommendations, chart slicing; watchlist add/remove delegates to storage |
| `src/constants/sectors.js` | Yahoo Finance sector labels for onboarding & filters (aligned with `sector_map` / `GET /stock`) |
| `src/constants/riskLevels.js` | `RISK_LEVELS` copy + ids |
| `src/constants/ProfilePreferences.js` | Growth / balanced / income options |
| `src/utils/recommendPreferences.js` | `localStorage` for onboarding → `POST /recommend/` body |
| `src/utils/watchlistStorage.js` | `localStorage` tickers + event when watchlist changes |
| `src/hooks/useStocks.js` | Dashboard: load preferences → recommend → enrich cards with live quotes |
| `src/hooks/useWatchlist.js` | Watchlist page: load tickers from storage → enrich with `GET /stock` |
| `src/components/StockCard.jsx` | Dashboard recommendation card |
| `src/components/SkeletonCard.jsx` | Loading placeholder matching card footprint |
| `src/components/ErrorBanner.jsx` | Dismissible banner |
| `src/components/Sidebar.jsx` | Responsive nav + user + logout |
| `src/components/RangeSelector.jsx` | 1W / 1M / 3M / 1Y buttons |
| `src/components/StatPanel.jsx` | Key/value stats list |
| `src/components/SparklineChart.jsx` | Minimal Recharts line for watchlist rows |
| `src/pages/LoginPage.jsx` | Email/password → `onLogin` prop |
| `src/pages/RegisterPage.jsx` | Registration form |
| `src/pages/OnboardingPage.jsx` | Four-step preferences; saves `recommendPreferences` (+ legacy `userProfile`) |
| `src/pages/DashboardPage.jsx` | Search, sector pills, grid / skeleton |
| `src/pages/StockDetailPage.jsx` | Detail charts, stats, save to watchlist |
| `src/pages/WatchlistPage.jsx` | Sorted list + sparklines + empty state |

---

## Scripts

From **`frontend/`**:

- `npm install` — install dependencies  
- `npm run dev` — start Vite dev server  
- `npm run build` — production build  
- `npm run preview` — preview production build  

## Flow

1. Open `/` → redirects to `/login`. Sign in sets display name and sends you to `/onboarding`.
2. Finish onboarding → `/dashboard` (preferences stored for recommendations).
3. Authenticated routes (`/dashboard`, `/stock/:ticker`, `/watchlist`) use the sidebar layout.

## UI toggles

- **Dashboard skeletons:** In `src/App.jsx`, pass `isLoading={true}` to `DashboardPage` to show eight `SkeletonCard` placeholders instead of live cards.
- **Watchlist empty state:** Visit `/watchlist?empty=1` to preview the empty layout without editing data.

## Stack

React 18, Vite, Tailwind CSS (`tailwind.config.js`), React Router v6, Recharts — no UI kit; Tailwind only.
