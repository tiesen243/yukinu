import type { accounts } from '@yukinu/db/schema/user'

import type { IAccountRepository } from '../contracts/repositories/account.repository'
import { BaseRepository } from './base.repository.mock'

export class AccountRepository
  extends BaseRepository<typeof accounts>
  implements IAccountRepository
{
  protected override _data = [
    {
      id: '1',
      userId: '1',
      provider: 'google',
      accountId: 'google-uid-123',
      password: null,
    },
    {
      id: '2',
      userId: '2',
      provider: 'local',
      accountId: 'facebook-uid-456',
      password: null,
    },
  ]
}
