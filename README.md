# SmartStocks

## Files created (manifest)

| Path | Purpose |
|------|---------|
| `package.json` | Dependencies and npm scripts |
| `vite.config.js` | Vite + React plugin + `@` alias to `src/` |
| `tailwind.config.js` | Tailwind content paths and Inter extension |
| `postcss.config.js` | PostCSS pipeline for Tailwind |
| `index.html` | Root HTML + Google Fonts (Inter) |
| `public/vite.svg` | Vite favicon asset |
| `.gitignore` | Ignores `node_modules`, `dist`, etc. |
| `src/main.jsx` | React root + Router + `AuthProvider` |
| `src/App.jsx` | Route table and authenticated shell |
| `src/index.css` | Tailwind layers + base body styles |
| `src/context/AuthContext.jsx` | Username + login/logout |
| `src/api/api.js` | Stub API helpers returning placeholder payloads |
| `src/constants/sectors.js` | `SECTORS` list (10) |
| `src/constants/riskLevels.js` | `RISK_LEVELS` copy + ids |
| `src/constants/placeholderData.js` | Tickers, charts helpers, sector aggregates |
| `src/hooks/useStocks.js` | Stub hook for recommendations + watchlist |
| `src/components/StockCard.jsx` | Dashboard recommendation card |
| `src/components/SkeletonCard.jsx` | Loading placeholder matching card footprint |
| `src/components/ErrorBanner.jsx` | Dismissible red banner |
| `src/components/Sidebar.jsx` | Responsive nav + user + logout |
| `src/components/RangeSelector.jsx` | 1W / 1M / 3M / 1Y buttons |
| `src/components/StatPanel.jsx` | Key/value stats list |
| `src/components/SparklineChart.jsx` | Minimal Recharts line for watchlist rows |
| `src/pages/LoginPage.jsx` | Email/password → `onLogin` prop |
| `src/pages/RegisterPage.jsx` | Registration form → onboarding |
| `src/pages/OnboardingPage.jsx` | 3-step preferences wizard |
| `src/pages/DashboardPage.jsx` | Search, sector pills, grid / skeleton |
| `src/pages/StockDetailPage.jsx` | Detail charts, stats, AI card, error banner |
| `src/pages/WatchlistPage.jsx` | Sorted list + sparklines + empty state |
| `src/pages/SectorAnalysisPage.jsx` | Bar + scatter + table |
| `src/pages/PortfolioSimulatorPage.jsx` | Weights + simulation results |

---

## Scripts

- `npm install` — install dependencies  
- `npm run dev` — start Vite dev server  
- `npm run build` — production build  
- `npm run preview` — preview production build  

## Flow

1. Open `/` → redirects to `/login`. Sign in sets display name and sends you to `/onboarding`.
2. Finish onboarding → `/dashboard`.
3. Authenticated routes (`/dashboard`, `/stock/:ticker`, `/watchlist`, `/sectors`, `/portfolio`) use the sidebar layout.

## UI toggles

- **Dashboard skeletons:** In `src/App.jsx`, pass `isLoading={true}` to `DashboardPage` to show eight `SkeletonCard` placeholders instead of live cards.
- **Watchlist empty state:** Visit `/watchlist?empty=1` to preview the empty layout without editing data.

## Stack

React 18, Vite, Tailwind CSS (`tailwind.config.js`), React Router v6, Recharts — no UI kit; Tailwind only.
