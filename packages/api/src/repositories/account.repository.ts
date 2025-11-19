import { accounts } from '@yukinu/db/schema/user'

import type { IAccountRepository } from '@/types'
import { BaseRepository } from '@/repositories/base.repository'

export class AccountRepository
  extends BaseRepository<typeof accounts>
  implements IAccountRepository
{
  protected override _table = accounts

  override async create(
    data: IAccountRepository.NewAccount,
    tx = this._db,
  ): Promise<{ id: string }> {
    const [result] = await tx
      .insert(this._table)
      .values(data)
      .returning({ id: this._table.id })
      .onConflictDoUpdate({
        target: [this._table.provider, this._table.accountId],
        set: data,
      })
    if (!result) throw new Error('Failed to create or update account')
    return result
  }
}
