import type { NextRequest, ProxyConfig } from 'next/server'

import { verifyAccessToken } from '@yukinu/auth'
import { NextResponse } from 'next/server'

const protectedPaths = ['/account', '/account/:path']
const bypassCsrfPaths = ['/api/uploadthing']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = protectedPaths.some((path) => {
    if (path.endsWith('/:path')) {
      const basePath = path.replace('/:path', '')
      return pathname.startsWith(`${basePath}/`)
    }
    return pathname === path
  })

  const session = await verifyAccessToken(request)
  if (isProtected && !session?.userId) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect_to', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (bypassCsrfPaths.some((path) => pathname.startsWith(path)))
    return NextResponse.next()

  // CRSF protection: only allow same-origin requests to mutate data
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    const authHeader = request.headers.get('authorization') ?? ''

    const isApiKey = authHeader.startsWith('Apikey ')
    const isSameOrigin =
      request.headers.get('origin') === request.nextUrl.origin

    if (!isSameOrigin && !isApiKey)
      return new NextResponse('Forbidden', { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/api(.*)',
  ],
} satisfies ProxyConfig
