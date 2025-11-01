import { profiles } from '@yukinu/db/schema/profile'

import type { IProfileRepository } from '../contracts/repositories/profile.repository'
import { BaseRepository } from './base.repository'

export class ProfileRepository
  extends BaseRepository<typeof profiles>
  implements IProfileRepository
{
  protected override _table = profiles
}
