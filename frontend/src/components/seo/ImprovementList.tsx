import { ArrowRight, CheckCircle2 } from 'lucide-react'
import type { SEOCheckResult } from '../../types/analysis'
import { Alert } from '../ui/alert'
import { Card, CardContent } from '../ui/card'
import { Separator } from '../ui/separator'
import { StatusBadge } from './StatusBadge'

export function ImprovementList({ improvements }: { improvements: SEOCheckResult[] }) {
  return (
    <section id="melhorias" className="scroll-mt-36" aria-labelledby="improvements-title">
      <div className="mb-4">
        <h2 id="improvements-title" className="text-xl font-semibold sm:text-2xl">Principais melhorias</h2>
        <p className="mt-1 text-sm text-muted-foreground">Avisos e problemas identificados pela análise, sem classificação adicional de prioridade.</p>
      </div>
      {improvements.length === 0 ? (
        <Alert variant="success" className="flex items-center gap-3"><CheckCircle2 className="size-5" /><span>Nenhum aviso ou problema foi encontrado nesta análise.</span></Alert>
      ) : (
        <Card>
          <CardContent className="p-0">
            {improvements.map((result, index) => (
              <div key={result.id}>
                <a href={`#audit-${result.id}`} className="group flex items-center gap-4 px-5 py-4 outline-none transition-colors hover:bg-secondary/45 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40 sm:px-6">
                  <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-medium">{result.name}</h3><StatusBadge status={result.status} /></div><p className="mt-1.5 line-clamp-2 text-sm leading-6 text-muted-foreground">{result.message}</p></div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
                </a>
                {index < improvements.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </section>
  )
}
