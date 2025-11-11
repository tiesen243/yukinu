import type { Account, accounts, NewAccount } from '@yukinu/db/schema/user'

import type { IBaseRepository } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IAccountRepository extends IBaseRepository<typeof accounts> {}

export namespace IAccountRepository {
  export type IAccount = Account
  export type INewAccount = NewAccount
}
