import '@yukinu/validators/env'

import type { NextConfig } from 'next'

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  transpilePackages: [
    '@yukinu/api',
    '@yukinu/auth',
    '@yukinu/db',
    '@yukinu/ui',
    '@yukinu/validators',
  ],
} satisfies NextConfig

export default nextConfig
