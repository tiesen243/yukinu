import type { Metadata as NextMetadata } from 'next'

import { env } from '@yukinu/validators/env.next'

import { getBaseUrl } from '@/lib/utils'

export interface Metadata extends NextMetadata {
  title?: string
}

export function createMetadata(override: Metadata = {}): Metadata {
  const siteName = env.NEXT_PUBLIC_APP_NAME
  const siteDescription =
    'An e-commerce platform that enables customers to discover, compare, and purchase products from multiple sellers in one place, with fast browsing, secure checkout, and a smooth user experience.'
  const baseUrl = getBaseUrl()

  const title = override.title ? `${override.title} | ${siteName}` : siteName
  const description = override.description ?? siteDescription

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
    abstract: siteDescription,
    category: 'E-commerce',
    classification: 'E-commerce Platform',
    authors: { name: 'Tiesen', url: 'https://tiesen.id.vn' },
    referrer: 'origin-when-cross-origin',
    robots: 'index, follow',
    assets: `${baseUrl}/assets`,
    manifest: `${baseUrl}/site.webmanifest`,
    pinterest: { richPin: true },
    openGraph: {
      ...override.openGraph,
      title,
      description,
      siteName,
      url,
      images,
      locale: override.openGraph?.locale ?? 'en_US',
      determiner: 'the',
      type: 'website',
    },
    twitter: {
      ...override.twitter,
      card: 'summary_large_image',
      site: '@tiesen243',
      creator: '@tiesen243',
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/favicon.ico',
      shortcut: '/favicon-32x32.png',
    },
    alternates: { ...override.alternates, canonical: url },
    keywords: [
      ...(Array.isArray(override.keywords)
        ? override.keywords
        : override.keywords
          ? [override.keywords]
          : []),
      'multi-vendor e-commerce platform',
      'e-commerce marketplace',
      'online shopping marketplace',
      'multi-seller marketplace',
      'discover products from multiple sellers',
      'secure online shopping',
    ],
    generator: 'Next.js',

    // Webmaster verifications
    verification: { google: 'dfsGgsTDdq4IwdTzb4p69XHyrPXvzFNmUMRxpuV4M8Q' },
    facebook: { appId: '523462826928110' },
  }
}
