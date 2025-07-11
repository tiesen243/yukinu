import type { MetadataRoute } from 'next'

import { db } from '@yuki/db'

import { getBaseUrl, slugify } from '@/lib/utils'

export const revalidate = false

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string): string => new URL(path, getBaseUrl()).toString()
  const seoPages = [
    'home',
    'about',
    'faq',
    'contact',
    'policy',
    'terms',
    'cookie',
    'shipping',
    'returns',
  ]
  const products = await db.query.products.findMany({
    columns: { id: true, name: true, updatedAt: true },
  })

  return [
    {
      url: url('/'),
      changeFrequency: 'yearly',
      priority: 1,
    },
    ...seoPages.map((page) => ({
      url: url(`/${page}`),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: url(`/${slugify(product.name)}-${product.id}`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      lastModified: product.updatedAt.toISOString(),
    })),
  ]
}
