import type { profiles } from '@yukinu/db/schema/profile'

import type { IProfileRepository } from './profile'
import { BaseRepository } from './base.repository'

export class ProfileRepository
  extends BaseRepository<typeof profiles>
  implements IProfileRepository {}
