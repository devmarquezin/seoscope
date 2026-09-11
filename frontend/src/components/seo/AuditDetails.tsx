import type { SEOCheckResult } from '../../types/analysis'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function ValueBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-background/45 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
      <p className="mt-2 break-words text-sm leading-6 text-foreground/85">{value}</p>
    </div>
  )
}

function TextDetails({ details, field, label }: { details: UnknownRecord; field: string; label: string }) {
  const text = asString(details[field])
  const length = asNumber(details.length) ?? 0
  return <div className="grid gap-3 sm:grid-cols-[1fr_9rem]"><ValueBlock label={label} value={text || 'Não encontrado'} /><ValueBlock label="Caracteres" value={length} /></div>
}

function H1Details({ details }: { details: UnknownRecord }) {
  const count = asNumber(details.count) ?? 0
  const headings = Array.isArray(details.headings) ? details.headings.filter((item): item is string => typeof item === 'string') : []
  return (
    <div className="grid gap-3">
      <ValueBlock label="Quantidade de H1" value={count} />
      {headings.length > 0 && <div className="rounded-xl border border-border bg-background/45 p-4"><p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">Conteúdo encontrado</p><ul className="mt-3 grid gap-2">{headings.map((heading, index) => <li key={`${heading}-${index}`} className="break-words text-sm text-foreground/85">{heading || 'H1 vazio'}</li>)}</ul></div>}
    </div>
  )
}

function HeadingDetails({ details }: { details: UnknownRecord }) {
  const counts = isRecord(details.counts) ? details.counts : {}
  const outline = Array.isArray(details.outline) ? details.outline.filter(isRecord) : []
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => <ValueBlock key={tag} label={tag.toUpperCase()} value={asNumber(counts[tag]) ?? 0} />)}
      </div>
      {outline.length > 0 && (
        <div className="max-h-72 overflow-y-auto rounded-xl border border-border bg-background/45 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">Estrutura encontrada</p>
          <ol className="mt-3 grid gap-2">
            {outline.map((item, index) => {
              const level = asNumber(item.level) ?? 1
              return <li key={index} className="flex gap-3 text-sm"><span className="w-7 shrink-0 font-medium uppercase text-primary">H{level}</span><span className="break-words text-foreground/80">{asString(item.text) || 'Heading vazio'}</span></li>
            })}
          </ol>
        </div>
      )}
    </div>
  )
}

function ImageDetails({ details }: { details: UnknownRecord }) {
  const rows = [
    ['Total', asNumber(details.total) ?? 0],
    ['Com alt', asNumber(details.withAlt) ?? 0],
    ['Alt vazio', asNumber(details.emptyAlt) ?? 0],
    ['Sem alt', asNumber(details.withoutAlt) ?? 0],
  ] as const
  const missing = Array.isArray(details.missingAltImages) ? details.missingAltImages.filter(isRecord) : []
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{rows.map(([label, value]) => <ValueBlock key={label} label={label} value={value} />)}</div>
      {missing.length > 0 && <div className="max-h-72 overflow-y-auto rounded-xl border border-border"><Table><TableHeader><TableRow><TableHead>Imagem</TableHead><TableHead>Origem</TableHead></TableRow></TableHeader><TableBody>{missing.map((item, index) => <TableRow key={index}><TableCell>#{asNumber(item.index) ?? index + 1}</TableCell><TableCell className="break-all">{asString(item.src) || 'Sem src informado'}</TableCell></TableRow>)}</TableBody></Table></div>}
    </div>
  )
}

function CanonicalDetails({ details }: { details: UnknownRecord }) {
  const urls = Array.isArray(details.urls) ? details.urls : []
  return (
    <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
      <ValueBlock label="Tags encontradas" value={asNumber(details.count) ?? 0} />
      <ValueBlock label="URL canonical" value={urls.map((url) => asString(url)).filter(Boolean).join(', ') || 'Não encontrada'} />
    </div>
  )
}

function OpenGraphDetails({ details }: { details: UnknownRecord }) {
  const required = Array.isArray(details.required) ? details.required.filter((item): item is string => typeof item === 'string') : []
  const values = isRecord(details.values) ? details.values : {}
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader><TableRow><TableHead>Propriedade</TableHead><TableHead>Valor encontrado</TableHead></TableRow></TableHeader>
        <TableBody>{required.map((property) => <TableRow key={property}><TableCell className="font-medium text-primary">{property}</TableCell><TableCell className="break-all">{asString(values[property]) || 'Não preenchida'}</TableCell></TableRow>)}</TableBody>
      </Table>
    </div>
  )
}

export function AuditDetails({ result }: { result: SEOCheckResult }) {
  if (!isRecord(result.details)) return null

  switch (result.id) {
    case 'title': return <TextDetails details={result.details} field="title" label="Title encontrado" />
    case 'meta-description': return <TextDetails details={result.details} field="description" label="Description encontrada" />
    case 'h1': return <H1Details details={result.details} />
    case 'heading-hierarchy': return <HeadingDetails details={result.details} />
    case 'image-alt': return <ImageDetails details={result.details} />
    case 'canonical': return <CanonicalDetails details={result.details} />
    case 'open-graph': return <OpenGraphDetails details={result.details} />
    case 'https': return <div className="grid gap-3 sm:grid-cols-[1fr_10rem]"><ValueBlock label="URL verificada" value={asString(result.details.url) || 'Não identificada'} /><ValueBlock label="Protocolo" value={asString(result.details.protocol) || 'Não identificado'} /></div>
    default: return null
  }
}
