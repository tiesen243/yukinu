import { env } from '@yukinu/validators/env'

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin
  else if (env.VERCEL_ENV === 'preview') return `https://${env.VERCEL_URL}`

  const protocol = env.NODE_ENV === 'production' ? 'https' : 'http'
  return `${protocol}://${env.NEXT_PUBLIC_WEB_URL}`
}
