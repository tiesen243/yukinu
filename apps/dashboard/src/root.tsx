import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'

import { SessionProvider } from '@yukinu/auth/react'
import { ThemeProvider } from '@yukinu/ui'
import { Button } from '@yukinu/ui/button'
import { Toaster } from '@yukinu/ui/sonner'

import type { Route } from './+types/root'
import globalsCss from '@/globals.css?url'
import { createMetadata } from '@/lib/metadata'
import { TRPCReactProvider } from '@/trpc/react'

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='flex min-h-dvh flex-col font-sans antialiased'>
        <ThemeProvider attribute='class' disableTransitionOnChange enableSystem>
          <NuqsAdapter>
            <TRPCReactProvider>
              <SessionProvider base='/dashboard'>{children}</SessionProvider>
            </TRPCReactProvider>
          </NuqsAdapter>

          <Toaster richColors />
        </ThemeProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App(_: Route.ComponentProps) {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404 ? 'Page Not Found' : error.statusText || details
  } else if (
    import.meta.env.MODE === 'development' &&
    error &&
    error instanceof Error
  ) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className='container flex min-h-dvh flex-col items-center justify-center gap-6'>
      <img
        src='/assets/images/yuki.webp'
        alt='Yukinu Mascot'
        className='size-48 object-cover select-none'
        draggable={false}
      />

      <div className='flex items-center gap-4'>
        <h1 className='text-2xl font-bold'>{message}</h1>
        <hr className='h-9 w-0.5 bg-muted' />
        <p className='text-lg font-medium'>{details}</p>
      </div>

      <Button size='sm' asChild>
        <Link to='/'>Take me home</Link>
      </Button>

      {stack && (
        <pre className='w-full overflow-x-auto p-4'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}

// prettier-ignore
export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap' },
  { rel: 'stylesheet', href: globalsCss },
  { rel: "icon", type: "image/x-icon", href: "/dashboard/favicon.ico" },
]

export const meta: Route.MetaFunction = () =>
  createMetadata({
    title: 'Dashboard',
    openGraph: {
      images: [
        {
          url: `/api/og?title=Dashboard`,
          alt: 'Dashboard - Yukinu',
        },
      ],
    },
  })
