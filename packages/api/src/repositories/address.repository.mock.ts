import type { addresses } from '@yukinu/db/schema/profile'

import type { IAddressRepository } from '@/types'
import { BaseRepository } from '@/repositories/base.repository.mock'

export class AddressRepository
  extends BaseRepository<typeof addresses>
  implements IAddressRepository
{
  protected override _data = [
    {
      id: 'address-1',
      recipientName: 'John Doe',
      phoneNumber: '555-1234',
      userId: 'user-1',
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      postalCode: '12345',
      country: 'USA',
      isDefault: true,
    },
    {
      id: 'address-2',
      userId: 'user-1',
      recipientName: 'Jane Doe',
      phoneNumber: '555-5678',
      street: '456 Elm St',
      city: 'Springfield',
      state: 'IL',
      postalCode: '67890',
      country: 'USA',
      isDefault: false,
    },
  ]
}
