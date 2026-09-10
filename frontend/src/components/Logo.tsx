import logoUrl from '../assets/seoscope-logo.webp'

export function Logo() {
  return (
    <a
      href="/"
      className="inline-flex rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-seo-text focus-visible:ring-offset-4 focus-visible:ring-offset-seo-bg"
      aria-label="SeoScope — início"
    >
      <span className="relative block h-10 w-40 overflow-hidden sm:w-44">
        <img
          src={logoUrl}
          alt="SeoScope"
          className="absolute left-1/2 top-1/2 h-20 w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      </span>
    </a>
  )
}
