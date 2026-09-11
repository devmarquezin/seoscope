export const SOCIAL_LINKS = {
  github: 'https://github.com/devmarquezin',
  linkedin: 'https://www.linkedin.com/in/marquezindev/',
} as const

export function isConfiguredSocialLink(url: string): boolean {
  return url.startsWith('https://') || url.startsWith('http://')
}
