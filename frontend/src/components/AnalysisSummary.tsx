import type { SEOAnalysis } from '../types/analysis'

interface AnalysisSummaryProps {
  analysis: SEOAnalysis
}

const statusLabels: Record<SEOAnalysis['status'], string> = {
  excellent: 'Excelente',
  good: 'Bom',
  'needs-improvement': 'Precisa melhorar',
  critical: 'Crítico',
}

const statusClasses: Record<SEOAnalysis['status'], string> = {
  excellent: 'border-emerald-800 bg-emerald-950/60 text-emerald-300',
  good: 'border-sky-800 bg-sky-950/60 text-sky-300',
  'needs-improvement': 'border-amber-800 bg-amber-950/60 text-amber-300',
  critical: 'border-rose-800 bg-rose-950/60 text-rose-300',
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

export function AnalysisSummary({ analysis }: AnalysisSummaryProps) {
  return (
    <section
      className="mt-8 max-w-4xl overflow-hidden rounded-2xl border border-seo-border bg-seo-surface"
      aria-labelledby="analysis-summary-title"
      aria-live="polite"
    >
      <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium text-emerald-400">
            <span aria-hidden="true">✓</span>
            Análise concluída
          </p>
          <h2
            id="analysis-summary-title"
            className="mt-2 break-words text-xl font-semibold text-seo-text sm:text-2xl"
          >
            {getHostname(analysis.finalUrl)}
          </h2>
          <p className="mt-1 break-all text-sm text-seo-text/60">
            {analysis.finalUrl}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
          <p className="text-4xl font-semibold tracking-tight text-seo-text">
            {analysis.score}
            <span className="text-base font-normal text-seo-muted">/100</span>
          </p>
          <span
            className={`rounded-full border px-3 py-1 text-sm font-medium ${statusClasses[analysis.status]}`}
          >
            {statusLabels[analysis.status]}
          </span>
        </div>
      </div>

      <dl className="grid grid-cols-1 border-t border-seo-border sm:grid-cols-3">
        <div className="flex items-center justify-between border-b border-seo-border px-5 py-4 sm:block sm:border-r sm:border-b-0 sm:px-7">
          <dt className="text-sm text-seo-text/60">Aprovadas</dt>
          <dd className="text-xl font-semibold text-emerald-400 sm:mt-1">
            {analysis.summary.passed}
          </dd>
        </div>
        <div className="flex items-center justify-between border-b border-seo-border px-5 py-4 sm:block sm:border-r sm:border-b-0 sm:px-7">
          <dt className="text-sm text-seo-text/60">Avisos</dt>
          <dd className="text-xl font-semibold text-amber-300 sm:mt-1">
            {analysis.summary.warnings}
          </dd>
        </div>
        <div className="flex items-center justify-between px-5 py-4 sm:block sm:px-7">
          <dt className="text-sm text-seo-text/60">Erros</dt>
          <dd className="text-xl font-semibold text-rose-400 sm:mt-1">
            {analysis.summary.errors}
          </dd>
        </div>
      </dl>
    </section>
  )
}
