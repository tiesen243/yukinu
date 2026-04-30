import type { Database } from '@yukinu/db/drizzle'

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
    const voucher = new VoucherEntity(input)
    await this._voucherRepo.save(voucher)
    return { id: voucher.id }
  }
}
