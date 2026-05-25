import type { AllTransactionsByUserUseCase } from '@/modules/finance/application/use-cases/all-transactions-by-user.use-case'
import type { OnePaymentUseCase } from '@/modules/finance/application/use-cases/one-payment.use-case'
import type { PaymentHookUseCase } from '@/modules/finance/application/use-cases/payment-hook.use-case'

export interface UseCases {
  payment: {
    one: OnePaymentUseCase
    hook: PaymentHookUseCase
  }
  transaction: {
    allByUser: AllTransactionsByUserUseCase
  }
}

// DTOs
export { OnePaymentDto } from '@/modules/finance/application/dtos/one-payment.dto'
export { PaymentHookDto } from '@/modules/finance/application/dtos/payment-hook.dto'
export { AllTransactionsByUserDto } from '@/modules/finance/application/dtos/all-transactions-by-user.dto'

// Entities
export { PaymentEntity } from '@/modules/finance/domain/entities/payment.entity'
export { TransactionEntity } from '@/modules/finance/domain/entities/transaction.entity'
