import { useMemo, useState } from 'react';
import SkeletonCard from '../components/SkeletonCard';
import StockCard from '../components/StockCard';
import { SECTORS } from '../constants/sectors';
import { useStocks } from '../hooks/useStocks';

export default function DashboardPage({ isLoading = false }) {
  const { recommendations } = useStocks();
  const [query, setQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');

  const filtered = useMemo(() => {
    return recommendations.filter((s) => {
      const matchesSector = sectorFilter === 'All' || s.sector === sectorFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        s.ticker.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q);
      return matchesSector && matchesQuery;
    });
  }, [recommendations, sectorFilter, query]);

  return (
    <div className="min-h-full">
      <div className="border-b border-zinc-800 bg-zinc-900/95 pb-6 pt-2 md:pt-0">
        <h1 className="text-xl font-semibold text-white md:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">Personalized picks based on your profile.</p>

        <div className="relative mt-6 max-w-xl">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Search tickers or companies…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-4 text-sm text-white outline-none ring-blue-500/30 placeholder:text-zinc-500 focus:ring-2"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSectorFilter('All')}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              sectorFilter === 'All'
                ? 'bg-blue-500 text-white'
                : 'border border-zinc-600 bg-zinc-800 text-zinc-300 hover:border-zinc-500'
            }`}
          >
            All
          </button>
          {SECTORS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSectorFilter(s)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                sectorFilter === s
                  ? 'bg-blue-500 text-white'
                  : 'border border-zinc-600 bg-zinc-800 text-zinc-300 hover:border-zinc-500'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)
          : filtered.map((stock) => <StockCard key={stock.ticker} stock={stock} />)}
      </div>

      {!isLoading && filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-zinc-500">
          No matches for this filter. Try another sector or search term.
        </p>
      ) : null}
    </div>
  );
}
