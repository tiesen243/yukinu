import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { appRouter, createCaller, createTRPCContext } from '@yukinu/api'
import { createQueryClient } from '@yukinu/lib/create-query-client'
import { headers } from 'next/headers'
import { cache } from 'react'

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
