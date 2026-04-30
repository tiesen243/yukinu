import type { Database } from '@yukinu/db/drizzle'

import { eq } from '@yukinu/db/drizzle'
import { users, vendorStaffs } from '@yukinu/db/schema'

import type { VendorStaffRepository } from '@/modules/merchant/domain/repositories/vendor-staff.repository'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

import { VendorStaffEntity } from '@/modules/merchant/domain/entities/vendor-staff.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleVendorStaffRepository
  extends DrizzleRepository<VendorStaffEntity, typeof vendorStaffs>
  implements VendorStaffRepository
{
  public constructor(db: Database) {
    super(db, vendorStaffs, ['vendorId', 'userId'])
  }

  public async findWithUser(
    criterias: AbstractRepository.Criteria<VendorStaffEntity>[] = [],
    orderBy: Partial<Record<keyof VendorStaffEntity, 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx: Database = this._db,
  ): Promise<
    (VendorStaffEntity & {
      user: { id: string; username: string; email: string }
    })[]
  > {
    const whereClauses = this._buildCriteria(criterias)
    const orderByClause = this._buildOrderBy(orderBy)

    const query = tx
      .select()
      .from(this._table)
      .innerJoin(users, eq(users.id, this._table.userId))
      .$dynamic()

    if (whereClauses) query.where(whereClauses)
    if (orderByClause) query.orderBy(orderByClause)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)

    const rows = await query
    return rows.map((row) =>
      Object.assign(this._mapToEntity(row.vendor_staffs), {
        user: row.users,
      }),
    )
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof vendorStaffs>,
  ): VendorStaffEntity {
    return new VendorStaffEntity(row)
  }
}
