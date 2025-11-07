import '@yukinu/validators/env.next'

import type { NextConfig } from 'next'

import { env } from '@yukinu/validators/env'

const nextConfig = {
  typedRoutes: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  transpilePackages: [
    '@yukinu/api',
    '@yukinu/auth',
    '@yukinu/db',
    '@yukinu/ui',
    '@yukinu/validators',
  ],

  redirects: async () => [
    {
      source: '/dashboard',
      destination: `${
        env.NODE_ENV === 'production' ? 'https' : 'http'
      }://${env.DASHBOARD_URL}`,
      permanent: true,
    },
  ],

  // Enable standalone build output if specified (for Docker deployment)
  ...(process.env.NEXT_BUILD_OUTPUT === 'standalone' && {
    output: 'standalone',
    outputFileTracing: true,
  }),
} satisfies NextConfig

export default nextConfig
