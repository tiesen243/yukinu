import type { TRPCRouterRecord } from '@trpc/server'
import type { Database } from '@yukinu/db/drizzle'

import type { UseCases } from '@/modules/finance/types'

import { AllTransactionsByUserUseCase } from '@/modules/finance/application/use-cases/all-transactions-by-user.use-case'
import { OnePaymentUseCase } from '@/modules/finance/application/use-cases/one-payment.use-case'
import { PaymentHookUseCase } from '@/modules/finance/application/use-cases/payment-hook.use-case'
import { DrizzlePaymentRepository } from '@/modules/finance/infrastructures/drizzle/payment.repository'
import { DrizzleTransactionRepository } from '@/modules/finance/infrastructures/drizzle/transaction.repository'
import { paymentRouter } from '@/modules/finance/interfaces/payment.router'
import { transactionRouter } from '@/modules/finance/interfaces/transaction.router'

export const createFinanceModule = (db: Database) => {
  const paymentRepo = new DrizzlePaymentRepository(db)
  const transactionRepo = new DrizzleTransactionRepository(db)

  const useCases = {
    payment: {
      one: new OnePaymentUseCase(db, paymentRepo),
      hook: new PaymentHookUseCase(db, paymentRepo, transactionRepo),
    },
    transaction: {
      allByUser: new AllTransactionsByUserUseCase(db, transactionRepo),
    },
  } satisfies UseCases

  return {
    useCases,
    repos: {
      paymentRepo,
    },

    router: {
      payment: paymentRouter(useCases),
      transaction: transactionRouter(useCases),
    } satisfies TRPCRouterRecord,
  }
}
