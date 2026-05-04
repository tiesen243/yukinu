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
} satisfies NextConfig

export default nextConfig
