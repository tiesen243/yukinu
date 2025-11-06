import type { Database } from '@yukinu/db'
import type { vendors } from '@yukinu/db/schema/vendor'

import type { IVendorRepository } from '@/contracts/repositories/vendor.repository'
import { BaseRepository } from '@/repositories/base.repository.mock'

export class VendorRepository
  extends BaseRepository<typeof vendors>
  implements IVendorRepository
{
  protected override _data = [
    {
      id: 'vendor-1',
      ownerId: 'user-1',
      name: 'Acme Corp',
      description: 'Leading provider of widgets',
      imageUrl: 'https://example.com/acme.png',
      website: 'https://acme.com',
      status: 'approved' as const,
      createdAt: new Date('2023-01-01T10:00:00Z'),
      updatedAt: new Date('2023-06-01T10:00:00Z'),
    },
    {
      id: 'vendor-2',
      ownerId: 'user-2',
      name: 'Globex Inc',
      description: 'Innovative solutions for modern businesses',
      imageUrl: null,
      website: 'https://globex.com',
      status: 'pending' as const,
      createdAt: new Date('2023-02-15T12:00:00Z'),
      updatedAt: new Date('2023-06-15T12:00:00Z'),
    },
  ]

  findWithOwner(
    _criteria: Partial<typeof vendors.$inferSelect>[],
    _limit: number,
    _offset: number,
    _tx?: Database,
  ): Promise<IVendorRepository.FindWithOwnerResult[]> {
    return Promise.resolve(
      this._data.map((vendor) => ({
        ...vendor,
        owner: 'Mock Owner',
      })),
    )
  }

  getMember(
    vendorId: string,
    userId: string,
    _tx?: Database,
  ): Promise<{ id: string } | null> {
    const vendor = this._data.find((v) => v.id === vendorId)
    if (vendor?.ownerId === userId) return Promise.resolve({ id: 'member-1' })
    return Promise.resolve(null)
  }

  addMember(
    vendorId: string,
    userId: string,
    _tx?: Database,
  ): Promise<{ id: string } | null> {
    const vendor = this._data.find((v) => v.id === vendorId)
    if (vendor?.ownerId === userId)
      return Promise.resolve({ id: 'new-member-1' })
    return Promise.resolve(null)
  }
}
