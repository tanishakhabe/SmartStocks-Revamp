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

const API_BASE = 'http://localhost:8000';

const delay = (ms = 180) => new Promise((r) => setTimeout(r, ms));

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

export function getRecommendations() {
  // Read user profile from localStorage (saved during onboarding)
  const profileStr = localStorage.getItem('userProfile');
  if (!profileStr) {
    // Fallback to placeholder if no profile saved yet
    return delay().then(() => clone(DASHBOARD_CARD_STOCKS));
  }

  const profile = JSON.parse(profileStr);

  // POST to /recommend endpoint
  return fetch(`${API_BASE}/recommend/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sectors: profile.sectors,
      risk_tolerance: profile.risk_tolerance,
      growth_profile: profile.growth_profile,
      investment_horizon: profile.investment_horizon,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      // Convert backend response to dashboard card format
      return data.recommendations.map((rec) => ({
        ticker: rec.ticker,
        name: rec.ticker, // Will be fetched separately if needed
        price: 0,
        change: 0,
        changePercent: 0,
        matchPercent: rec.match_pct,
      }));
    });
}

export function getQuote(ticker) {
  const upper = String(ticker || '').toUpperCase();

  return fetch(`${API_BASE}/stock/${upper}`)
    .then((res) => {
      if (!res.ok) throw new Error(`Ticker ${upper} not found`);
      return res.json();
    })
    .then((data) => ({
      ticker: data.ticker,
      name: data.name,
      sector: data.sector,
      price: data.price,
      change: 0, // Will calculate from change_pct if needed
      changePercent: data.change_pct,
      volume: data.volume,
      marketCap: data.market_cap,
      peRatio: data.pe_ratio,
      week52High: data.week_52_high,
      week52Low: data.week_52_low,
      dividendYield: data.dividend_yield,
    }));
}

export function getHistory(ticker, range = '1M') {
  const upper = String(ticker || '').toUpperCase();

  return fetch(`${API_BASE}/stock/${upper}`)
    .then((res) => {
      if (!res.ok) throw new Error(`Ticker ${upper} not found`);
      return res.json();
    })
    .then((data) => ({
      ticker: upper,
      range,
      points: data.history.map((point) => ({
        date: point.date,
        price: point.price,
      })),
    }));
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
