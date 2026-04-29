import type { users } from '@yukinu/db/schema'

import type { IUserRepository } from '@/modules/auth/domain/repositories/user.repository'

import { UserEntity } from '@/modules/auth/domain/entities/user.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class UserRepository
  extends DrizzleRepository<UserEntity, typeof users>
  implements IUserRepository
{
  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof users>,
  ): UserEntity {
    return new UserEntity(row)
  }
}
