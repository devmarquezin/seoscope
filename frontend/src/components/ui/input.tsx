import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-xl border border-border bg-background/75 px-4 text-base text-foreground shadow-inner shadow-black/10 outline-none transition-colors duration-200 placeholder:text-muted-foreground/70 focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
