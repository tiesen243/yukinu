'use client'

import type { QueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { SessionProvider } from '@yukinu/auth/react'
import { createQueryClient } from '@yukinu/lib/create-query-client'
import { ThemeProvider } from '@yukinu/ui'

import { createClient } from '@/lib/trpc/create-client'
import { TRPCProvider } from '@/lib/trpc/react'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  else return (clientQueryClientSingleton ??= createQueryClient())
}

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  // eslint-disable-next-line @eslint-react/naming-convention/use-state
  const [trpcClient] = useState(createClient)

  return (
    <ThemeProvider attribute='class' disableTransitionOnChange enableSystem>
      <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <SessionProvider getSessionFn={trpcClient.auth.getCurrentUser.query}>
            <NuqsAdapter>{children}</NuqsAdapter>
          </SessionProvider>
        </TRPCProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
