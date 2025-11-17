import type { Database } from '@yukinu/db'
import type { vendors } from '@yukinu/db/schema/vendor'

import type { IVendorRepository } from '@/contracts/repositories/vendor.repository'
import type { IUserRepository } from '@/types'
import { BaseRepository } from '@/repositories/base.repository.mock'

export class VendorRepository
  extends BaseRepository<typeof vendors>
  implements IVendorRepository
{
  private user: IUserRepository

  constructor(userRepository: IUserRepository) {
    super()
    this.user = userRepository
  }

  protected override _data = [
    {
      id: 'vendor-1',
      ownerId: 'user-3',
      name: 'Acme Corp',
      description: 'Leading provider of widgets',
      imageUrl: 'https://example.com/acme.png',
      website: 'https://acme.com',
      status: 'approved' as const,
      createdAt: new Date('2023-01-01T10:00:00Z'),
      updatedAt: new Date('2023-06-01T10:00:00Z'),
    },
  ]

  findWithOwner(
    _criteria: Partial<IVendorRepository.Vendor>[],
    _limit?: number,
    _offset?: number,
    _tx?: Database,
  ): Promise<IVendorRepository.VendorWithOwner[]> {
    return Promise.all(
      this._data.map(async (vendor) => {
        const owner = await this.user.find(vendor.ownerId)
        return {
          ...vendor,
          owner: owner?.username ?? 'Unknown',
        }
      }),
    )
  }

  findByStaffId(
    staffId: string,
    _tx?: Database,
  ): Promise<Pick<IVendorRepository.Vendor, 'id'> | null> {
    const vendor = this._data.find((v) => v.ownerId === staffId)
    if (!vendor) return Promise.resolve(null)

    return Promise.resolve({ id: vendor.id })
  }
}
