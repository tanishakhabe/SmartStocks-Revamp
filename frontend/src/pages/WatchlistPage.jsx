import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SparklineChart from '../components/SparklineChart';
import { useStocks } from '../hooks/useStocks';

function formatChange(pct) {
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

export default function WatchlistPage() {
  const { watchlistItems } = useStocks();
  const [searchParams] = useSearchParams();
  const demoEmpty = searchParams.get('empty') === '1';
  const [sortBy, setSortBy] = useState('name');

  const items = demoEmpty ? [] : watchlistItems;

  const sorted = useMemo(() => {
    const copy = [...items];
    if (sortBy === 'name') {
      copy.sort((a, b) => a.ticker.localeCompare(b.ticker));
    } else {
      copy.sort((a, b) => b.changePct - a.changePct);
    }
    return copy;
  }, [items, sortBy]);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 px-6 py-16 text-center">
        <p className="text-lg font-medium text-white">No stocks saved yet</p>
        <p className="mt-2 max-w-sm text-sm text-zinc-400">
          Browse recommendations on the dashboard and save names you want to track.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600"
        >
          Browse Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white md:text-2xl">Watchlist</h1>
          <p className="mt-1 text-sm text-zinc-400">Saved names and recent performance.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs uppercase tracking-wide text-zinc-500">Sort</span>
          <button
            type="button"
            onClick={() => setSortBy('name')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              sortBy === 'name'
                ? 'bg-blue-500 text-white'
                : 'border border-zinc-600 bg-zinc-800 text-zinc-300'
            }`}
          >
            By Name
          </button>
          <button
            type="button"
            onClick={() => setSortBy('change')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              sortBy === 'change'
                ? 'bg-blue-500 text-white'
                : 'border border-zinc-600 bg-zinc-800 text-zinc-300'
            }`}
          >
            By Daily Change
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {sorted.map((row) => {
          const positive = row.changePct >= 0;
          return (
            <Link
              key={row.ticker}
              to={`/stock/${row.ticker}`}
              className="flex flex-col gap-4 rounded-lg border border-zinc-700/80 bg-zinc-800 p-4 transition hover:border-blue-500/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div>
                  <p className="font-semibold text-white">{row.ticker}</p>
                  <p className="truncate text-sm text-zinc-400">{row.name}</p>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-between gap-6 sm:justify-end">
                <div className="text-right">
                  <p className="font-medium text-white">${row.price.toFixed(2)}</p>
                  <p className={`text-sm font-medium ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatChange(row.changePct)}
                  </p>
                </div>
                <SparklineChart data={row.sparkline} positive={positive} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
