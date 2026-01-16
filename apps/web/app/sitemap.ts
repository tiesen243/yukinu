import type { MetadataRoute } from 'next'

import { db } from '@yukinu/db'
import { products, users, vendors } from '@yukinu/db/schema'
import { slugify } from '@yukinu/lib/slugify'

import { getWebUrl } from '@/lib/utils'

export const revalidate = 86400 // 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string): string => new URL(path, getWebUrl()).toString()

  const statics: string[] = ['/home', '/about', '/contact', '/search']

  const [productsList, usersList, vendorsList] = await Promise.all([
    db
      .select({ id: products.id, name: products.name })
      .from(products)
      .limit(1000),
    db.select({ id: users.id }).from(users).limit(1000),
    db.select({ id: vendors.id }).from(vendors).limit(1000),
  ])

  return [
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
    ...usersList.map((user) => ({
      url: url(`/u/${user.id}`),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...vendorsList.map((vendor) => ({
      url: url(`/v/${vendor.id}`),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
