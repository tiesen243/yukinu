import { cache } from 'react'
import { headers } from 'next/headers'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

import { appRouter, createCallerFactory, createTRPCContext } from '@yukinu/api'

import { createQueryClient } from '@/trpc/query-client'

const createRscContext = cache(async () => {
  const heads = new Headers(await headers())
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({ headers: heads })
})

const getQueryClient = cache(createQueryClient)

const api = createCallerFactory(appRouter)(() => createRscContext())

const trpc = createTRPCOptionsProxy({
  ctx: () => createRscContext(),
  queryClient: getQueryClient,
  router: appRouter,
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
