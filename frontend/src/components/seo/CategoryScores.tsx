import { FileText, Share2, Wrench } from 'lucide-react'
import type { AuditGroup } from '../../lib/analysisPresentation'
import { Card, CardContent } from '../ui/card'
import { Progress } from '../ui/progress'

const icons = { conteudo: FileText, tecnico: Wrench, social: Share2 }

export function CategoryScores({ groups }: { groups: AuditGroup[] }) {
  return (
    <section className="mt-8" aria-labelledby="category-scores-title">
      <div className="mb-4">
        <h2 id="category-scores-title" className="text-xl font-semibold">Scores por categoria</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pontuações calculadas a partir dos testes retornados pela auditoria.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {groups.map((group) => {
          const Icon = icons[group.id as keyof typeof icons] ?? Wrench
          return (
            <Card key={group.id} className="transition-all duration-200 hover:-translate-y-px hover:border-primary/25 hover:shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-primary/8 text-primary"><Icon className="size-4" /></span>
                  <span className="text-sm text-muted-foreground"><strong className="text-lg text-foreground">{group.score}</strong>/{group.maxScore}</span>
                </div>
                <h3 className="mt-4 font-semibold">{group.name}</h3>
                <p className="mt-1 min-h-10 text-sm leading-5 text-muted-foreground">{group.description}</p>
                <Progress value={group.percentage} className="mt-4" aria-label={`Score de ${group.name}`} />
                <p className="mt-2 text-xs text-muted-foreground">{group.issues === 0 ? 'Nenhum ponto de atenção' : `${group.issues} ${group.issues === 1 ? 'ponto de atenção' : 'pontos de atenção'}`}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
