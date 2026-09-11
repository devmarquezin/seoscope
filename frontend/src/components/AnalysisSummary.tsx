import type { SEOAnalysis } from '../types/analysis'
import { getAuditGroups } from '../lib/analysisPresentation'
import { AnalysisOverview } from './seo/AnalysisOverview'
import { CategoryScores } from './seo/CategoryScores'

interface AnalysisSummaryProps {
  analysis: SEOAnalysis
}

export function AnalysisSummary({ analysis }: AnalysisSummaryProps) {
  const groups = getAuditGroups(analysis.results)

  return (
    <div className="mt-12">
      <AnalysisOverview analysis={analysis} />
      <CategoryScores groups={groups} />
    </div>
  )
}
