import { and, eq } from '@yukinu/db'
import { accounts } from '@yukinu/db/schema/user'

import type { IAccountRepository } from '../contracts/repositories/account.repository'
import { BaseRepository } from './base.repository'

export class AccountRepository
  extends BaseRepository<typeof accounts>
  implements IAccountRepository
{
  protected override _table = accounts

  async findByAccountIdAndProvider(
    params: IAccountRepository.FindByAccountIdAndProviderParams,
    tx = this._db,
  ): Promise<IAccountRepository.FindByAccountIdAndProviderResult> {
    const whereClause = and(
      eq(this._table.provider, params.provider),
      eq(this._table.accountId, params.accountId),
    )

    const [record] = await tx
      .select()
      .from(this._table)
      .where(whereClause)
      .limit(1)
    return record ?? null
  }
}
