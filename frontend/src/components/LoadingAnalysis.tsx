export function LoadingAnalysis() {
  return (
    <div
      className="mt-4 flex items-center gap-3 text-sm text-seo-text/65"
      role="status"
      aria-live="polite"
    >
      <span
        className="size-4 animate-spin rounded-full border-2 border-seo-border border-t-seo-text"
        aria-hidden="true"
      />
      <span>Analisando página...</span>
    </div>
  )
}
