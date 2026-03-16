import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { appRouter, createCaller, createTRPCContext } from '@yukinu/api'
import { createClient } from '@yukinu/api/client'
import { createQueryClient } from '@yukinu/lib/create-query-client'
import { env } from '@yukinu/validators/env.next'
import { headers } from 'next/headers'
import { cache } from 'react'

import { getWebUrl } from '@/lib/utils'

const createRscContext = cache(async () => {
  const heads = new Headers(await headers())
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({ headers: heads })
})

const getQueryClient = cache(createQueryClient)

const api = createCaller(() => createRscContext())

const trpc = createTRPCOptionsProxy({
  ctx: () => createRscContext(),
  queryClient: getQueryClient,
  router: appRouter,
  client: createClient({
    baseUrl: getWebUrl(),
    useStreaming: env.NEXT_PUBLIC_TRPC_USE_STREAMING === 'true',
  }),
})

function HydrateClient({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}

export { api, trpc, getQueryClient, HydrateClient }
