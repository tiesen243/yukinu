import type { Database } from '@yukinu/db/drizzle'

import type { AllVouchersDto } from '@/modules/sales/application/dtos/voucher/all-vouchers.dto'
import type { VoucherRepository } from '@/modules/sales/domain/repositories/voucher.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class AllVouchersUseCase extends AbstractUseCase<
  AllVouchersDto.Input,
  AllVouchersDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _voucherRepo: VoucherRepository,
  ) {
    super()
  }

  execute(_input: AllVouchersDto.Input): Promise<AllVouchersDto.Output> {
    return this._voucherRepo.find([], { expiredAt: 'desc' })
  }
}
