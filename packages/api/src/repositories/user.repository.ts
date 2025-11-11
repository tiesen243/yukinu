import { users } from '@yukinu/db/schema/user'

import type { IUserRepository } from '@/types'
import { BaseRepository } from '@/repositories/base.repository'

export class UserRepository
  extends BaseRepository<typeof users>
  implements IUserRepository
{
  protected override _table = users
}
