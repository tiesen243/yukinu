import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { OnePaymentDto } from '@/modules/finance/application/dtos/payment/one-payment.dto'
import type { PaymentRepository } from '@/modules/finance/domain/repositories/payment.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class OnePaymentUseCase extends AbstractUseCase<
  OnePaymentDto.Input,
  OnePaymentDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _paymentRepo: PaymentRepository,
  ) {
    super()
  }

  public async execute(
    input: OnePaymentDto.Input,
  ): Promise<OnePaymentDto.Output> {
    const { id } = input

    const [payment] = await this._paymentRepo.find([{ id }], {}, { limit: 1 })
    if (!payment)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Payment not found' })

    return payment
  }
}
