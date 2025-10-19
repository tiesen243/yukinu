import { beforeEach, describe, expect, it } from 'bun:test'
import { TRPCError } from '@trpc/server'

import type { UserModel } from '@yukinu/validators/user'
import { db } from '@yukinu/db/mock'
import { profiles } from '@yukinu/db/schema/profile'
import { users } from '@yukinu/db/schema/user'

import { ProfileRepositoryMock } from '../repositories/profile.repository.mock'
import { UserRepositoryMock } from '../repositories/user.repository.mock'
import { UserService } from './user.service'

const mockProfileRepo = new ProfileRepositoryMock(db, profiles)
const mockUserRepo = new UserRepositoryMock(db, users)

describe('UserService', () => {
  let service: UserService

  beforeEach(() => {
    service = new UserService(db, mockProfileRepo, mockUserRepo)
  })

  it('getUserInfo returns merged user and profile', async () => {
    expect(await service.getUserInfo({ id: 'mock-id' })).toMatchObject({
      id: 'mock-id',
    })
  })

  it('getUserInfo throws if profile not found', () => {
    expect(service.getUserInfo({ id: 'find-fail' })).rejects.toThrowError(
      new TRPCError({ code: 'NOT_FOUND', message: 'User not found' }),
    )
  })

  it('updateUserInfo returns updated profile', async () => {
    const result = await service.updateUserInfo('mock-id', updateBody)
    expect(result).toMatchObject({
      id: 'mock-id',
    })
  })

  it('updateUserInfo throws if user not found', () => {
    expect(
      service.updateUserInfo('find-fail', updateBody),
    ).rejects.toThrowError(
      new TRPCError({ code: 'NOT_FOUND', message: 'User not found' }),
    )
  })

  it('updateUserInfo throws if update fails', () => {
    expect(
      service.updateUserInfo('update-fail', updateBody),
    ).rejects.toThrowError(
      new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update profile',
      }),
    )
  })
})

const updateBody = {
  bio: 'New bio',
  dateOfBirth: '1990-01-01',
  fullName: 'New Name',
  gender: 'other',
  website: 'https://example.com',
} satisfies UserModel.UpdateProfileBody
