import type { OnePaymentUseCase } from '@/modules/finance/application/use-cases/payment/one-payment.use-case'
import type { PaymentHookUseCase } from '@/modules/finance/application/use-cases/payment/payment-hook.use-case'
import type { AllTransactionsByUserUseCase } from '@/modules/finance/application/use-cases/transaction/all-by-user.use-case'

export interface UseCases {
  payment: {
    one: OnePaymentUseCase
    hook: PaymentHookUseCase
  }
  transaction: {
    allByUser: AllTransactionsByUserUseCase
  }
}

// Payment DTOs
export { OnePaymentDto } from '@/modules/finance/application/dtos/payment/one-payment.dto'
export { PaymentHookDto } from '@/modules/finance/application/dtos/payment/payment-hook.dto'

// Transaction DTOs
export { AllTransactionsByUserDto } from '@/modules/finance/application/dtos/transaction/all-by-user.dto'

// Entities
export { PaymentEntity } from '@/modules/finance/domain/entities/payment.entity'
export { TransactionEntity } from '@/modules/finance/domain/entities/transaction.entity'
