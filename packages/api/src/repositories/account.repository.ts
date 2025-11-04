import { accounts } from '@yukinu/db/schema/user'

import type { IAccountRepository } from '../contracts/repositories/account.repository'
import { BaseRepository } from './base.repository'

export class AccountRepository
  extends BaseRepository<typeof accounts>
  implements IAccountRepository
{
  protected override _table = accounts
}
