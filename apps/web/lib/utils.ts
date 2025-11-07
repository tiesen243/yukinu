import { env } from '@yukinu/validators/env.next'

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin
  else if (env.NEXT_PUBLIC_VERCEL_ENV === 'preview')
    return `https://${env.NEXT_PUBLIC_VERCEL_URL}`

  const protocol = env.NODE_ENV === 'production' ? 'https' : 'http'
  return `${protocol}://${env.NEXT_PUBLIC_WEB_URL}`
}
