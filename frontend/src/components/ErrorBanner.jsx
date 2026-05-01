export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-lg border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-200"
      role="alert"
    >
      <span>{message}</span>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-red-100 underline-offset-2 hover:underline"
        >
          Dismiss
        </button>
      ) : null}
    </div>
  );
}
