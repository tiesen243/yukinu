import { Typography } from '@yukinu/ui/typography'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'

import { Provider } from '@/components/provider'
import globalsCss from '@/globals.css?url'
import { createMetadata } from '@/lib/metadata'

import type { Route } from './+types/root'

export const meta: Route.MetaFunction = () =>
  createMetadata({
    title: 'Dashboard',
  })

export const links: Route.LinksFunction = () => [
  { rel: 'stylesheet', href: globalsCss },
  { rel: 'manifest', href: '/manifest.json' },
]

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased'>
        <Provider>{children}</Provider>

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
    message = error.status === 404 ? '404' : message
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.data
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message
    ;({ stack } = error)
  }

  return (
    <main className='flex min-h-dvh flex-col items-center justify-center gap-8'>
      <div className='flex gap-4 divide-x divide-border'>
        <Typography variant='h1' className='pr-4'>
          {message}
        </Typography>
        <Typography className='last:mb-0'>{details}</Typography>
      </div>
      {stack && (
        <pre className='max-h-64 max-w-4xl overflow-x-auto rounded-lg bg-accent p-4 text-accent-foreground'>
          {stack}
        </pre>
      )}
    </main>
  )
}
