import type { Database } from '@yukinu/db/drizzle'

import { transactions } from '@yukinu/db/schema'

import type { TransactionRepository } from '@/modules/finance/domain/repositories/transaction.repository'

import { TransactionEntity } from '@/modules/finance/domain/entities/transaction.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleTransactionRepository
  extends DrizzleRepository<TransactionEntity, typeof transactions>
  implements TransactionRepository
{
  public constructor(db: Database) {
    super(db, transactions, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof transactions>,
  ): TransactionEntity {
    return new TransactionEntity(row)
  }
}
