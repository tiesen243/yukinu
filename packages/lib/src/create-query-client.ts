import type { InvalidateQueryFilters } from '@tanstack/react-query'

import {
  defaultShouldDehydrateQuery,
  MutationCache,
  QueryClient,
} from '@tanstack/react-query'
import SuperJSON from 'superjson'

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
    mutationCache: new MutationCache({
      onSuccess: (_data, _var, _res, _mutation, context) => {
        const filter = context.meta?.filter
        if (filter) void context.client.invalidateQueries(filter)
      },
    }),
  })

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      filter: InvalidateQueryFilters
    }
  }
}
