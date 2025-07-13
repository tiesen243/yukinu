import '@yuki/validators/env'

import type { NextConfig } from 'next'

const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  transpilePackages: [
    '@yuki/api',
    '@yuki/auth',
    '@yuki/db',
    '@yuki/ui',
    '@yuki/validators',
  ],

  experimental: {
    dynamicOnHover: true,
  },
} satisfies NextConfig

export default nextConfig
