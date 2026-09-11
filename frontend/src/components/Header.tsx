import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Logo } from './Logo'
import { SocialLinks } from './layout/SocialLinks'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from './ui/sheet'

const navigation = [
  { label: 'Início', href: '#inicio' },
  { label: 'Analisar', href: '#analisar' },
  { label: 'Recursos', href: '#recursos' },
  { label: 'Sobre', href: '#sobre' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
          {navigation.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm" className="hover:bg-transparent hover:text-primary">
              <a href={item.href}>{item.label}</a>
            </Button>
          ))}
        </nav>

        <div className="hidden md:block">
          <SocialLinks />
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <SheetDescription className="sr-only">Links principais e redes sociais do SeoScope</SheetDescription>
            <div className="mt-12 flex flex-col">
              <nav className="flex flex-col gap-1" aria-label="Navegação mobile">
                {navigation.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="rounded-xl px-4 py-3 text-base font-medium text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <Separator className="my-5" />
              <SocialLinks showLabels />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
