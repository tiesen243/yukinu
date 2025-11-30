import { cache } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

import { appRouter, createCaller, createTRPCContext } from '@yukinu/api'
import { createQueryClient } from '@yukinu/lib/create-query-client'

const createRscContext = cache(async (opts: { headers: Headers }) => {
  const heads = new Headers(opts.headers)
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({ headers: heads })
})

const getQueryClient = cache(createQueryClient)

const createApi = (opts: { headers: Headers }) =>
  createCaller(() => createRscContext(opts))

const createTRPC = (opts: { headers: Headers }) =>
  createTRPCOptionsProxy({
    ctx: () => createRscContext(opts),
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

export { createApi, createTRPC, getQueryClient, HydrateClient }
