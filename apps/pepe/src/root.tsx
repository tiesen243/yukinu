import '@/globals.css'

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'

import { SessionProvider } from '@yuki/auth/react'
import { ThemeProvider } from '@yuki/ui'
import { Toaster } from '@yuki/ui/sonner'

import type { Route } from './+types/root'
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
          <TRPCReactProvider>
            <SessionProvider>{children}</SessionProvider>
          </TRPCReactProvider>

          <Toaster />
        </ThemeProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (
    // eslint-disable-next-line no-restricted-properties
    process.env.NODE_ENV === 'development' &&
    error &&
    error instanceof Error
  ) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className='flex min-h-dvh flex-col items-center justify-center gap-4'>
      <div className='container flex items-center justify-center gap-4'>
        <h1 className='text-4xl font-bold'>{message}</h1>
        <div className='h-12 w-[1px] bg-border' />
        <p>{details}</p>
      </div>
      {stack && (
        <pre className='container max-h-[50dvh] overflow-x-auto p-4'>
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
]

export const meta: Route.MetaFunction = () =>
  createMetadata({
    title: 'Dashboard',
    description: 'Your dashboard for managing your account and settings.',
    openGraph: {
      images: [
        {
          url: `/api/og?title=Dashboard&description=Your%20dashboard%20for%20managing%20your%20account%20and%20settings.`,
          alt: 'Dashboard',
        },
      ],
    },
  })
