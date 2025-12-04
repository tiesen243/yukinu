import '@yukinu/validators/env'

import path from 'node:path'
import type { NextConfig } from 'next'

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
    '@yukinu/email',
    '@yukinu/lib',
    '@yukinu/ui',
    '@yukinu/validators',
    'prettier',
  ],

  // Enable standalone build output if specified (for Docker deployment)
  ...(process.env.NEXT_BUILD_OUTPUT === 'standalone' && {
    output: 'standalone',
    outputFileTracingRoot: path.join(__dirname, '../../'),
  }),
} satisfies NextConfig

export default nextConfig
