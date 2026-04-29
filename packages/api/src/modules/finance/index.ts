import type { Database } from '@yukinu/db/drizzle'

import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/finance/types'

export const createFinanceModule = (_db: Database) => {
  const useCases = {} satisfies UseCases

  return {
    useCases,
    router: {} satisfies TRPCRouterRecord,
  }
}
