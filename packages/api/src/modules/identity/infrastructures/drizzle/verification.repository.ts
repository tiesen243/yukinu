import type { Database } from '@yukinu/db/drizzle'

import { verifications } from '@yukinu/db/schema'

import type { VerificationRepository } from '@/modules/identity/domain/repositories/verification.repository'

import { VerificationEntity } from '@/modules/identity/domain/entities/verification.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleVerificationRepository
  extends DrizzleRepository<VerificationEntity, typeof verifications>
  implements VerificationRepository
{
  public constructor(db: Database) {
    super(db, verifications, 'token')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof verifications>,
  ): VerificationEntity {
    return new VerificationEntity(row)
  }
}
