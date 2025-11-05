import { profiles } from '@yukinu/db/schema/profile'

import type { IProfileRepository } from '@/types'
import { BaseRepository } from '@/repositories/base.repository'

export class ProfileRepository
  extends BaseRepository<typeof profiles>
  implements IProfileRepository
{
  protected override _table = profiles
}
