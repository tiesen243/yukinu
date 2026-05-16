import type { Database } from '@yukinu/db/drizzle'

import { accounts } from '@yukinu/db/schema'

import type { AccountRepository } from '@/modules/identity/domain/repositories/account.repository'

import { AccountEntity } from '@/modules/identity/domain/entities/account.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleAccountRepository
  extends DrizzleRepository<AccountEntity, typeof accounts>
  implements AccountRepository
{
  public constructor(db: Database) {
    super(db, accounts, ['provider', 'providerAccountId'])
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof accounts>,
  ): AccountEntity {
    return new AccountEntity(row)
  }
}
