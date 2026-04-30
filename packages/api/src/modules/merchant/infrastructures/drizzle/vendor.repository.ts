import type { Database } from '@yukinu/db/drizzle'

import { eq } from '@yukinu/db/drizzle'
import { users, vendors } from '@yukinu/db/schema'

import type { VendorRepository } from '@/modules/merchant/domain/repositories/vendor.repository'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

import { VendorEntity } from '@/modules/merchant/domain/entities/vendor.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleVendorRepository
  extends DrizzleRepository<VendorEntity, typeof vendors>
  implements VendorRepository
{
  public constructor(db: Database) {
    super(db, vendors, 'id')
  }

  public async findWithOwner(
    criterias: AbstractRepository.Criteria<VendorEntity>[] = [],
    orderBy: Partial<Record<keyof VendorEntity, 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx: Database = this._db,
  ): Promise<(VendorEntity & { owner: { id: string; username: string } })[]> {
    const whereClauses = this._buildCriteria(criterias)
    const orderByClause = this._buildOrderBy(orderBy)

    const query = tx
      .select()
      .from(this._table)
      .innerJoin(users, eq(users.id, this._table.ownerId))
      .$dynamic()

    if (whereClauses) query.where(whereClauses)
    if (orderByClause) query.orderBy(orderByClause)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)

    const rows = await query

    return rows.map((row) =>
      Object.assign(this._mapToEntity(row.vendors), { owner: row.users }),
    )
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof vendors>,
  ): VendorEntity {
    return new VendorEntity(row)
  }
}
