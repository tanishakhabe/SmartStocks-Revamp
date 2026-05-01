import { useMemo } from 'react';
import { DASHBOARD_CARD_STOCKS, WATCHLIST_PLACEHOLDER } from '../constants/placeholderData';

/**
 * Stub hook returning placeholder recommendations and watchlist data.
 * Swap in `api.js` fetch helpers when the backend is available.
 */
export function useStocks() {
  return useMemo(
    () => ({
      recommendations: DASHBOARD_CARD_STOCKS,
      watchlistItems: WATCHLIST_PLACEHOLDER,
      isLoading: false,
    }),
    []
  );
}
