import type { SEOCheckResult } from '../types/analysis'
import { CheckResultCard } from './CheckResultCard'

interface AnalysisResultsProps {
  results: SEOCheckResult[]
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  return (
    <section
      className="mt-10 max-w-4xl"
      aria-labelledby="analysis-results-title"
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2
            id="analysis-results-title"
            className="text-2xl font-semibold text-seo-text"
          >
            Verificações técnicas
          </h2>
          <p className="mt-1 text-sm text-seo-text/60">
            Revise os pontos encontrados e as recomendações de melhoria.
          </p>
        </div>
        <p className="shrink-0 text-sm text-seo-text/50">
          {results.length} resultados
        </p>
      </div>

      <ol className="grid gap-4">
        {results.map((result) => (
          <li key={result.id}>
            <CheckResultCard result={result} />
          </li>
        ))}
      </ol>
    </section>
  )
}
