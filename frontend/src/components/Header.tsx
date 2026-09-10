import { Logo } from './Logo'

export function Header() {
  return (
    <header className="border-b border-seo-border/80">
      <div className="mx-auto flex h-20 max-w-6xl items-center px-5 sm:px-8">
        <Logo />
      </div>
    </header>
  )
}
