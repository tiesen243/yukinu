import type { accounts } from '@yukinu/db/schema/user'
import { Password } from '@yukinu/auth'

import type { IAccountRepository } from '../contracts/repositories/account.repository'
import { BaseRepository } from './base.repository.mock'

export class AccountRepository
  extends BaseRepository<typeof accounts>
  implements IAccountRepository
{
  async findByAccountIdAndProvider(
    params: IAccountRepository.FindByAccountIdAndProviderParams,
    _tx = this._db,
  ): Promise<IAccountRepository.FindByAccountIdAndProviderResult> {
    if (
      params.provider === 'credentials' &&
      params.accountId === 'mockAccountId'
    ) {
      return Promise.resolve({
        id: 'mockId',
        userId: 'mockUserId',
        provider: 'credentials',
        accountId: 'mockAccountId',
        password: await new Password().hash('mockPassword'),
      })
    }

    return Promise.resolve(null)
  }
}
