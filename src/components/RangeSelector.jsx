const RANGES = ['1W', '1M', '3M', '1Y'];

export default function RangeSelector({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {RANGES.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange?.(r)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            active === r
              ? 'bg-blue-500 text-white'
              : 'border border-zinc-600 bg-zinc-800 text-zinc-300 hover:border-blue-500/40'
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
