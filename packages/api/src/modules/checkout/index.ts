import type { Database } from '@yukinu/db/drizzle'

import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/checkout/types'

export const createCheckoutModule = (_db: Database) => {
  const useCases = {} satisfies UseCases

  return {
    useCases,
    router: {} satisfies TRPCRouterRecord,
  }
}
