import type { SEOCheckResult } from '../types/analysis'
import { getAuditGroups, getImprovements } from '../lib/analysisPresentation'
import { AuditSection } from './seo/AuditSection'
import { ImprovementList } from './seo/ImprovementList'
import { ReportNavigation } from './seo/ReportNavigation'

interface AnalysisResultsProps {
  results: SEOCheckResult[]
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const groups = getAuditGroups(results)
  const improvements = getImprovements(results)

  return (
    <div className="mt-8">
      <ReportNavigation groups={groups} hasImprovements={improvements.length > 0} />
      <div className="mt-10 grid gap-12">
        <div className="flex items-end justify-between gap-4"><div><h2 className="text-2xl font-semibold">Relatório da auditoria</h2><p className="mt-1 text-sm text-muted-foreground">Explore cada verificação e abra os detalhes técnicos quando precisar.</p></div><p className="shrink-0 text-sm text-muted-foreground">{results.length} resultados</p></div>
        <ImprovementList improvements={improvements} />
        {groups.map((group) => <AuditSection key={group.id} group={group} />)}
      </div>
    </div>
  )
}
