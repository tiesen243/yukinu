'use client'

import { ThemeProvider } from '@yukinu/ui'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { TRPCReactProvider } from '@/lib/trpc/react'

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider attribute='class' disableTransitionOnChange enableSystem>
      <TRPCReactProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
      </TRPCReactProvider>
    </ThemeProvider>
  )
}
