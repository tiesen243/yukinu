import { accounts } from '@yukinu/db/schema/user'

import type { IAccountRepository } from '@/types'
import { BaseRepository } from '@/repositories/base.repository'

export class AccountRepository
  extends BaseRepository<typeof accounts>
  implements IAccountRepository
{
  protected override _table = accounts
}
