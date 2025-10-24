import type { MetaDescriptor } from 'react-router'

import { getBaseUrl } from '@/lib/utils'

export interface Metadata {
  title?: string
  description?: string
  openGraph?: {
    url?: string
    images?: { url: string; alt?: string }[]
  }
}

export function createMetadata(override: Metadata = {}): MetaDescriptor[] {
  const siteName = 'Yukinu'
  const baseUrl = getBaseUrl()

  const title = override.title ? `${override.title} | ${siteName}` : siteName
  const description =
    override.description ??
    'Yukinu is an e-commerce platform built as a monorepo with Turborepo. It includes both a customer-facing storefront and an admin dashboard, sharing code for UI, API, and database.'
  const url = override.openGraph?.url
    ? `${baseUrl}${override.openGraph.url}`
    : baseUrl

  return [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { title },
    { name: 'description', content: description },
    { name: 'application-name', content: siteName },
    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:site_name', content: siteName },
    { property: 'og:url', content: url },
    ...(override.openGraph?.images
      ? override.openGraph.images.map((image) => ({
          property: 'og:image',
          content: image.url,
          alt: image.alt,
        }))
      : []),
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
  ]
}
