import type { MetadataRoute } from 'next'

import { db } from '@yukinu/db'
import { and, eq, isNull } from '@yukinu/db/drizzle'
import { products, users, vendors } from '@yukinu/db/schema'
import { slugify } from '@yukinu/lib/utils'

import { env } from '@/lib/env'

export const revalidate = 86_400 // 24 hours

const url = (path: string): string =>
  new URL(path, env.NEXT_PUBLIC_WEB_URL).toString()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statics: string[] = ['/home', '/about', '/contact', '/search']

  const [productsList, usersList, vendorsList] = await Promise.all([
    db
      .select({ id: products.id, name: products.name })
      .from(products)
      .limit(1000),
    db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.status, 'active'), isNull(users.deletedAt)))
      .limit(1000),
    db
      .select({ id: vendors.id })
      .from(vendors)
      .where(eq(vendors.status, 'approved'))
      .limit(1000),
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
