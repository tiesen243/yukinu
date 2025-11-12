import { desc, eq } from '@yukinu/db'
import { users } from '@yukinu/db/schema/user'
import { vendors } from '@yukinu/db/schema/vendor'

import type { IVendorRepository } from '@/contracts/repositories/vendor.repository'
import { BaseRepository } from '@/repositories/base.repository'

export class VendorRepository
  extends BaseRepository<typeof vendors>
  implements IVendorRepository
{
  protected override _table = vendors

  findWithOwner(
    criteria: Partial<IVendorRepository.IVendor>[],
    limit?: number,
    offset?: number,
    tx = this._db,
  ): Promise<IVendorRepository.VendorWithOwner[]> {
    const query = tx
      .select({
        id: vendors.id,
        name: vendors.name,
        status: vendors.status,
        owner: users.username,
        updatedAt: vendors.updatedAt,
      })
      .from(this._table)
      .innerJoin(users, eq(vendors.ownerId, users.id))
      .orderBy(desc(vendors.createdAt))
      .$dynamic()

    const whereClause = this.buildCriteria(criteria)
    if (whereClause) query.where(whereClause)

    if (limit !== undefined) query.limit(limit)
    if (offset !== undefined) query.offset(offset)

    return query
  }
}
