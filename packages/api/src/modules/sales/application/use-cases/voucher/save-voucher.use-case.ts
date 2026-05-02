import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { SaveVoucherDto } from '@/modules/sales/application/dtos/voucher/save-voucher.dto'
import type { VoucherRepository } from '@/modules/sales/domain/repositories/voucher.repository'

import { VoucherEntity } from '@/modules/sales/domain/entities/voucher.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class SaveVoucherUseCase extends AbstractUseCase<
  SaveVoucherDto.Input,
  SaveVoucherDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _voucherRepo: VoucherRepository,
  ) {
    super()
  }

  async execute(input: SaveVoucherDto.Input): Promise<SaveVoucherDto.Output> {
    let [voucher] = await this._voucherRepo.find([{ code: input.code }])
    if (!voucher) voucher = new VoucherEntity(input)

    if (input.id && voucher.id !== input.id)
      throw new TRPCError({
        code: 'CONFLICT',
        message: `Voucher with code ${input.code} already exists`,
      })

    await this._voucherRepo.save(voucher)
    return { id: voucher.id }
  }
}
