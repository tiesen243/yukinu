import '@/app/globals.css'

import { Geist, Geist_Mono } from 'next/font/google'

import { cn } from '@yukinu/ui'
import { Toaster } from '@yukinu/ui/sonner'

import { Providers } from '@/components/providers'
import { createMetadata } from '@/lib/metadata'

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
        <Providers>
          {children}

          <Toaster richColors />
        </Providers>
      </body>
    </html>
  )
}

export const metadata = createMetadata()

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}
