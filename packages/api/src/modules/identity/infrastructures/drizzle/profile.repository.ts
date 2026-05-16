import type { Database } from '@yukinu/db/drizzle'

import { profiles } from '@yukinu/db/schema'

import type { ProfileRepository } from '@/modules/identity/domain/repositories/profile.repository'

import { ProfileEntity } from '@/modules/identity/domain/entities/profile.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleProfileRepository
  extends DrizzleRepository<ProfileEntity, typeof profiles>
  implements ProfileRepository
{
  public constructor(db: Database) {
    super(db, profiles, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof profiles>,
  ): ProfileEntity {
    return new ProfileEntity(row)
  }
}
