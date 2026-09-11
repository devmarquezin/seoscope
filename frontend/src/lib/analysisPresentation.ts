import type { SEOCheckResult } from '../types/analysis'

export interface AuditGroup {
  id: string
  name: string
  description: string
  results: SEOCheckResult[]
  score: number
  maxScore: number
  percentage: number
  issues: number
}

const GROUP_DEFINITIONS = [
  {
    id: 'conteudo',
    name: 'Conteúdo e estrutura',
    description: 'Títulos, descrição, headings e acessibilidade das imagens.',
    checkIds: ['title', 'meta-description', 'h1', 'heading-hierarchy', 'image-alt'],
  },
  {
    id: 'tecnico',
    name: 'SEO técnico',
    description: 'Segurança e sinais técnicos de indexação da página.',
    checkIds: ['canonical', 'https'],
  },
  {
    id: 'social',
    name: 'Compartilhamento',
    description: 'Metadados usados ao compartilhar a página em outras plataformas.',
    checkIds: ['open-graph'],
  },
] as const

function createGroup(
  definition: { id: string; name: string; description: string },
  results: SEOCheckResult[],
): AuditGroup {
  const score = results.reduce((total, result) => total + result.score, 0)
  const maxScore = results.reduce((total, result) => total + result.maxScore, 0)

  return {
    ...definition,
    results,
    score,
    maxScore,
    percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
    issues: results.filter((result) => result.status !== 'success').length,
  }
}

export function getAuditGroups(results: SEOCheckResult[]): AuditGroup[] {
  const knownIds = new Set<string>(GROUP_DEFINITIONS.flatMap((group) => [...group.checkIds]))
  const groups = GROUP_DEFINITIONS.map((definition) =>
    createGroup(
      definition,
      results.filter((result) => definition.checkIds.some((checkId) => checkId === result.id)),
    ),
  ).filter((group) => group.results.length > 0)
  const remaining = results.filter((result) => !knownIds.has(result.id))

  if (remaining.length > 0) {
    groups.push(createGroup({ id: 'outras', name: 'Outras verificações', description: 'Demais sinais retornados pela auditoria.' }, remaining))
  }

  return groups
}

export function getImprovements(results: SEOCheckResult[]): SEOCheckResult[] {
  return [...results]
    .filter((result) => result.status !== 'success')
    .sort((a, b) => {
      const order = { error: 0, warning: 1, success: 2 }
      return order[a.status] - order[b.status]
    })
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getHostname(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}
