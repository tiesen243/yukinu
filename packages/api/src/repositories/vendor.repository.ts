import { and, desc, eq } from '@yukinu/db'
import { users } from '@yukinu/db/schema/user'
import { vendorMembers, vendors } from '@yukinu/db/schema/vendor'

import type { IVendorRepository } from '@/contracts/repositories/vendor.repository'
import { BaseRepository } from '@/repositories/base.repository'

export class VendorRepository
  extends BaseRepository<typeof vendors>
  implements IVendorRepository
{
  protected override _table = vendors

  public findWithOwner(
    criteria: Partial<typeof this._table.$inferSelect>[],
    limit: number,
    offset: number,
    tx = this._db,
  ): Promise<IVendorRepository.FindWithOwnerResult[]> {
    const query = tx
      .select({
        id: this._table.id,
        name: this._table.name,
        owner: users.username,
        status: this._table.status,
        createdAt: this._table.createdAt,
        updatedAt: this._table.updatedAt,
      })
      .from(this._table)
      .innerJoin(users, eq(this._table.ownerId, users.id))
      .$dynamic()

    const whereClause = this.buildCriteria(criteria)
    if (whereClause) query.where(whereClause)
    query.orderBy(desc(this._table.createdAt))
    query.limit(limit)
    query.offset(offset)

    return query
  }

  public async getMember(vendorId: string, userId: string, tx = this._db) {
    const whereClause = and(
      eq(vendorMembers.vendorId, vendorId),
      eq(vendorMembers.userId, userId),
    )

    const [member] = await tx
      .select({ id: vendorMembers.id })
      .from(vendorMembers)
      .where(whereClause)
      .limit(1)

    return member ?? null
  }

  public async addMember(
    vendorId: string,
    userId: string,
    tx = this._db,
  ): Promise<{ id: string } | null> {
    const [newMember] = await tx
      .insert(vendorMembers)
      .values({ vendorId, userId })
      .returning({ id: vendorMembers.id })

    return newMember ?? null
  }
}
