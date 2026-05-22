import type { TRPCRouterRecord } from '@trpc/server'
import type { Database } from '@yukinu/db/drizzle'

import type { UseCases } from '@/modules/finance/types'

import { OnePaymentUseCase } from '@/modules/finance/application/use-cases/payment/one-payment.use-case'
import { PaymentHookUseCase } from '@/modules/finance/application/use-cases/payment/payment-hook.use-case'
import { DrizzlePaymentRepository } from '@/modules/finance/infrastructures/drizzle/payment.repository'
import { paymentRouter } from '@/modules/finance/interfaces/payment.router'

export const createFinanceModule = (db: Database) => {
  const paymentRepo = new DrizzlePaymentRepository(db)

  const useCases = {
    payment: {
      one: new OnePaymentUseCase(db, paymentRepo),
      hook: new PaymentHookUseCase(db, paymentRepo),
    },
  } satisfies UseCases

  return {
    useCases,
    repos: {
      paymentRepo,
    },

    router: {
      payment: paymentRouter(useCases),
    } satisfies TRPCRouterRecord,
  }
}
