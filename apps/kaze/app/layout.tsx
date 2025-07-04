import '@/app/globals.css'

import { Geist, Geist_Mono } from 'next/font/google'

import { SessionProvider } from '@yuki/auth/react'
import { cn, ThemeProvider } from '@yuki/ui'
import { Toaster } from '@yuki/ui/sonner'

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'flex min-h-dvh flex-col font-sans antialiased',
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          enableColorScheme
          enableSystem
        >
          <TRPCReactProvider>
            <SessionProvider>{children}</SessionProvider>
          </TRPCReactProvider>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = createMetadata()
