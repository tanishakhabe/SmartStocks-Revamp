import { addWatchlistTicker, removeWatchlistTicker } from '../utils/watchlistStorage';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/** Wraps fetch; turns opaque network/CORS failures into a clearer message. */
async function apiFetch(input, init) {
  try {
    return await fetch(input, init);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (
      e instanceof TypeError &&
      (msg === 'Failed to fetch' || msg.includes('Failed to fetch') || msg.includes('Load failed'))
    ) {
      throw new Error(
        `Cannot reach the API at ${API_BASE}. ` +
          'Start the FastAPI server (e.g. uvicorn on port 8000), confirm VITE_API_URL, ' +
          'and open the app from the same host as in CORS (localhost vs 127.0.0.1 both allowed in backend).'
      );
    }
    throw e;
  }
}

/** Calendar-day windows used to slice daily history returned by the API (currently up to ~3mo). */
const RANGE_DAY_WINDOWS = { '1W': 7, '1M': 31, '3M': 92, '1Y': 366 };

export function sliceHistoryByRange(history, range) {
  const sorted = [...(history || [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  if (!sorted.length) return sorted;
  const endMs = new Date(sorted[sorted.length - 1].date).getTime();
  const days = RANGE_DAY_WINDOWS[range] ?? RANGE_DAY_WINDOWS['1M'];
  const startMs = endMs - days * 86400000;
  return sorted.filter((p) => new Date(p.date).getTime() >= startMs);
}

export function chartPointsFromHistory(history, range) {
  return sliceHistoryByRange(history, range).map((p) => ({
    date: p.date,
    price: p.price,
    label: chartLabelFromDate(p.date),
  }));
}

function chartLabelFromDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/**
 * Live quote + full daily history from FastAPI `GET /stock/{ticker}` (yfinance).
 * Call once per ticker; slice with `chartPointsFromHistory` when the chart range changes.
 */
export async function getStockDetail(ticker) {
  const upper = String(ticker || '').trim().toUpperCase();
  if (!upper) throw new Error('Missing ticker');
  const res = await apiFetch(`${API_BASE}/stock/${encodeURIComponent(upper)}`);
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    const text = await res.text();
    try {
      const body = JSON.parse(text);
      if (body?.detail != null) {
        message = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail);
      }
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }
  const raw = await res.json();
  const history = Array.isArray(raw.history)
    ? raw.history.map((p) => ({ date: p.date, price: Number(p.price) }))
    : [];
  const div = raw.dividend_yield;
  let dividendYieldPct = null;
  if (div != null && Number.isFinite(div)) {
    dividendYieldPct = div <= 1 ? div * 100 : div;
  }
  const pe = raw.pe_ratio;
  const quote = {
    ticker: raw.ticker,
    name: raw.name,
    sector: raw.sector,
    price: raw.price,
    changePct: raw.change_pct,
    marketCap: raw.market_cap,
    peRatio: pe != null && Number.isFinite(pe) ? pe : null,
    dividendYieldPct,
    week52High: raw.week_52_high,
    week52Low: raw.week_52_low,
    volume: raw.volume ?? 0,
  };
  return { quote, history };
}

/** Same HTTP resource as `getStockDetail`; returns quote only (avoids re-mapping at call sites). */
export async function getStockQuote(ticker) {
  const { quote } = await getStockDetail(ticker);
  return quote;
}

/**
 * KNN recommendations from FastAPI `POST /recommend/`.
 * @returns {Promise<{ ticker: string, match_pct: number }[]>}
 */
export async function postRecommend(body) {
  const res = await apiFetch(`${API_BASE}/recommend/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    let message = `Recommend failed (${res.status})`;
    try {
      const errBody = JSON.parse(text);
      if (errBody?.detail != null) {
        message = typeof errBody.detail === 'string' ? errBody.detail : JSON.stringify(errBody.detail);
      }
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Invalid response from recommend API');
  }
  const list = data?.recommendations;
  if (!Array.isArray(list)) return [];
  return list;
}

/** Persists ticker to localStorage watchlist (client-only). */
export function addFavorite(ticker) {
  const upper = String(ticker || '').trim().toUpperCase();
  if (!upper) {
    return Promise.reject(new Error('Missing ticker'));
  }
  const added = addWatchlistTicker(upper);
  return Promise.resolve({
    ok: true,
    ticker: upper,
    added,
    savedAt: new Date().toISOString(),
  });
}

export function removeFavorite(ticker) {
  const upper = String(ticker || '').trim().toUpperCase();
  if (!upper) {
    return Promise.reject(new Error('Missing ticker'));
  }
  removeWatchlistTicker(upper);
  return Promise.resolve({ ok: true, ticker: upper });
}
