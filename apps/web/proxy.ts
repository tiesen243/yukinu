import type { NextRequest, ProxyConfig } from 'next/server'
import { NextResponse } from 'next/server'

import { env } from '@yukinu/validators/env.next'

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()

  if (url.pathname.startsWith('/dashboard')) {
    const protocol = env.NODE_ENV === 'production' ? 'https' : 'http'
    return NextResponse.redirect(
      `${protocol}://${env.NEXT_PUBLIC_DASHBOARD_URL}`,
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
} satisfies ProxyConfig
