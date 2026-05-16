import type { Database } from '@yukinu/db/drizzle'

import { vouchers } from '@yukinu/db/schema'

import type { VoucherRepository } from '@/modules/sales/domain/repositories/voucher.repository'

import { VoucherEntity } from '@/modules/sales/domain/entities/voucher.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleVoucherRepository
  extends DrizzleRepository<VoucherEntity, typeof vouchers>
  implements VoucherRepository
{
  public constructor(db: Database) {
    super(db, vouchers, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof vouchers>,
  ): VoucherEntity {
    return new VoucherEntity(row)
  }
}
