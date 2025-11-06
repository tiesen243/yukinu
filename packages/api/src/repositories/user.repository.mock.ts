import type { Database } from '@yukinu/db'
import type { users } from '@yukinu/db/schema/user'

import type { IProfileRepository, IUserRepository } from '@/types'
import { BaseRepository } from '@/repositories/base.repository.mock'
import { ProfileRepository } from '@/repositories/profile.repository.mock'

export class UserRepository
  extends BaseRepository<typeof users>
  implements IUserRepository
{
  private _profileRepo: IProfileRepository

  constructor() {
    super()
    this._profileRepo = new ProfileRepository()
  }

  protected override _data = [
    {
      id: '1',
      username: 'alice',
      email: 'alice@example.com',
      emailVerified: new Date('2023-01-01T00:00:00Z'),
      role: 'user' as const,
      status: 'active' as const,
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-01T00:00:00Z'),
    },
    {
      id: '2',
      username: 'bob',
      email: 'bob@example.com',
      emailVerified: null,
      role: 'admin' as const,
      status: 'active' as const,
      createdAt: new Date('2023-02-01T00:00:00Z'),
      updatedAt: new Date('2023-02-01T00:00:00Z'),
    },
  ]

  async findWithProfile(
    userId: string,
    _tx?: Database,
  ): Promise<IUserRepository.UserWithProfile | null> {
    const user = this._data.find((u) => u.id === userId)
    if (!user) return Promise.resolve(null)
    const profile = await this._profileRepo.find(userId)
    if (!profile) return Promise.resolve(null)

    return Promise.resolve({
      ...user,
      joinedAt: user.createdAt,
      profile: profile,
    })
  }
}
