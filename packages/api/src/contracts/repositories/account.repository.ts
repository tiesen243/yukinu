import type { Account, accounts, NewAccount } from '@yukinu/db/schema/user'

import type { IBaseRepository } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IAccountRepository extends IBaseRepository<typeof accounts> {}

export declare namespace IAccountRepository {
  export type AccountType = Account
  export type NewAccountType = NewAccount
}
