import type { MetaDescriptor } from 'react-router'

import { env } from '@/lib/env'

export interface Metadata {
  title?: string
  description?: string
  keywords?: string[]
  openGraph?: {
    url?: string
    images?: { url: string; alt?: string }[]
  }
}

export function createMetadata(override: Metadata = {}): MetaDescriptor[] {
  const siteName = env.VITE_APP_NAME
  const baseUrl = env.VITE_DASHBOARD_URL

  const title = override.title ? `${override.title} | ${siteName}` : siteName
  const description =
    override.description ??
    'Experience the next generation of online retail with Yukinu. A robust Multi-tenant E-commerce solution designed for scalability and speed. Empowers diverse vendors with powerful management tools, seamless integrations, and a custom-tailored shopping journey.'
  const url = override.openGraph?.url
    ? `${baseUrl}${override.openGraph.url}`
    : baseUrl

  return [
    { title },
    { name: 'description', content: description },
    {
      name: 'keywords',
      content: [
        'multi-vendor e-commerce',
        'multi-tenant platform',
        'Yukinu',
        'online marketplace software',
        'scalable retail solution',
        'cloud e-commerce',
        ...(override.keywords ?? []),
      ].join(', '),
    },

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
    { name: 'twitter:site', content: '@tiesen243' },
    { name: 'twitter:creator', content: '@tiesen243' },

    // Others
    { rel: 'canonical', href: url },
    {
      name: 'google-site-verification',
      content: 'IxxbL_t4Uj36PsfajteCHNpV6Ln9fr7WCkxmzFjW_ms',
    },
  ]
}
