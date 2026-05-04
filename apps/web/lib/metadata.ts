// oxlint-disable no-nested-ternary

import type { Metadata as NextMetadata } from 'next'

import { env } from '@/lib/env'

export interface Metadata extends NextMetadata {
  title?: string
  openGraph?: NextMetadata['openGraph'] & {
    images?: ({ url: string; alt?: string } | string)[]
  }
}

export function createMetadata(override: Metadata = {}): Metadata {
  const siteName = env.NEXT_PUBLIC_APP_NAME
  const siteDescription =
    'An e-commerce platform that enables customers to discover, compare, and purchase products from multiple sellers in one place, with fast browsing, secure checkout, and a smooth user experience.'
  const baseUrl = env.NEXT_PUBLIC_WEB_URL

  const title = override.title ? `${override.title} | ${siteName}` : siteName
  const description = override.description ?? siteDescription

  const url = override.openGraph?.url
    ? `${baseUrl}${override.openGraph.url}`
    : baseUrl

  const images = [
    ...(override.openGraph?.images ?? []),
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
    manifest: `${baseUrl}/manifest.json`,
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
    icons: { icon: '/favicon.ico', apple: '/favicon.ico' },
    alternates: { ...override.alternates, canonical: url },
    keywords: [
      ...(override.keywords ?? []),
      'multi-vendor e-commerce platform',
      'e-commerce marketplace',
      'online shopping marketplace',
      'multi-seller marketplace',
      'discover products from multiple sellers',
      'secure online shopping',
    ],

    // Webmaster verifications
    verification: { google: 'IxxbL_t4Uj36PsfajteCHNpV6Ln9fr7WCkxmzFjW_ms' },
  }
}
