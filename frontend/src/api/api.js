import {
  DASHBOARD_CARD_STOCKS,
  PLACEHOLDER_STOCKS,
  PORTFOLIO_DEFAULT_HOLDINGS,
  SECTOR_BAR_DATA,
  SECTOR_SCATTER_DATA,
  SECTOR_TABLE_ROWS,
  WATCHLIST_PLACEHOLDER,
  generateCumulativeReturns,
  generateSinWaveSeries,
} from '../constants/placeholderData';
import { SECTORS } from '../constants/sectors';

const delay = (ms = 180) => new Promise((r) => setTimeout(r, ms));

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

export function getRecommendations() {
  return delay().then(() => clone(DASHBOARD_CARD_STOCKS));
}

export function getQuote(ticker) {
  const upper = String(ticker || '').toUpperCase();
  const stock =
    PLACEHOLDER_STOCKS.find((s) => s.ticker === upper) || PLACEHOLDER_STOCKS[0];
  return delay().then(() =>
    clone({
      ...stock,
      volume: 48_200_000,
      marketCap: '2.95T',
      peRatio: 31.2,
      week52High: stock.price * 1.08,
      week52Low: stock.price * 0.82,
      dividendYield: 0.52,
    })
  );
}

export function getHistory(ticker, range = '1M') {
  const upper = String(ticker || '').toUpperCase();
  const stock =
    PLACEHOLDER_STOCKS.find((s) => s.ticker === upper) || PLACEHOLDER_STOCKS[0];
  const base = stock.price * 0.92;
  const series = generateSinWaveSeries(50, base, stock.price * 0.06);
  return delay().then(() =>
    clone({
      ticker: upper,
      range,
      points: series.map((p, i) => ({
        ...p,
        date: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String(
          (i % 28) + 1
        ).padStart(2, '0')}`,
      })),
    })
  );
}

export function getSectors() {
  return delay().then(() =>
    clone({
      sectors: SECTORS,
      bar: SECTOR_BAR_DATA,
      scatter: SECTOR_SCATTER_DATA,
      table: SECTOR_TABLE_ROWS,
    })
  );
}

export function runPortfolio(weights) {
  return delay(240).then(() =>
    clone({
      weights,
      totalReturnPct: 23.4,
      annualizedVolatilityPct: 18.2,
      sharpeRatio: 1.28,
      cumulativeReturns: generateCumulativeReturns(36),
      holdings: PORTFOLIO_DEFAULT_HOLDINGS.map((h) => ({
        ...h,
        contributionPct: h.weight * 0.22,
      })),
    })
  );
}

export function addFavorite(ticker) {
  const upper = String(ticker || '').toUpperCase();
  return delay().then(() =>
    clone({ ok: true, ticker: upper, savedAt: new Date().toISOString() })
  );
}

export function removeFavorite(ticker) {
  const upper = String(ticker || '').toUpperCase();
  return delay().then(() => clone({ ok: true, ticker: upper }));
}
