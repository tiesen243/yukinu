import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'bun:test'

import { createQueryClient } from '@/create-query-client'

describe('createQueryClient', () => {
  it('should create a QueryClient instance', () => {
    const queryClient = createQueryClient()
    expect(queryClient).toBeInstanceOf(QueryClient)
  })

  it('should have default options set', () => {
    const queryClient = createQueryClient()
    expect(queryClient.getDefaultOptions()).toEqual({
      queries: {
        staleTime: 10 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        gcTime: 5 * 60 * 1000,
        retry: false,
      },
      dehydrate: {
        serializeData: expect.any(Function),
        shouldDehydrateQuery: expect.any(Function),
      },
      hydrate: {
        deserializeData: expect.any(Function),
      },
    })
  })
})
