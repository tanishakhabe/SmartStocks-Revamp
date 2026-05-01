export default function StatPanel({ stats }) {
  return (
    <dl className="space-y-3 rounded-lg border border-zinc-700/80 bg-zinc-800 p-4">
      {stats.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-4 border-b border-zinc-700/50 pb-3 last:border-0 last:pb-0"
        >
          <dt className="text-sm text-zinc-400">{row.label}</dt>
          <dd className="text-right text-sm font-medium text-white">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
