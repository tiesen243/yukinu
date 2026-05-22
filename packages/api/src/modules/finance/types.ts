import type { OnePaymentUseCase } from '@/modules/finance/application/use-cases/payment/one-payment.use-case'
import type { PaymentHookUseCase } from '@/modules/finance/application/use-cases/payment/payment-hook.use-case'

export interface UseCases {
  payment: {
    one: OnePaymentUseCase
    hook: PaymentHookUseCase
  }
}

// Payment DTOs
export { OnePaymentDto } from '@/modules/finance/application/dtos/payment/one-payment.dto'

// Entities
export { PaymentEntity } from '@/modules/finance/domain/entities/payment.entity'
export { TransactionEntity } from '@/modules/finance/domain/entities/transaction.entity'
