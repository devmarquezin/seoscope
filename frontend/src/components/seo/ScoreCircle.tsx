import type { AnalysisStatus } from '../../types/analysis'
import { cn } from '../../lib/utils'

const statusStroke: Record<AnalysisStatus, string> = {
  excellent: 'stroke-success',
  good: 'stroke-primary',
  'needs-improvement': 'stroke-warning',
  critical: 'stroke-danger',
}

interface ScoreCircleProps {
  score: number
  status: AnalysisStatus
}

export function ScoreCircle({ score, status }: ScoreCircleProps) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const normalizedScore = Math.min(100, Math.max(0, score))

  return (
    <div className="relative size-40" role="img" aria-label={`SEO Score ${score} de 100`}>
      <svg className="size-full -rotate-90" viewBox="0 0 128 128" aria-hidden="true">
        <circle cx="64" cy="64" r={radius} fill="none" className="stroke-secondary" strokeWidth="8" />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          className={cn('transition-[stroke-dashoffset] duration-700', statusStroke[status])}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (normalizedScore / 100) * circumference}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">SEO Score</span>
        <span className="mt-1 text-4xl font-semibold tracking-[-0.05em] text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground">de 100</span>
      </div>
    </div>
  )
}
