import type { Metadata as NextMetadata } from 'next'

import { env } from '@yukinu/validators/env.next'

import { getBaseUrl } from '@/lib/utils'

export interface Metadata extends NextMetadata {
  title?: string
}

export function createMetadata(override: Metadata = {}): Metadata {
  const siteName = env.NEXT_PUBLIC_APP_NAME
  const baseUrl = getBaseUrl()

  const title = override.title ? `${override.title} | ${siteName}` : siteName
  const description = override.description ?? env.NEXT_PUBLIC_APP_DESCRIPTION

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
    authors: { name: 'Tiesen', url: 'https://tiesen.id.vn' },
    referrer: 'origin-when-cross-origin',
    robots: 'index, follow',
    openGraph: {
      ...override.openGraph,
      title,
      description,
      siteName,
      url,
      images,
      locale: override.openGraph?.locale ?? 'en_US',
      type: 'website',
    },
    twitter: {
      ...override.twitter,
      card: 'summary_large_image',
      site: '@tiesen243',
      creator: '@tiesen243',
    },
    icons: { icon: '/favicon.ico' },
    alternates: { ...override.alternates, canonical: url },
    keywords: [
      ...(Array.isArray(override.keywords)
        ? override.keywords
        : override.keywords
          ? [override.keywords]
          : []),
      'yukinu',
      'e-commerce',
      'multi-vendor',
    ],
    generator: 'Next.js',

    // Webmaster verifications
    verification: { google: 'dfsGgsTDdq4IwdTzb4p69XHyrPXvzFNmUMRxpuV4M8Q' },
    facebook: { appId: '523462826928110' },
  }
}
