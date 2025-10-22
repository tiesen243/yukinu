import type { Database, Transaction } from '@yukinu/db'
import type { accounts } from '@yukinu/db/schema/user'

export interface IAccountRepository {
  findByIdAndProvider(
    id: string,
    provider: string,
    tx?: Database | Transaction,
  ): Promise<IAccountRepository.Accounts | null>

  create(
    data: typeof accounts.$inferInsert,
    tx?: Database | Transaction,
  ): Promise<{ userId: string } | null>

  updatePassword(
    id: string,
    newPassword: string,
    tx?: Database | Transaction,
  ): Promise<{ userId: string } | null>
}

export namespace IAccountRepository {
  export type Accounts = typeof accounts.$inferSelect
}
