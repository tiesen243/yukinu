import { env } from '@yukinu/validators/env.vite'

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin
  else if (env.VITE_VERCEL_ENV === 'preview')
    return `https://${env.VITE_VERCEL_URL}`

  const protocol = import.meta.env.MODE === 'production' ? 'https' : 'http'
  return `${protocol}://${env.VITE_DASHBOARD_URL}`
}
