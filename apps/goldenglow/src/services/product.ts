import { queryOptions } from '@tanstack/vue-query'

import type { RouterInputs } from '@yuki/api'

import { trpc } from '@/lib/trpc'

const productKeys = {
  all: () => ['products'] as const,
  byId: (id: string) => [...productKeys.all(), id] as const,
}

export const productsQueryOptions = (options: RouterInputs['product']['all']) =>
  queryOptions({
    queryKey: productKeys.all(),
    queryFn: async () => {
      const { products } = await trpc.product.all.query(options)
      return products
    },
  })

export const productQueryOptions = (options: RouterInputs['product']['byId']) =>
  queryOptions({
    queryKey: productKeys.byId(options.id),
    queryFn: async () => {
      const { product } = await trpc.product.byId.query(options)
      return product
    },
    enabled: !!options.id,
  })
