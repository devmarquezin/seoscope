import { Github, Linkedin } from 'lucide-react'
import { SOCIAL_LINKS, isConfiguredSocialLink } from '../../config/social-links'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

const links = [
  { label: 'GitHub', href: SOCIAL_LINKS.github, icon: Github },
  { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin, icon: Linkedin },
]

interface SocialLinksProps {
  showLabels?: boolean
}

export function SocialLinks({ showLabels = false }: SocialLinksProps) {
  return (
    <div className="flex items-center gap-1.5">
      {links.map(({ label, href, icon: Icon }) => {
        const isConfigured = isConfiguredSocialLink(href)
        const control = isConfigured ? (
          <Button asChild variant="ghost" size={showLabels ? 'sm' : 'icon'} className="hover:-translate-y-px">
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <Icon aria-hidden="true" />
              {showLabels && <span>{label}</span>}
            </a>
          </Button>
        ) : (
          <span className="inline-flex cursor-not-allowed" aria-label={`${label} ainda não configurado`}>
            <Button variant="ghost" size={showLabels ? 'sm' : 'icon'} disabled>
              <Icon aria-hidden="true" />
              {showLabels && <span>{label}</span>}
            </Button>
          </span>
        )

        return (
          <Tooltip key={label}>
            <TooltipTrigger asChild>{control}</TooltipTrigger>
            <TooltipContent>{isConfigured ? label : `${label} — configure a URL`}</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
