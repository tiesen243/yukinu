import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { PaymentHookDto } from '@/modules/finance/application/dtos/payment/payment-hook.dto'
import type { PaymentRepository } from '@/modules/finance/domain/repositories/payment.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class PaymentHookUseCase extends AbstractUseCase<
  PaymentHookDto.Input,
  PaymentHookDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _paymentRepo: PaymentRepository,
  ) {
    super()
  }

  public async execute(
    input: PaymentHookDto.Input,
  ): Promise<PaymentHookDto.Output> {
    if (!input.code.startsWith('PM'))
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid payment code format',
      })

    if (input.transferType !== 'in' || input.transferAmount <= 0)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Only incoming transfers with positive amounts are accepted',
      })

    const id = input.code.replace('PM', '')
    const [payment] = await this._paymentRepo.find(
      [{ id, status: 'pending' }],
      {},
      { limit: 1 },
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
    await this._paymentRepo.save(updatedPayment)
  }
}
