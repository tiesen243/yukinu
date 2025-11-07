import '@yukinu/validators/env'

import type { NextConfig } from 'next'
import { withMicrofrontends } from '@vercel/microfrontends/next/config'

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

  // Enable standalone build output if specified (for Docker deployment)
  ...(process.env.NEXT_BUILD_OUTPUT === 'standalone' && {
    output: 'standalone',
    outputFileTracing: true,
  }),
} satisfies NextConfig

export default withMicrofrontends(nextConfig)
