import '@yukinu/validators/env'

import type { NextConfig } from 'next'

import path from 'node:path'

const nextConfig = {
  typedRoutes: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },

  transpilePackages: [
    '@yukinu/api',
    '@yukinu/auth',
    '@yukinu/db',
    '@yukinu/email',
    '@yukinu/lib',
    '@yukinu/ui',
    '@yukinu/validators',
  ],

  // Enable standalone build output if specified (for Docker deployment)
  // oxlint-disable-next-line no-process-env
  ...(process.env.NEXT_BUILD_OUTPUT === 'standalone' && {
    output: 'standalone',
    outputFileTracingRoot: path.join(__dirname, '../../'),
  }),
} satisfies NextConfig

export default nextConfig
