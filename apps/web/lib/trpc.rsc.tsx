import type { AppRouter } from '@yukinu/api'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { createApp, createTRPCCaller, createTRPCContext } from '@yukinu/api'
import { db } from '@yukinu/db'
import { createQueryClient } from '@yukinu/lib/create-query-client'
import { headers } from 'next/headers'
import { cache } from 'react'

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
  ctx: createRscContext,
  router: createApp(db),
  queryClient: getQueryClient,
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
