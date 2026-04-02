'use client'

import { ThemeProvider } from '@yukinu/ui'
import { ToastProvider } from '@yukinu/ui/toast'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { TRPCReactProvider } from '@/lib/trpc/react'

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider attribute='class' disableTransitionOnChange enableSystem>
      <ToastProvider>
        <TRPCReactProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </TRPCReactProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
