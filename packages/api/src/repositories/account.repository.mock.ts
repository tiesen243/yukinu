import type { accounts } from '@yukinu/db/schema/user'

import type { IAccountRepository } from '@/types'
import { BaseRepository } from '@/repositories/base.repository.mock'

export class AccountRepository
  extends BaseRepository<typeof accounts>
  implements IAccountRepository
{
  protected override _data = [
    {
      id: 'account-1',
      userId: 'user-1',
      provider: 'google',
      accountId: 'google-uid-123',
      password: null,
    },
    {
      id: 'account-2',
      userId: 'user-2',
      provider: 'credentials',
      accountId: 'user-2',
      password: 'hashed-password123',
    },
  ]
}
