import '@yukinu/validators/env'

import type { NextConfig } from 'next'

const nextConfig = {
  typedRoutes: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // rewrites: async () => [
  //   {
  //     source: '/dashboard/:path*',
  //     destination: `${env.NEXT_PUBLIC_DASHBOARD_URL}/dashboard/:path*`,
  //     locale: false,
  //   },
  // ],

  transpilePackages: [
    '@yukinu/api',
    '@yukinu/auth',
    '@yukinu/db',
    '@yukinu/ui',
    '@yukinu/validators',
  ],
} satisfies NextConfig

export default nextConfig
