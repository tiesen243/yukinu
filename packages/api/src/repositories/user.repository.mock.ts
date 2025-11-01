import type { users } from '@yukinu/db/schema/user'

import type { IUserRepository } from '../contracts/repositories/user.repository'
import { BaseRepository } from './base.repository.mock'

export class UserRepository
  extends BaseRepository<typeof users>
  implements IUserRepository
{
  protected override _data = [
    {
      id: 'admin-1',
      username: 'mockadmin',
      email: 'admin@mock.com',
      emailVerified: new Date(),
      role: 'admin' as const,
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'user-1',
      username: 'mockuser',
      email: 'user@mock.com',
      emailVerified: new Date(),
      role: 'user' as const,
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  async findByQueryWithPagination(
    params: IUserRepository.FindByQueryWithPaginationParams,
    _tx = this._db,
  ): Promise<IUserRepository.FindByQueryWithPaginationResult> {
    return Promise.resolve({
      users: [...this._data],
      pagination: {
        page: params.page,
        total: 1,
        totalPages: 1,
      },
    })
  }

  async findByIdentifier(
    params: IUserRepository.FindByIdentifierParams,
    _tx = this._db,
  ): Promise<IUserRepository.FindByIdentifierResult> {
    const user = this._data.find(
      (u) => u.username === params.username || u.email === params.email,
    )
    return Promise.resolve(user ?? null)
  }

  async findByIdWithProfile(
    userId: string,
    _tx = this._db,
  ): Promise<IUserRepository.FindByIdWithProfileResult> {
    const user = this._data.find((u) => u.id === userId)
    if (user) {
      return Promise.resolve({
        ...user,
        joinedAt: user.createdAt,
        profile: {
          avatarUrl: 'https://example.com/avatar.png',
          fullName: 'Mock User',
          bio: 'This is a mock user.',
          gender: 'other',
          dateOfBirth: '2000-01-01',
          website: 'https://example.com',
        },
      })
    }

    return Promise.resolve(null)
  }
}
