import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ErrorBanner from '../components/ErrorBanner';
import RangeSelector from '../components/RangeSelector';
import StatPanel from '../components/StatPanel';
import { getHistory, getQuote, addFavorite } from '../api/api';

function formatChange(pct) {
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

export default function StockDetailPage() {
  const { ticker } = useParams();
  const [range, setRange] = useState('1M');
  const [sma20, setSma20] = useState(false);
  const [sma50, setSma50] = useState(false);
  const [quote, setQuote] = useState(null);
  const [series, setSeries] = useState([]);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [q, h] = await Promise.all([getQuote(ticker), getHistory(ticker, range)]);
      if (cancelled) return;
      setQuote(q);
      setSeries(h.points || []);
    })();
    return () => {
      cancelled = true;
    };
  }, [ticker, range]);

  const chartData = useMemo(() => {
    return series.map((p, i) => ({
      ...p,
      sma20: sma20 ? p.price * (0.97 + (i % 5) * 0.002) : undefined,
      sma50: sma50 ? p.price * (0.95 + (i % 7) * 0.0015) : undefined,
    }));
  }, [series, sma20, sma50]);

  const stats = useMemo(() => {
    if (!quote) return [];
    return [
      { label: 'Price', value: `$${quote.price.toFixed(2)}` },
      {
        label: 'Change',
        value: (
          <span className={quote.changePct >= 0 ? 'text-emerald-400' : 'text-red-400'}>
            {formatChange(quote.changePct)}
          </span>
        ),
      },
      { label: 'Volume', value: `${(quote.volume / 1e6).toFixed(1)}M` },
      { label: 'Market Cap', value: quote.marketCap },
      { label: 'P/E Ratio', value: String(quote.peRatio) },
      {
        label: '52wk High',
        value: `$${quote.week52High.toFixed(2)}`,
      },
      {
        label: '52wk Low',
        value: `$${quote.week52Low.toFixed(2)}`,
      },
      {
        label: 'Dividend Yield',
        value: `${quote.dividendYield.toFixed(2)}%`,
      },
    ];
  }, [quote]);

  async function handleSaveWatchlist() {
    await addFavorite(ticker);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2200);
  }

  return (
    <div className="min-h-full">
      <nav className="text-sm text-zinc-500">
        <Link to="/dashboard" className="hover:text-blue-400">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-300">{ticker}</span>
      </nav>

      {!bannerDismissed ? (
        <div className="mt-4">
          <ErrorBanner
            message="Live quote delayed — showing cached placeholder data."
            onDismiss={() => setBannerDismissed(true)}
          />
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-[60%]">
          {quote ? (
            <div>
              <h1 className="text-2xl font-bold text-white">{quote.ticker}</h1>
              <p className="text-zinc-400">{quote.name}</p>
            </div>
          ) : (
            <div className="h-16 animate-pulse rounded bg-zinc-800" />
          )}

          <div className="mt-6 rounded-lg border border-zinc-700/80 bg-zinc-800 p-4">
            <div className="h-72 w-full md:h-80">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                    <XAxis dataKey="label" tick={{ fill: '#a1a1aa', fontSize: 10 }} interval={6} />
                    <YAxis
                      domain={['auto', 'auto']}
                      tick={{ fill: '#a1a1aa', fontSize: 10 }}
                      width={56}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: '1px solid #3f3f46',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#e4e4e7' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="price"
                      name="Price"
                      stroke="#3b82f6"
                      dot={false}
                      strokeWidth={2}
                    />
                    {sma20 ? (
                      <Line
                        type="monotone"
                        dataKey="sma20"
                        name="SMA-20"
                        stroke="#a78bfa"
                        dot={false}
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                      />
                    ) : null}
                    {sma50 ? (
                      <Line
                        type="monotone"
                        dataKey="sma50"
                        name="SMA-50"
                        stroke="#fbbf24"
                        dot={false}
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                      />
                    ) : null}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                  Loading chart…
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <RangeSelector active={range} onChange={setRange} />
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={sma20}
                    onChange={(e) => setSma20(e.target.checked)}
                    className="rounded border-zinc-600 bg-zinc-900 text-blue-500 focus:ring-blue-500/40"
                  />
                  SMA-20
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={sma50}
                    onChange={(e) => setSma50(e.target.checked)}
                    className="rounded border-zinc-600 bg-zinc-900 text-blue-500 focus:ring-blue-500/40"
                  />
                  SMA-50
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-[40%] lg:min-w-[280px]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Key stats</h2>
          <div className="mt-3">
            <StatPanel stats={stats} />
          </div>

          <div className="mt-6 rounded-lg border border-zinc-700/80 bg-zinc-800 p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-white">AI Analysis</h2>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                Bullish
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Fundamentals and momentum align with peer leaders in this sector. Near-term sentiment is
              constructive with manageable volatility versus the sector median. Watch upcoming earnings
              for confirmation of margin trajectory.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveWatchlist}
            className="mt-6 w-full rounded-lg bg-blue-500 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            {savedFlash ? 'Saved to watchlist' : 'Save to Watchlist'}
          </button>
        </div>
      </div>
    </div>
  );
}
