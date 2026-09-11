import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const alertVariants = cva('relative w-full rounded-xl border px-4 py-3 text-sm', {
  variants: {
    variant: {
      default: 'border-border bg-secondary/70 text-foreground',
      destructive: 'border-danger/30 bg-danger/8 text-danger',
      success: 'border-success/25 bg-success/8 text-success',
    },
  },
  defaultVariants: { variant: 'default' },
})

interface AlertProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

function Alert({ className, variant, ...props }: AlertProps) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
}

export { Alert }
