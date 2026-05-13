import { useEffect, useState } from 'react';
import { postRecommend, getStockQuote } from '../api/api';
import { loadRecommendPreferences } from '../utils/recommendPreferences';

/**
 * Loads KNN recommendations (POST /recommend/) and enriches each row with
 * GET /stock/{ticker} for StockCard fields. Preferences come from localStorage
 * (see Onboarding finish + `recommendPreferences.js`).
 */
export function useStocks() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const prefs = loadRecommendPreferences();
        const rows = await postRecommend(prefs);
        if (cancelled) return;
        if (!rows.length) {
          setRecommendations([]);
          return;
        }
        const settled = await Promise.allSettled(
          rows.map(async ({ ticker, match_pct }) => {
            const quote = await getStockQuote(ticker);
            return {
              ticker: quote.ticker,
              name: quote.name,
              sector: quote.sector,
              price: quote.price,
              changePct: quote.changePct,
              knnMatch: match_pct / 100,
            };
          })
        );
        if (cancelled) return;
        const cards = settled
          .filter((r) => r.status === 'fulfilled')
          .map((r) => r.value);
        if (cards.length === 0 && rows.length > 0) {
          setError(
            'Recommendations returned but live quotes failed. Is the stock API running?'
          );
        }
        setRecommendations(cards);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load recommendations');
          setRecommendations([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    recommendations,
    isLoading,
    error,
  };
}
