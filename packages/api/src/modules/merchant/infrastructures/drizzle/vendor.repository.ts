import type { Database } from '@yukinu/db/drizzle'

import { count, eq } from '@yukinu/db/drizzle'
import { users, vendors, vendorStaffs } from '@yukinu/db/schema'

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

  public async findWithDetails(
    criterias: AbstractRepository.Criteria<VendorEntity>[] = [],
    orderBy: Partial<Record<keyof VendorEntity, 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx: Database = this._db,
  ): Promise<VendorRepository.WithDetails[]> {
    const whereClauses = this._buildCriteria(criterias)
    const orderByClause = this._buildOrderBy(orderBy)

    const query = tx
      .select({
        vendor: this._table,
        owner: {
          id: users.id,
          username: users.username,
        },
        staffCount: count(vendorStaffs.userId),
      })
      .from(this._table)
      .leftJoin(users, eq(users.id, this._table.ownerId))
      .leftJoin(vendorStaffs, eq(vendorStaffs.vendorId, this._table.id))
      .groupBy(this._table.id, users.id)
      .$dynamic()

    if (whereClauses) query.where(whereClauses)
    if (orderByClause) query.orderBy(orderByClause)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)

    const rows = await query

    return rows.map((row) =>
      Object.assign(this._mapToEntity(row.vendor), {
        owner: row.owner,
        staffCount: row.staffCount,
      }),
    )
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof vendors>,
  ): VendorEntity {
    return new VendorEntity(row)
  }
}
