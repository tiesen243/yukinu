import type { AppRouter } from '@yukinu/api/client'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { createTRPCCaller, createTRPCContext } from '@yukinu/api'
import { createTRPCClient } from '@yukinu/api/client'
import { createQueryClient } from '@yukinu/lib/create-query-client'
import { headers } from 'next/headers'
import { cache } from 'react'

import { env } from '@/lib/env'

const createRscContext = cache(async () => {
  const heads = new Headers(await headers())
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({ reqHeaders: heads, resHeaders: new Headers() })
})

const getQueryClient = cache(createQueryClient)

const api = createTRPCCaller(() => createRscContext()) as ReturnType<
  typeof createTRPCCaller
>

const trpc = createTRPCOptionsProxy({
  ctx: () => createRscContext(),
  queryClient: getQueryClient,
  client: createTRPCClient('web-rsc', env.NEXT_PUBLIC_WEB_URL),
}) as ReturnType<typeof createTRPCOptionsProxy<AppRouter>>

function HydrateClient({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}

export { api, trpc, HydrateClient, getQueryClient }
