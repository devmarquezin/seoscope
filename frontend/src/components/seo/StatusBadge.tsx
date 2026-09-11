import { AlertTriangle, CheckCircle2, CircleX } from 'lucide-react'
import type { SEOCheckStatus } from '../../types/analysis'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'

const statusConfig = {
  success: { label: 'Aprovado', icon: CheckCircle2, variant: 'success', className: 'text-success' },
  warning: { label: 'Atenção', icon: AlertTriangle, variant: 'warning', className: 'text-warning' },
  error: { label: 'Problema', icon: CircleX, variant: 'danger', className: 'text-danger' },
} as const

interface StatusBadgeProps {
  status: SEOCheckStatus
  showIcon?: boolean
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant}>
      {showIcon && <Icon className="size-3.5" aria-hidden="true" />}
      {config.label}
    </Badge>
  )
}

export function StatusIcon({ status, className }: { status: SEOCheckStatus; className?: string }) {
  const config = statusConfig[status]
  const Icon = config.icon
  return <Icon className={cn('size-5 shrink-0', config.className, className)} aria-hidden="true" />
}
