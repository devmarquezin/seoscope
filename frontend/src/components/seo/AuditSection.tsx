import type { AuditGroup } from '../../lib/analysisPresentation'
import { Accordion } from '../ui/accordion'
import { AuditItem } from './AuditItem'

export function AuditSection({ group }: { group: AuditGroup }) {
  return (
    <section id={`categoria-${group.id}`} className="scroll-mt-36" aria-labelledby={`categoria-${group.id}-title`}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id={`categoria-${group.id}-title`} className="text-xl font-semibold sm:text-2xl">{group.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
        </div>
        <p className="shrink-0 text-sm text-muted-foreground">{group.results.length} {group.results.length === 1 ? 'verificação' : 'verificações'}</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <Accordion type="multiple">{group.results.map((result) => <AuditItem key={result.id} result={result} />)}</Accordion>
      </div>
    </section>
  )
}
