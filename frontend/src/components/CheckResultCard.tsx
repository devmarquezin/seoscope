import type { SEOCheckResult, SEOCheckStatus } from '../types/analysis'

interface CheckResultCardProps {
  result: SEOCheckResult
}

const statusConfig: Record<
  SEOCheckStatus,
  {
    label: string
    symbol: string
    badgeClass: string
    iconClass: string
    progressClass: string
  }
> = {
  success: {
    label: 'Aprovado',
    symbol: '✓',
    badgeClass: 'border-emerald-800 bg-emerald-950/60 text-emerald-300',
    iconClass: 'bg-emerald-950 text-emerald-300 ring-emerald-900',
    progressClass: 'bg-emerald-400',
  },
  warning: {
    label: 'Atenção',
    symbol: '!',
    badgeClass: 'border-amber-800 bg-amber-950/60 text-amber-300',
    iconClass: 'bg-amber-950 text-amber-300 ring-amber-900',
    progressClass: 'bg-amber-300',
  },
  error: {
    label: 'Erro',
    symbol: '×',
    badgeClass: 'border-rose-800 bg-rose-950/60 text-rose-300',
    iconClass: 'bg-rose-950 text-rose-300 ring-rose-900',
    progressClass: 'bg-rose-400',
  },
}

export function CheckResultCard({ result }: CheckResultCardProps) {
  const status = statusConfig[result.status]
  const percentage =
    result.maxScore > 0
      ? Math.min(100, Math.max(0, (result.score / result.maxScore) * 100))
      : 0

  return (
    <article className="rounded-2xl border border-seo-border bg-seo-surface p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-1 ${status.iconClass}`}
          aria-hidden="true"
        >
          {status.symbol}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-seo-text">{result.name}</h3>
              <span
                className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${status.badgeClass}`}
              >
                {status.label}
              </span>
            </div>

            <p className="shrink-0 text-sm text-seo-text/60">
              <span className="text-lg font-semibold text-seo-text">{result.score}</span>
              /{result.maxScore} pontos
            </p>
          </div>

          <div
            className="mt-4 h-1.5 overflow-hidden rounded-full bg-seo-bg"
            role="progressbar"
            aria-label={`Pontuação de ${result.name}`}
            aria-valuemin={0}
            aria-valuemax={result.maxScore}
            aria-valuenow={result.score}
          >
            <div
              className={`h-full rounded-full ${status.progressClass}`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="mt-4 text-base leading-7 text-seo-text/80">
            {result.message}
          </p>

          {result.recommendation && (
            <div className="mt-4 rounded-xl border border-seo-border bg-seo-bg/65 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-seo-text/50">
                Recomendação
              </p>
              <p className="mt-1 text-sm leading-6 text-seo-text/75">
                {result.recommendation}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
