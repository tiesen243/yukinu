import { env } from '@yukinu/validators/env.vite'

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin
  if (env.VITE_APP_URL) return `https://${env.VITE_APP_URL}`
  // eslint-disable-next-line no-restricted-properties
  return `http://localhost:${process.env.PORT ?? 3024}`
}
