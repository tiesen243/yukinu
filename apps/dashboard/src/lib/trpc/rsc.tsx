import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import {
  AppRouter,
  createTRPCCaller,
  createTRPCClient,
  createTRPCContext,
} from '@yukinu/api'
import { createQueryClient } from '@yukinu/lib/create-query-client'
import { cache } from 'react'

import { getDashboardUrl } from '@/lib/utils'

const createRscContext = cache((opts: { headers: Headers }) => {
  const heads = new Headers(opts.headers)
  heads.set('x-trpc-source', 'rsc')
  return createTRPCContext({ reqHeaders: heads, resHeaders: new Headers() })
})

const getQueryClient = cache(createQueryClient)

const createApi = (opts: { headers: Headers }) =>
  createTRPCCaller(() => createRscContext(opts)) as ReturnType<
    typeof createTRPCCaller
  >

const createTRPC = (opts: { headers: Headers }) =>
  createTRPCOptionsProxy({
    ctx: () => createRscContext(opts),
    queryClient: getQueryClient,
    client: createTRPCClient('dashboard-rsc', getDashboardUrl()),
  }) as ReturnType<typeof createTRPCOptionsProxy<AppRouter>>

function HydrateClient({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}

export { createApi, createTRPC, getQueryClient, HydrateClient }
