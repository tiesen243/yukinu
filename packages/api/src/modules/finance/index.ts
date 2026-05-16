import type { TRPCRouterRecord } from '@trpc/server'
import type { Database } from '@yukinu/db/drizzle'

import type { UseCases } from '@/modules/finance/types'

import { DrizzlePaymentRepository } from '@/modules/finance/infrastructures/drizzle/payment.repository'

export const createFinanceModule = (db: Database) => {
  const paymentRepo = new DrizzlePaymentRepository(db)

  const useCases = {} satisfies UseCases

  return {
    useCases,
    repos: {
      paymentRepo,
    },

    router: {} satisfies TRPCRouterRecord,
  }
}
