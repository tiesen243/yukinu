import '@/lib/env'
import type { NextConfig } from 'next'

const nextConfig = {
  typedRoutes: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },

  transpilePackages: [
    '@yukinu/api',
    '@yukinu/auth',
    '@yukinu/db',
    '@yukinu/lib',
    '@yukinu/ui',
    '@yukinu/uploadthing',
  ],

  redirects: () => [
    {
      source: '/terms',
      destination:
        'https://tiesen243.github.io/yukinu/legal/term-of-service.html',
      permanent: true,
    },
    {
      source: '/privacy',
      destination:
        'https://tiesen243.github.io/yukinu/legal/privacy-policy.html',
      permanent: true,
    },
    {
      source: '/cookies',
      destination: 'https://tiesen243.github.io/yukinu/legal/cookie.html',
      permanent: true,
    },
    {
      source: '/dmca',
      destination: 'https://tiesen243.github.io/yukinu/legal/dmca.html',
      permanent: true,
    },
    {
      source: '/faq',
      destination: 'https://tiesen243.github.io/yukinu/faq.html',
      permanent: true,
    },
  ],
} satisfies NextConfig

export default nextConfig
