export const SOCIAL_LINKS = {
  github: 'https://github.com/devmarquezin',
  linkedin: 'COLOCAR_URL_LINKEDIN_AQUI',
} as const

export function isConfiguredSocialLink(url: string): boolean {
  return url.startsWith('https://') || url.startsWith('http://')
}
