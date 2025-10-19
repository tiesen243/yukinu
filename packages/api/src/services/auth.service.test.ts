import { beforeEach, describe, expect, it } from 'bun:test'
import { TRPCError } from '@trpc/server'

import { db } from '@yukinu/db/mock'
import { profiles } from '@yukinu/db/schema/profile'
import { accounts, users } from '@yukinu/db/schema/user'

import { AccountRepositoryMock } from '../repositories/account.repository.mock'
import { ProfileRepositoryMock } from '../repositories/profile.repository.mock'
import { UserRepositoryMock } from '../repositories/user.repository.mock'
import { AuthService } from './auth.service'

const mockAccountRepo = new AccountRepositoryMock(db, accounts)
const mockProfileRepo = new ProfileRepositoryMock(db, profiles)
const mockUserRepo = new UserRepositoryMock(db, users)

describe('AuthService', () => {
  let service: AuthService

  beforeEach(() => {
    service = new AuthService(
      db,
      mockAccountRepo,
      mockProfileRepo,
      mockUserRepo,
    )
  })

  it('should throw CONFLICT if user exists', () => {
    expect(service.register(registerBody)).rejects.toThrowError(
      new TRPCError({
        code: 'CONFLICT',
        message: 'Username or email already exists',
      }),
    )
  })

  it('should return user on success', async () => {
    const result = await service.register({
      ...registerBody,
      username: 'find-fail',
    })
    expect(result).toEqual({ id: 'mock-id' })
  })
})

const registerBody = {
  username: 'newuser',
  email: 'foo@test.com',
  password: 'password123',
  confirmPassword: 'password123',
}
