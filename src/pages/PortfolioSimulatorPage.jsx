import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { runPortfolio } from '../api/api';
import { PORTFOLIO_DEFAULT_HOLDINGS } from '../constants/placeholderData';

export default function PortfolioSimulatorPage() {
  const [holdings, setHoldings] = useState(() =>
    PORTFOLIO_DEFAULT_HOLDINGS.map((h) => ({ ...h }))
  );
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);

  const weightSum = useMemo(
    () => holdings.reduce((acc, h) => acc + (Number(h.weight) || 0), 0),
    [holdings]
  );
  const weightsValid = Math.abs(weightSum - 100) < 0.01;

  function updateWeight(index, value) {
    const n = Number(value);
    setHoldings((prev) =>
      prev.map((h, i) => (i === index ? { ...h, weight: Number.isFinite(n) ? n : 0 } : h))
    );
  }

  async function handleRun() {
    setRunning(true);
    const data = await runPortfolio(
      holdings.map((h) => ({ ticker: h.ticker, weight: h.weight }))
    );
    setResults(data);
    setRunning(false);
  }

  return (
    <div className="min-h-full">
      <h1 className="text-xl font-semibold text-white md:text-2xl">Portfolio simulator</h1>
      <p className="mt-1 text-sm text-zinc-400">Stress-test weights against placeholder return paths.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-700/80 bg-zinc-800 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Holdings</h2>
          <div className="relative mt-4">
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
              placeholder="Search to add a stock…"
              className="w-full rounded-lg border border-zinc-600 bg-zinc-900 py-2 pl-10 pr-3 text-sm text-zinc-500 outline-none"
              disabled
            />
          </div>
          <p className="mt-2 text-xs text-zinc-600">Search is a UI placeholder — wiring comes later.</p>

          <ul className="mt-6 space-y-4">
            {holdings.map((h, i) => (
              <li
                key={h.ticker}
                className="flex flex-col gap-2 rounded-lg border border-zinc-700/60 bg-zinc-900/50 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-white">{h.ticker}</p>
                  <p className="text-sm text-zinc-400">{h.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor={`w-${h.ticker}`} className="text-sm text-zinc-400">
                    Weight %
                  </label>
                  <input
                    id={`w-${h.ticker}`}
                    type="number"
                    min={0}
                    max={100}
                    value={h.weight}
                    onChange={(e) => updateWeight(i, e.target.value)}
                    className="w-24 rounded-md border border-zinc-600 bg-zinc-900 px-2 py-1.5 text-right text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              </li>
            ))}
          </ul>

          <p
            className={`mt-4 text-sm ${weightsValid ? 'text-emerald-400' : 'text-amber-400'}`}
          >
            Weights must sum to 100% — currently {weightSum.toFixed(1)}%
          </p>

          <button
            type="button"
            disabled={!weightsValid || running}
            onClick={handleRun}
            className="mt-6 w-full rounded-lg bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {running ? 'Running…' : 'Run Simulation'}
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: 'Total Return',
                value: results ? `+${results.totalReturnPct}%` : '+23.4%',
                sub: 'placeholder run',
              },
              {
                label: 'Annualised Volatility',
                value: results ? `${results.annualizedVolatilityPct}%` : '18.2%',
                sub: results ? 'simulated' : 'placeholder',
              },
              {
                label: 'Sharpe Ratio',
                value: results ? String(results.sharpeRatio) : '1.28',
                sub: results ? 'simulated' : 'placeholder',
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-lg border border-zinc-700/80 bg-zinc-800 p-4"
              >
                <p className="text-xs uppercase tracking-wide text-zinc-500">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{card.value}</p>
                <p className="mt-1 text-xs text-zinc-600">{card.sub}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-zinc-700/80 bg-zinc-800 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Cumulative returns
            </h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={results?.cumulativeReturns ?? placeholderArea()}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fillCum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                  <XAxis dataKey="period" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} width={48} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #3f3f46',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    name="Cumulative %"
                    stroke="#3b82f6"
                    fill="url(#fillCum)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function placeholderArea() {
  const base = [];
  let v = 0;
  for (let i = 1; i <= 36; i += 1) {
    v += Math.sin(i / 4) * 0.8 + Math.sin(i / 2.2) * 0.35;
    base.push({ period: i, cumulative: Math.round(v * 10) / 10 });
  }
  return base;
}
