import type { MetaDescriptor } from 'react-router'

import { env } from '@yuki/validators/env'

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
    'Your complete e-commerce destination for shopping online with a wide selection of products, easy checkout, and secure payments.'
  const url = override.openGraph?.url
    ? `${baseUrl}${override.openGraph.url}`
    : baseUrl

  return [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'color-scheme', content: 'light dark' },

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
          content: image.url.startsWith('/api/og')
            ? `${env.NEXT_PUBLIC_APP_URL}${image.url}`
            : image.url,
          alt: image.alt,
        }))
      : []),
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
  ]
}
