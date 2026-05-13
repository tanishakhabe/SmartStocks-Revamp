/**
 * Sector labels aligned with Yahoo Finance / yfinance `info["sector"]`
 * (same strings as `GET /stock/{ticker}` and `sector_map.parquet` after
 * re-running Notebook 01). Keeps dashboard sector pills and onboarding
 * filters consistent with card badges.
 *
 * @see https://pypi.org/project/yfinance/ (GICS-style sector names)
 */
export const SECTORS = [
  'Basic Materials',
  'Communication Services',
  'Consumer Cyclical',
  'Consumer Defensive',
  'Energy',
  'Financial Services',
  'Healthcare',
  'Industrials',
  'Real Estate',
  'Technology',
  'Utilities',
  'Unknown',
];
