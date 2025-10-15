import type { Database, Transaction } from '@yukinu/db'
import type { accounts } from '@yukinu/db/schema/user'

export interface IAccountRepository {
  create(
    data: typeof accounts.$inferInsert,
    tx: Database | Transaction,
  ): Promise<{ userId: string } | null>
}
