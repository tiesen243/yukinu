import { env } from '@yukinu/validators/env.vite'

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin
  else if (env.VITE_APP_URL) return `https://${env.VITE_APP_URL}`
  return `http://localhost:5173`
}
