import type { Database } from '@yukinu/db/drizzle'

import { eq } from '@yukinu/db/drizzle'
import { orders, payments, transactions } from '@yukinu/db/schema'

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

  public async findByUserId(
    userId: string,
    tx: Database = this._db,
  ): Promise<TransactionEntity[]> {
    const rows = await tx
      .selectDistinct({
        id: this._table.id,
        paymentId: this._table.paymentId,
        body: this._table.body,
        gateway: this._table.gateway,
        amountIn: this._table.amountIn,
        amountOut: this._table.amountOut,
        referenceNumber: this._table.referenceNumber,
        transactionContent: this._table.transactionContent,
        transactionDate: this._table.transactionDate,
        createdAt: this._table.createdAt,
      })
      .from(this._table)
      .innerJoin(payments, eq(payments.id, this._table.paymentId))
      .innerJoin(orders, eq(orders.paymentId, payments.id))
      .where(eq(orders.userId, userId))
      .orderBy(this._table.transactionDate)

    return rows.map((row) => this._mapToEntity(row))
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof this._table>,
  ): TransactionEntity {
    return new TransactionEntity(row)
  }
}
