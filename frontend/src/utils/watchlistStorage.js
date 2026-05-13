const KEY = 'smartstocks_watchlist_tickers';

export const WATCHLIST_UPDATED_EVENT = 'smartstocks-watchlist';

function dispatchUpdated() {
  window.dispatchEvent(new Event(WATCHLIST_UPDATED_EVENT));
}

export function loadWatchlistTickers() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    const out = [];
    const seen = new Set();
    for (const t of arr) {
      const u = String(t || '').trim().toUpperCase();
      if (!u || seen.has(u)) continue;
      seen.add(u);
      out.push(u);
    }
    return out;
  } catch {
    return [];
  }
}

/** @returns {boolean} true if newly added */
export function addWatchlistTicker(ticker) {
  const upper = String(ticker || '').trim().toUpperCase();
  if (!upper) return false;
  const cur = loadWatchlistTickers();
  if (cur.includes(upper)) return false;
  cur.push(upper);
  localStorage.setItem(KEY, JSON.stringify(cur));
  dispatchUpdated();
  return true;
}

export function removeWatchlistTicker(ticker) {
  const upper = String(ticker || '').trim().toUpperCase();
  if (!upper) return;
  const next = loadWatchlistTickers().filter((t) => t !== upper);
  localStorage.setItem(KEY, JSON.stringify(next));
  dispatchUpdated();
}
