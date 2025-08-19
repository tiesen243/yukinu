import { queryOptions } from '@tanstack/vue-query'

import type { RouterInputs } from '@yuki/api'

import { trpc } from '@/lib/trpc'

export const productKeys = {
  all: () => ['products'],
  byId: (id: string) => [...productKeys.all(), id],
} as const

export const productOptions = {
  all: (options: RouterInputs['product']['all']) =>
    queryOptions({
      queryKey: productKeys.all(),
      queryFn: () => trpc.product.all.query(options),
    }),

  byId: (options: RouterInputs['product']['byId']) =>
    queryOptions({
      queryKey: productKeys.byId(options.id),
      queryFn: async () => {
        const { product } = await trpc.product.byId.query(options)
        return product
      },
    }),
} as const
