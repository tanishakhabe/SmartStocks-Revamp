import { SECTORS } from './sectors';

/** Deterministic sin-wave series for realistic-looking charts (no flat lines). */
export function generateSinWaveSeries(pointCount = 50, base = 180, amplitude = 14) {
  return Array.from({ length: pointCount }, (_, i) => {
    const t = i / 4.2;
    const wobble =
      Math.sin(t) * amplitude +
      Math.sin(t * 1.7) * (amplitude * 0.35) +
      Math.sin(t * 0.31) * (amplitude * 0.22);
    const price = base + wobble + Math.sin(i / 11) * 3;
    return {
      index: i,
      label: `D${i + 1}`,
      price: Math.round(price * 100) / 100,
      value: Math.round(price * 100) / 100,
    };
  });
}

export function generateSparklineSeries(points = 7, base = 100) {
  return Array.from({ length: points }, (_, i) => ({
    i,
    v:
      base +
      Math.sin(i / 1.4) * 4 +
      Math.sin(i * 0.8) * 2.5 +
      (i / points) * 1.2,
  }));
}

export function generateCumulativeReturns(points = 40) {
  let cum = 1;
  return Array.from({ length: points }, (_, i) => {
    const daily =
      0.002 + Math.sin(i / 5) * 0.008 + Math.sin(i / 2.2) * 0.004;
    cum *= 1 + daily;
    return {
      period: i + 1,
      cumulative: Math.round((cum - 1) * 10000) / 100,
    };
  });
}

/** Exact tickers with sectors, prices, daily change — used across the app. */
export const PLACEHOLDER_STOCKS = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    price: 189.42,
    changePct: 1.24,
    knnMatch: 0.94,
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    price: 412.18,
    changePct: -0.38,
    knnMatch: 0.91,
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Communication Services',
    price: 168.95,
    changePct: 0.72,
    knnMatch: 0.89,
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'Consumer Cyclical',
    price: 182.3,
    changePct: -1.05,
    knnMatch: 0.87,
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    price: 118.76,
    changePct: 2.41,
    knnMatch: 0.96,
  },
  {
    ticker: 'JPM',
    name: 'JPMorgan Chase & Co.',
    sector: 'Financials',
    price: 198.55,
    changePct: 0.19,
    knnMatch: 0.82,
  },
  {
    ticker: 'JNJ',
    name: 'Johnson & Johnson',
    sector: 'Healthcare',
    price: 156.2,
    changePct: -0.11,
    knnMatch: 0.85,
  },
  {
    ticker: 'XOM',
    name: 'Exxon Mobil Corporation',
    sector: 'Energy',
    price: 112.88,
    changePct: 0.66,
    knnMatch: 0.79,
  },
  {
    ticker: 'WMT',
    name: 'Walmart Inc.',
    sector: 'Consumer Defensive',
    price: 79.45,
    changePct: -0.42,
    knnMatch: 0.83,
  },
  {
    ticker: 'PG',
    name: 'The Procter & Gamble Company',
    sector: 'Consumer Defensive',
    price: 164.12,
    changePct: 0.08,
    knnMatch: 0.81,
  },
];

export const DASHBOARD_CARD_STOCKS = PLACEHOLDER_STOCKS.slice(0, 8);

export const SECTOR_BAR_DATA = SECTORS.map((name, i) => ({
  sector: name,
  momentum: Math.round((12 + Math.sin(i * 0.9) * 8 + i * 0.4) * 10) / 10,
}));

export const SECTOR_SCATTER_DATA = SECTORS.map((name, i) => ({
  sector: name,
  volatility: Math.round((18 + Math.cos(i * 0.7) * 6 + i * 0.3) * 10) / 10,
  momentum: Math.round((10 + Math.sin(i * 1.1) * 9 + i * 0.25) * 10) / 10,
}));

export const SECTOR_TABLE_ROWS = SECTORS.map((name, i) => ({
  sector: name,
  avgPe: Math.round((14 + Math.sin(i) * 6 + i) * 10) / 10,
  avgMomentum: Math.round((8 + Math.cos(i * 0.8) * 7) * 10) / 10,
  avgVol: `${(1.2 + Math.sin(i * 0.5) * 0.4).toFixed(1)}B`,
  matchScore: Math.round(72 + Math.sin(i * 1.3) * 18),
}));

export const WATCHLIST_PLACEHOLDER = PLACEHOLDER_STOCKS.slice(0, 4).map(
  (s) => ({
    ...s,
    sparkline: generateSparklineSeries(7, s.price * 0.98),
  })
);

export const PORTFOLIO_DEFAULT_HOLDINGS = [
  { ticker: 'AAPL', name: 'Apple Inc.', weight: 40 },
  { ticker: 'MSFT', name: 'Microsoft Corporation', weight: 35 },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', weight: 25 },
];
