import { env } from '@yukinu/validators/env.next'

export function getWebUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin
  else if (env.NEXT_PUBLIC_WEB_URL) return `https://${env.NEXT_PUBLIC_WEB_URL}`
  return `http://localhost:3000`
}

export function getDashboardUrl(): string {
  if (env.NEXT_PUBLIC_DASHBOARD_URL)
    return `https://${env.NEXT_PUBLIC_DASHBOARD_URL}`
  return `http://localhost:5173`
}
