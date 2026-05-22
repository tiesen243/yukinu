import type { NextRequest, ProxyConfig } from 'next/server'

import { NextResponse } from 'next/server'

const bypassCsrf = [
  (pathname: string) => pathname === '/api/uploadthing',
  (pathname: string) => pathname === '/api/trpc/finance.payment.webhook',
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (bypassCsrf.some((matches) => matches(pathname)))
    return NextResponse.next()

  // CRSF protection: only allow same-origin requests to mutate data
  if (
    !['GET', 'HEAD', 'OPTIONS'].includes(request.method) &&
    request.headers.get('origin') !== request.nextUrl.origin
  )
    return new NextResponse('Forbidden', { status: 403 })

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
