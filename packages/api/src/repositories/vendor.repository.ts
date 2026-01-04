import type { IVendorRepository } from '@/contracts/repositories/vendor.repository'
import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'
import type { UserSchema } from '@yukinu/validators/auth'
import type { VendorSchema } from '@yukinu/validators/vendor'

import { BaseRepository } from '@/repositories/base.repository'

export class VendorRepository
  extends BaseRepository<typeof Schema.vendors>
  implements IVendorRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.vendors)
  }

  allWithRelations(
    criterias: Partial<VendorSchema>[] = [],
    orderBy: Partial<Record<keyof VendorSchema, 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx = this._db,
  ): Promise<
    (Pick<
      VendorSchema,
      'id' | 'name' | 'status' | 'createdAt' | 'updatedAt'
    > & { owner: Pick<UserSchema, 'id' | 'username'>; staffCount: number })[]
  > {
    const { count, eq } = this._orm
    const { users, vendorStaffs } = this._schema

    const whereClause = this._buildCriteria(criterias)
    const orderByClause = this._buildOrderBy(orderBy)

    const query = tx
      .select({
        id: this._table.id,
        name: this._table.name,
        status: this._table.status,
        owner: { id: users.id, username: users.username },
        staffCount: count(vendorStaffs.userId),
        createdAt: this._table.createdAt,
        updatedAt: this._table.updatedAt,
      })
      .from(this._table as never)
      .leftJoin(users, eq(users.id, this._table.ownerId))
      .leftJoin(vendorStaffs, eq(vendorStaffs.vendorId, this._table.id))
      .groupBy(this._table.id, users.id)
      .$dynamic()

    if (whereClause) query.where(whereClause)
    if (orderByClause) query.orderBy(orderByClause)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)

    return query
  }
}
