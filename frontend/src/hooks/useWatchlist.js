import { useCallback, useEffect, useState } from 'react';
import { getStockDetail } from '../api/api';
import { loadWatchlistTickers, WATCHLIST_UPDATED_EVENT } from '../utils/watchlistStorage';

function historyToSparkline(history) {
  const pts = (history || []).slice(-7);
  return pts.map((p, i) => ({ i, v: p.price }));
}

/**
 * Watchlist rows for the UI: loads tickers from localStorage and enriches via GET /stock/{ticker}.
 */
export function useWatchlist() {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const tickers = loadWatchlistTickers();
    if (!tickers.length) {
      setWatchlistItems([]);
      setIsLoading(false);
      return;
    }
    try {
      const settled = await Promise.allSettled(
        tickers.map(async (t) => {
          const { quote, history } = await getStockDetail(t);
          const sparkline = historyToSparkline(history);
          return {
            ticker: quote.ticker,
            name: quote.name,
            price: quote.price,
            changePct: quote.changePct,
            sparkline:
              sparkline.length > 0 ? sparkline : [{ i: 0, v: quote.price }],
          };
        })
      );
      const rows = settled
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value);
      setWatchlistItems(rows);
      if (rows.length < tickers.length) {
        setError('Some watchlist symbols could not be loaded.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load watchlist');
      setWatchlistItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(WATCHLIST_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(WATCHLIST_UPDATED_EVENT, refresh);
  }, [refresh]);

  return { watchlistItems, isLoading, error, refresh };
}
