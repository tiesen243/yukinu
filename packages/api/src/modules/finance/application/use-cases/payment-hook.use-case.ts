import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { PaymentHookDto } from '@/modules/finance/application/dtos/payment-hook.dto'
import type { PaymentRepository } from '@/modules/finance/domain/repositories/payment.repository'
import type { TransactionRepository } from '@/modules/finance/domain/repositories/transaction.repository'

import { TransactionEntity } from '@/modules/finance/domain/entities/transaction.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class PaymentHookUseCase extends AbstractUseCase<
  PaymentHookDto.Input,
  PaymentHookDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _paymentRepo: PaymentRepository,
    private readonly _transactionRepo: TransactionRepository,
  ) {
    super()
  }

  public execute(input: PaymentHookDto.Input): Promise<PaymentHookDto.Output> {
    if (!input.code.startsWith('PM'))
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid payment code format',
      })

    if (input.transferAmount <= 0)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Only incoming transfers with positive amounts are accepted',
      })

    const id = input.code.replace('PM', '')

    return this._db.transaction(async (tx) => {
      const transaction = new TransactionEntity({
        gateway: input.gateway,
        body: input.description,
        amountIn:
          input.transferType === 'in' ? String(input.transferAmount) : '0.00',
        amountOut:
          input.transferType === 'out' ? String(input.transferAmount) : '0.00',
        referenceNumber: input.referenceCode,
        transactionContent: input.content,
        transactionDate: new Date(input.transactionDate),
        paymentId: id,
      })
      await this._transactionRepo.save(transaction, tx)

      const [payment] = await this._paymentRepo.findWithOrders(
        [{ id, status: 'pending' }],
        {},
        { limit: 1 },
        tx,
      )
      if (!payment)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Payment not found' })

      const isDemoMode = process.env.NEXT_PUBLIC_SEPAY_DEMO === 'true'
      const totalAmount = Number.parseFloat(payment.amount)
      const currentPaid = Number.parseFloat(payment.paidAmount ?? '0')
      const newTransfer = Number.parseFloat(String(input.transferAmount))

      const updatedPaidAmount = currentPaid + newTransfer
      const newStatus: 'success' | 'pending' =
        isDemoMode || updatedPaidAmount >= totalAmount ? 'success' : 'pending'

      const updatedPayment = payment.clone({
        status: newStatus,
        methodReference: input.referenceCode,
        paidAmount: updatedPaidAmount.toFixed(2),
      })
      await this._paymentRepo.save(updatedPayment, tx)
    })
  }
}
