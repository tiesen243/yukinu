import type { Metadata as NextMetadata } from 'next'

import { getBaseUrl } from '@/lib/utils'

export interface Metadata extends NextMetadata {
  title?: string
  keywords?: string[]
}

export function createMetadata(override: Metadata = {}): Metadata {
  const siteName = 'Yukinu'
  const baseUrl = getBaseUrl()

  const title = override.title ? `${override.title} | ${siteName}` : siteName
  const description =
    override.description ??
    'Your complete e-commerce destination for shopping online with a wide selection of products, easy checkout, and secure payments.'
  const url = override.openGraph?.url
    ? `${baseUrl}${override.openGraph.url}`
    : baseUrl

  const images = [
    ...(override.openGraph?.images
      ? Array.isArray(override.openGraph.images)
        ? override.openGraph.images
        : [override.openGraph.images]
      : []),
    { url: '/api/og', alt: 'Open Graph Image' },
  ]

  return {
    ...override,
    metadataBase: new URL(baseUrl),
    applicationName: siteName,
    title,
    description,
    keywords: [
      ...(override.keywords ?? []),
      'e-commerce',
      'shopping',
      'online store',
      'yukinu',
    ],
    authors: [{ name: 'Tiesen', url: 'https://tiesen.id.vn' }],
    openGraph: {
      ...override.openGraph,
      title,
      description,
      siteName,
      url,
      images,
    },
    twitter: { card: 'summary_large_image' },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-32x32.png',
      apple: '/apple-touch-icon.png',
    },
    verification: { google: 'IxxbL_t4Uj36PsfajteCHNpV6Ln9fr7WCkxmzFjW_ms' },
    facebook: { appId: '523462826928110' },
    manifest: '/manifest.webmanifest',
    alternates: { canonical: url },
  }
}
