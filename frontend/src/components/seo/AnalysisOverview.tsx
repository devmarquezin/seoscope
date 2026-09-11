import { AlertTriangle, CheckCircle2, CircleX, FileCode2, Globe2, HardDrive, Info } from 'lucide-react'
import { formatBytes, getHostname } from '../../lib/analysisPresentation'
import type { SEOAnalysis } from '../../types/analysis'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import { Separator } from '../ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { ScoreCircle } from './ScoreCircle'

const statusLabels: Record<SEOAnalysis['status'], string> = {
  excellent: 'Excelente',
  good: 'Bom',
  'needs-improvement': 'Precisa melhorar',
  critical: 'Crítico',
}

const summaryItems = [
  { key: 'passed', label: 'Aprovadas', icon: CheckCircle2, color: 'text-success', border: 'border-success/20' },
  { key: 'warnings', label: 'Avisos', icon: AlertTriangle, color: 'text-warning', border: 'border-warning/20' },
  { key: 'errors', label: 'Problemas', icon: CircleX, color: 'text-danger', border: 'border-danger/20' },
] as const

interface AnalysisOverviewProps {
  analysis: SEOAnalysis
}

export function AnalysisOverview({ analysis }: AnalysisOverviewProps) {
  return (
    <section id="visao-geral" className="scroll-mt-36" aria-labelledby="analysis-summary-title" aria-live="polite">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium text-success"><CheckCircle2 className="size-4" />Análise concluída</p>
          <h2 id="analysis-summary-title" className="mt-2 break-words text-2xl font-semibold tracking-tight sm:text-3xl">{getHostname(analysis.finalUrl)}</h2>
          <p className="mt-1 truncate text-sm text-muted-foreground" title={analysis.finalUrl}>{analysis.finalUrl}</p>
        </div>
        <Badge className="w-fit" variant="secondary">{statusLabels[analysis.status]}</Badge>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-[18rem_1fr]">
            <div className="flex items-center justify-center border-b border-border p-7 lg:border-r lg:border-b-0">
              <ScoreCircle score={analysis.score} status={analysis.status} />
            </div>
            <div className="p-5 sm:p-7">
              <div className="grid gap-3 sm:grid-cols-3">
                {summaryItems.map(({ key, label, icon: Icon, color, border }) => (
                  <div key={key} className={`rounded-xl border ${border} bg-background/45 p-4`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <Icon className={`size-4 ${color}`} aria-hidden="true" />
                    </div>
                    <p className={`mt-3 text-2xl font-semibold ${color}`}>{analysis.summary[key]}</p>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <dl className="grid gap-5 sm:grid-cols-3">
                <div>
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-muted-foreground"><Globe2 className="size-3.5" />Status HTTP</dt>
                  <dd className="mt-2 text-sm font-medium">{analysis.statusCode}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-muted-foreground"><FileCode2 className="size-3.5" />Tipo de conteúdo</dt>
                  <dd className="mt-2 truncate text-sm font-medium" title={analysis.contentType}>{analysis.contentType}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-muted-foreground">
                    <HardDrive className="size-3.5" />Tamanho
                    <Tooltip><TooltipTrigger aria-label="Sobre o tamanho da página"><Info className="size-3.5" /></TooltipTrigger><TooltipContent>Tamanho do HTML recebido na análise.</TooltipContent></Tooltip>
                  </dt>
                  <dd className="mt-2 text-sm font-medium">{formatBytes(analysis.sizeInBytes)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
