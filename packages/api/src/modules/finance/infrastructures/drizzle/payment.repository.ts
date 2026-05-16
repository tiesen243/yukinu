import type { Database } from '@yukinu/db/drizzle'

import { payments } from '@yukinu/db/schema'

import type { PaymentRepository } from '@/modules/finance/domain/repositories/payment.repository'

import { PaymentEntity } from '@/modules/finance/domain/entities/payment.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzlePaymentRepository
  extends DrizzleRepository<PaymentEntity, typeof payments>
  implements PaymentRepository
{
  public constructor(db: Database) {
    super(db, payments, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof payments>,
  ): PaymentEntity {
    return new PaymentEntity(row)
  }
}
