import { Lightbulb } from 'lucide-react'
import type { SEOCheckResult } from '../../types/analysis'
import { AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Alert } from '../ui/alert'
import { AuditDetails } from './AuditDetails'
import { StatusBadge, StatusIcon } from './StatusBadge'

export function AuditItem({ result }: { result: SEOCheckResult }) {
  return (
    <AccordionItem value={result.id} id={`audit-${result.id}`} className="scroll-mt-36 px-4 sm:px-5">
      <AccordionTrigger>
        <div className="flex min-w-0 flex-1 items-start gap-3 pr-2">
          <StatusIcon status={result.status} className="mt-0.5" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <h3 className="font-semibold text-foreground">{result.name}</h3>
              <StatusBadge status={result.status} showIcon={false} />
            </div>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{result.message}</p>
          </div>
          <p className="hidden shrink-0 text-sm text-muted-foreground sm:block"><strong className="text-foreground">{result.score}</strong>/{result.maxScore}</p>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-0 sm:pl-8">
        <div className="grid gap-4">
          <AuditDetails result={result} />
          {result.recommendation && (
            <Alert className="flex items-start gap-3">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <div><p className="font-medium text-foreground">Como melhorar</p><p className="mt-1 leading-6 text-muted-foreground">{result.recommendation}</p></div>
            </Alert>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
