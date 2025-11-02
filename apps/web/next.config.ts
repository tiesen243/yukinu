import type { NextConfig } from 'next'

import { env } from '@yukinu/validators/env'

const nextConfig = {
  logging: false,
  typedRoutes: true,
  reactStrictMode: true,
  cacheComponents: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },

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
      }://${env.NEXT_PUBLIC_DASHBOARD_URL}`,
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
