import type { MetaDescriptor } from 'react-router'

import { env } from '@yukinu/validators/env.vite'

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
  const siteName = env.VITE_APP_NAME
  const baseUrl = getBaseUrl()

  const title = override.title ? `${override.title} | ${siteName}` : siteName
  const description =
    override.description ??
    'An e-commerce platform that enables customers to discover, compare, and purchase products from multiple sellers in one place, with fast browsing, secure checkout, and a smooth user experience.'
  const url = override.openGraph?.url
    ? `${baseUrl}${override.openGraph.url}`
    : baseUrl

  return [
    { charSet: 'utf-8' },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, color-scheme=light dark',
    },
    { title },
    { name: 'description', content: description },
    { name: 'application-name', content: siteName },
    { name: 'referrer', content: 'origin-when-cross-origin' },
    { name: 'robots', content: 'index, follow' },
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
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:type', content: 'website' },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@tiesen243' },
    { name: 'twitter:creator', content: '@tiesen243' },

    // Canonical Link
    { rel: 'canonical', href: url },

    // Keywords
    {
      name: 'keywords',
      content: [
        'multi-vendor e-commerce platform',
        'e-commerce marketplace',
        'online shopping marketplace',
        'multi-seller marketplace',
        'discover products from multiple sellers',
        'secure online shopping',
      ].join(', '),
    },

    // Generator
    { name: 'generator', content: 'Create Yuki Stack' },

    // Webmaster verifications
    {
      name: 'google-site-verification',
      content: 'IxxbL_t4Uj36PsfajteCHNpV6Ln9fr7WCkxmzFjW_ms',
    },
    { property: 'fb:app_id', content: '523462826928110' },
  ]
}
