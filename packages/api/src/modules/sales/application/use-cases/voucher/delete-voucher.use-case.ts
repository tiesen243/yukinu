import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { VoucherRepository } from '@/modules/sales/domain/repositories/voucher.repository'

import type { OneVoucherDto } from '@/modules/sales/application/dtos/voucher/one-voucher.dto'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class DeleteVoucherUseCase extends AbstractUseCase<
  OneVoucherDto.Input,
  OneVoucherDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _voucherRepo: VoucherRepository,
  ) {
    super()
  }

  async execute(input: OneVoucherDto.Input): Promise<OneVoucherDto.Output> {
    const [voucher] = await this._voucherRepo.find(
      [{ code: input.code }],
      {},
      { limit: 1 },
    )
    if (!voucher)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Voucher not found' })

    await this._voucherRepo.delete([{ id: voucher.id }])
    return voucher
  }
}
