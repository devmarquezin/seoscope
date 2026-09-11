import logoUrl from '../assets/seoscope-logo.webp'

export function Logo() {
  return (
    <a
      href="#inicio"
      className="inline-flex rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      aria-label="SeoScope — início"
    >
      <span className="relative block h-12 w-44 overflow-hidden">
        <img
          src={logoUrl}
          alt="SeoScope"
          className="absolute left-1/2 top-1/2 h-20 w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      </span>
    </a>
  )
}
