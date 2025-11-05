import { and, eq } from '@yukinu/db'
import { vendorMembers, vendors } from '@yukinu/db/schema/vendor'

import type { IVendorRepository } from '@/contracts/repositories/vendor.repository'
import { BaseRepository } from '@/repositories/base.repository'

export class VendorRepository
  extends BaseRepository<typeof vendors>
  implements IVendorRepository
{
  protected override _table = vendors

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
