import type { Database, Transaction } from '@yukinu/db'
import type { users } from '@yukinu/db/schema/user'

import type { IUserRepository } from './user'
import { BaseRepositoryMock } from './base.repository.mock'

export class UserRepositoryMock
  extends BaseRepositoryMock<typeof users>
  implements IUserRepository
{
  findUsersBySearchWithPagination(
    _search: string,
    _page: number,
    _limit: number,
    _tx?: Database | Transaction,
  ): Promise<IUserRepository.Users> {
    return Promise.resolve({
      users: [
        {
          id: 'mock-id',
          username: 'mock-username',
          email: 'mock-email',
          role: 'user',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
    })
  }

  async findByIdentifier(
    data: IUserRepository.FindByIdentifierParams,
    _tx: Database | Transaction,
  ): Promise<Pick<typeof users.$inferSelect, 'id'> | null> {
    if (data.username === 'find-fail') return Promise.resolve(null)
    return Promise.resolve({ id: 'mock-id' })
  }

  async findUserWithProfileById(
    userId: string,
    _tx: Database | Transaction,
  ): Promise<IUserRepository.UserWithProfile | null> {
    if (userId === 'find-fail') return Promise.resolve(null)
    return Promise.resolve({
      id: 'mock-id',
      username: 'mock-username',
      email: 'mock-email',
      emailVerified: null,
      fullName: 'Mock User',
      gender: 'Other',
      dateOfBirth: '2000-01-01',
      website: 'https://mock.website',
      bio: 'This is a mock user.',
      avatarUrl: 'https://mock.avatar/url',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  countUsersByField<TField extends keyof IUserRepository.User>(
    field: TField,
    value: IUserRepository.User[TField],
    _tx?: Database | Transaction,
  ): Promise<number> {
    if (field === 'role' && value === 'admin') return Promise.resolve(3)
    return Promise.resolve(0)
  }
}
