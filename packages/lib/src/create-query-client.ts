import type { InvalidateQueryFilters } from '@tanstack/react-query'

import {
  defaultShouldDehydrateQuery,
  MutationCache,
  QueryClient,
} from '@tanstack/react-query'

import { transformer } from '@/transformer'

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10 * 60 * 1000, // 10 minutes
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
      },
      dehydrate: {
        serializeData: transformer.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: transformer.deserialize,
      },
    },

    mutationCache: new MutationCache({
      onSettled(
        _data,
        _error,
        _variables,
        _onMutateResult,
        _mutation,
        context,
      ) {
        const filter = context.meta?.filter
        if (!filter) return

        void (Array.isArray(filter)
          ? Promise.all(filter.map((f) => context.client.invalidateQueries(f)))
          : context.client.invalidateQueries(filter))
      },
    }),
  })

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      filter: InvalidateQueryFilters | InvalidateQueryFilters[]
    }
  }
}
