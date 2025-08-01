import '@/app/globals.css'

import type { Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { SessionProvider } from '@yuki/auth/react'
import { cn, ThemeProvider } from '@yuki/ui'
import { Toaster } from '@yuki/ui/sonner'
import { NextSSRPlugin, routerConfig } from '@yuki/uploader/next'

import { createMetadata } from '@/lib/metadata'
import { TRPCReactProvider } from '@/trpc/react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'flex min-h-dvh flex-col font-sans antialiased',
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          disableTransitionOnChange
          enableColorScheme
          enableSystem
        >
          <TRPCReactProvider>
            <SessionProvider>
              <NuqsAdapter>{children}</NuqsAdapter>
            </SessionProvider>
          </TRPCReactProvider>

          <Toaster />
        </ThemeProvider>

        <NextSSRPlugin routerConfig={routerConfig} />
      </body>
    </html>
  )
}

export const metadata = createMetadata()
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,

  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}
