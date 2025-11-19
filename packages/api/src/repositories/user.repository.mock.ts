import type { Database } from '@yukinu/db'
import type { users } from '@yukinu/db/schema/user'

import type { IUserRepository } from '@/types'
import { BaseRepository } from '@/repositories/base.repository.mock'

export class UserRepository
  extends BaseRepository<typeof users>
  implements IUserRepository
{
  protected override _data = [
    {
      id: 'user-1',
      username: 'bob',
      email: 'bob@example.com',
      emailVerified: null,
      role: 'admin' as const,
      status: 'active' as const,
      createdAt: new Date('2023-02-01T00:00:00Z'),
      updatedAt: new Date('2023-02-01T00:00:00Z'),
    },
    {
      id: 'user-2',
      username: 'alice',
      email: 'alice@example.com',
      emailVerified: new Date('2023-01-01T00:00:00Z'),
      role: 'user' as const,
      status: 'active' as const,
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-01T00:00:00Z'),
    },
    {
      id: 'user-3',
      username: 'charlie',
      email: 'charlie@example.com',
      emailVerified: new Date('2023-03-01T00:00:00Z'),
      role: 'vendor_owner' as const,
      status: 'active' as const,
      createdAt: new Date('2023-03-01T00:00:00Z'),
      updatedAt: new Date('2023-03-01T00:00:00Z'),
    },
  ]

  deleteSessions(
    _userId: IUserRepository.User['id'],
    _tx?: Database,
  ): Promise<void> {
    return Promise.resolve()
  }
}
