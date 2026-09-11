import { Skeleton } from './ui/skeleton'

export function LoadingAnalysis() {
  return (
    <section
      className="mt-8"
      role="status"
      aria-live="polite"
    >
      <div className="mb-5"><p className="font-medium text-foreground">Executando auditoria SEO...</p><p className="mt-1 text-sm text-muted-foreground">Analisando a página e organizando os resultados.</p></div>
      <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
        <Skeleton className="h-56" />
        <Skeleton className="h-56" />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3"><Skeleton className="h-44" /><Skeleton className="h-44" /><Skeleton className="h-44" /></div>
      <span className="sr-only">Analisando página...</span>
    </section>
  )
}
