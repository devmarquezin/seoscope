import type { AuditGroup } from '../../lib/analysisPresentation'
import { Button } from '../ui/button'

export function ReportNavigation({ groups, hasImprovements }: { groups: AuditGroup[]; hasImprovements: boolean }) {
  const items = [
    { href: '#visao-geral', label: 'Visão geral' },
    ...(hasImprovements ? [{ href: '#melhorias', label: 'Melhorias' }] : []),
    ...groups.map((group) => ({ href: `#categoria-${group.id}`, label: group.name })),
  ]

  return (
    <nav className="sticky top-18 z-30 -mx-5 overflow-x-auto border-y border-border/70 bg-background/92 px-5 py-2 backdrop-blur-xl sm:-mx-8 sm:px-8" aria-label="Navegação do relatório">
      <div className="mx-auto flex min-w-max max-w-7xl gap-1">
        {items.map((item) => <Button key={item.href} asChild variant="ghost" size="sm"><a href={item.href}>{item.label}</a></Button>)}
      </div>
    </nav>
  )
}
