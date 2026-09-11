import { Logo } from '../Logo'
import { Separator } from '../ui/separator'
import { SocialLinks } from './SocialLinks'

export function Footer() {
  return (
    <footer id="sobre" className="mt-20 scroll-mt-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Separator />
        <div className="flex flex-col items-center gap-7 py-10 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              Uma ferramenta para análise e auditoria SEO.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:items-end">
            <SocialLinks showLabels />
            <p className="text-sm text-muted-foreground">
              Desenvolvido por <span className="font-medium text-primary">Gustavo Marquezin</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
