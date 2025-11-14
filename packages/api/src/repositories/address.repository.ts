import { addresses } from '@yukinu/db/schema/profile'

import type { IAddressRepository } from '@/types'
import { BaseRepository } from '@/repositories/base.repository'

export class AddressRepository
  extends BaseRepository<typeof addresses>
  implements IAddressRepository
{
  protected override _table = addresses
}
