import type { Database } from '@yukinu/db/drizzle'

import type { GetBalanceDto } from '@/modules/merchant/application/dtos/vendor/get-balance.dto'
import type { VendorBalanceRepository } from '@/modules/merchant/domain/repositories/vendor-balance.repository'
import type { VendorTransferRepository } from '@/modules/merchant/domain/repositories/vendor-transfer.repository'

import { VendorBalanceEntity } from '@/modules/merchant/domain/entities/vendor-balance.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class GetBalanceUseCase extends AbstractUseCase<
  GetBalanceDto.Input,
  GetBalanceDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _vendorBalanceRepo: VendorBalanceRepository,
    private readonly _vendorTransferRepo: VendorTransferRepository,
  ) {
    super()
  }

  public async execute(
    params: GetBalanceDto.Input,
  ): Promise<GetBalanceDto.Output> {
    const { vendorId } = params

    let [[balance], transfers] = await Promise.all([
      this._vendorBalanceRepo.find([{ vendorId }], {}, { limit: 1 }),
      this._vendorTransferRepo.find([{ vendorId }]),
    ])

    if (!balance) {
      balance = new VendorBalanceEntity({ vendorId, balance: '0.00' })
      await this._vendorBalanceRepo.save(balance)
    }
    if (!transfers) transfers = []

    return {
      balance,
      transfers,
    }
  }
}
