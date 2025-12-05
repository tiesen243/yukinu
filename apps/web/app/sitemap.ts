import type { MetadataRoute } from 'next'

import { db } from '@yukinu/db'
import { products } from '@yukinu/db/schema'
import { slugify } from '@yukinu/lib/slugify'

import { getWebUrl } from '@/lib/utils'

export const revalidate = false

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string): string => new URL(path, getWebUrl()).toString()

  const statics: string[] = ['/', '/home', '/about', '/contact', '/search']
  const productsList = await db
    .select({ id: products.id, name: products.name })
    .from(products)
    .limit(1000)

  return Promise.resolve([
    {
      url: url('/'),
      changeFrequency: 'yearly',
      priority: 1,
    },
    ...statics.map((path) => ({
      url: url(path),
      changeFrequency: 'yearly' as const,
      priority: 0.9,
    })),
    ...productsList.map((product) => ({
      url: url(`/${slugify(product.name)}-${product.id}`),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ])
}
