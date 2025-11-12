import { env } from '@yukinu/validators/env.next'

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin
  else if (env.NEXT_PUBLIC_VERCEL_ENV === 'preview')
    return `https://${env.NEXT_PUBLIC_VERCEL_URL}`
  else if (env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
  // eslint-disable-next-line no-restricted-properties
  return `http://localhost:${process.env.TURBO_MFE_PORT ?? 3024}`
}
