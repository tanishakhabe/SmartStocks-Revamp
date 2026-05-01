import { Link } from 'react-router-dom';

function formatChange(pct) {
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

export default function StockCard({ stock }) {
  const positive = stock.changePct >= 0;
  const matchPct = Math.round((stock.knnMatch ?? 0.9) * 100);

  return (
    <Link
      to={`/stock/${stock.ticker}`}
      className="block rounded-lg border border-zinc-700/80 bg-zinc-800 p-4 transition hover:border-blue-500/50 hover:bg-zinc-800/90"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-white">{stock.ticker}</p>
          <p className="mt-0.5 line-clamp-2 text-sm text-zinc-400">{stock.name}</p>
        </div>
        <span className="shrink-0 rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-400">
          {stock.sector}
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-lg font-semibold text-white">
            ${stock.price.toFixed(2)}
          </p>
          <p
            className={`text-sm font-medium ${
              positive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {formatChange(stock.changePct)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Match</p>
          <p className="text-sm font-semibold text-blue-400">{matchPct}% match</p>
        </div>
      </div>
    </Link>
  );
}
