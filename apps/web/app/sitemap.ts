import type { MetadataRoute } from 'next'

import { getBaseUrl } from '@/lib/utils'

export const revalidate = false

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string): string => new URL(path, getBaseUrl()).toString()

  const statics: string[] = [
    '/',
    '/home',
    '/about',
    '/contact',
    '/product',
    '/careers',
  ]

  return Promise.resolve([
    {
      url: url('/'),
      changeFrequency: 'yearly',
      priority: 1,
    },
    ...statics.map((path) => ({
      url: url(path),
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ])
}
