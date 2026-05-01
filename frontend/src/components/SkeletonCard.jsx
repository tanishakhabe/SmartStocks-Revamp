export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-zinc-700/80 bg-zinc-800 p-4">
      <div className="flex justify-between gap-2">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-16 rounded bg-zinc-700" />
          <div className="h-3 w-3/4 max-w-[180px] rounded bg-zinc-700/80" />
        </div>
        <div className="h-6 w-20 shrink-0 rounded-full bg-zinc-700/80" />
      </div>
      <div className="mt-4 flex justify-between">
        <div className="space-y-2">
          <div className="h-6 w-24 rounded bg-zinc-700" />
          <div className="h-4 w-16 rounded bg-zinc-700/70" />
        </div>
        <div className="space-y-2 text-right">
          <div className="ml-auto h-3 w-10 rounded bg-zinc-700/60" />
          <div className="ml-auto h-4 w-14 rounded bg-zinc-700/70" />
        </div>
      </div>
    </div>
  );
}
