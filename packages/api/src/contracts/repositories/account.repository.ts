import type { Account, accounts } from '@yukinu/db/schema/user'
import type { Database, Transaction } from '@yukinu/db/types'

import type { IBaseRepository } from './base.repository'

export interface IAccountRepository extends IBaseRepository<typeof accounts> {
  findByAccountIdAndProvider(
    params: IAccountRepository.FindByAccountIdAndProviderParams,
    tx?: Database | Transaction,
  ): Promise<IAccountRepository.FindByAccountIdAndProviderResult>
}

export declare namespace IAccountRepository {
  export interface FindByAccountIdAndProviderParams {
    accountId: string
    provider: string
  }

  export type FindByAccountIdAndProviderResult = Account | null
}
