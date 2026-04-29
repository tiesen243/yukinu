import type { Database } from '@yukinu/db/drizzle'
import { users } from '@yukinu/db/schema'

import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'

import { UserEntity } from '@/modules/identity/domain/entities/user.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleUserRepository
  extends DrizzleRepository<UserEntity, typeof users>
  implements UserRepository
{
  public constructor(db: Database) {
    super(db, users, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof users>,
  ): UserEntity {
    return new UserEntity(row)
  }
}
