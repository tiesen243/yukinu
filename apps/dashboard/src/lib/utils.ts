import { env } from '@yukinu/validators/env.vite'

export function getDashboardUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin
  else if (env.VITE_DASHBOARD_URL) return `https://${env.VITE_DASHBOARD_URL}`
  return `http://localhost:5173`
}

export function getWebUrl(): string {
  if (env.VITE_WEB_URL) return `https://${env.VITE_WEB_URL}`
  return `http://localhost:3000`
}
