import { eq } from '@yukinu/db'
import { sessions, users } from '@yukinu/db/schema/user'

import type { IUserRepository } from '@/types'
import { BaseRepository } from '@/repositories/base.repository'

export class UserRepository
  extends BaseRepository<typeof users>
  implements IUserRepository
{
  protected override _table = users

  async deleteSessions(
    userId: IUserRepository.User['id'],
    tx = this._db,
  ): Promise<void> {
    await tx.delete(sessions).where(eq(sessions.userId, userId))
  }
}
