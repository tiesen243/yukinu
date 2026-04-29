import type { Database } from '@yukinu/db/drizzle'

import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/catalog/types'

export const createCatalogModule = (_db: Database) => {
  const useCases = {} satisfies UseCases

  return {
    useCases,
    router: {} satisfies TRPCRouterRecord,
  }
}
