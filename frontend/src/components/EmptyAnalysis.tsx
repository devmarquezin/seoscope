import { ScanSearch } from 'lucide-react'

export function EmptyAnalysis() {
  return (
    <section className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface/35 px-6 py-12 text-center" aria-label="Nenhuma análise realizada">
      <span className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/8 text-primary">
        <ScanSearch className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-lg font-semibold text-foreground">Seu relatório aparecerá aqui</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Informe uma página acima para visualizar o score, os testes aprovados e os pontos que precisam de atenção.
      </p>
    </section>
  )
}
