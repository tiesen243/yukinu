import { beforeEach, describe, expect, it } from 'bun:test'

import type { Database } from '@yukinu/db'

import type { IUserService } from '../contracts/services/user.service'
import { ProfileRepository } from '../repositories/profile.repository.mock'
import { UserRepository } from '../repositories/user.repository.mock'
import { UserService } from './user.service'

describe('UserService', () => {
  let userService: IUserService

  beforeEach(() => {
    const db = {
      transaction: async (fn: (tx: unknown) => unknown) => {
        const tx = { rollback: () => undefined }
        return await fn(tx)
      },
    } as unknown as Database
    const profileRepo = new ProfileRepository()
    const userRepo = new UserRepository(profileRepo)
    userService = new UserService(db, profileRepo, userRepo)
  })

  it('should get users with pagination', async () => {
    const query = { search: '', page: 1, limit: 10 }
    const result = await userService.getUsers(query)
    expect(result).toHaveProperty('users')
    expect(Array.isArray(result.users)).toBe(true)
  })

  it('should get user profile', async () => {
    const user = { id: '1' }
    const profile = await userService.getUserProfile(user)
    expect(profile).toHaveProperty('id', user.id)
    expect(profile).toHaveProperty('profile')
  })

  it('should throw NOT_FOUND when user profile does not exist', () => {
    expect(userService.getUserProfile({ id: 'not-exist' })).rejects.toThrow(
      'Profile not found',
    )
  })

  it('should update user if permissions are correct', async () => {
    const data = { userId: '1', role: 'user', status: 'active' } as const
    const actingUser = { role: 'admin' } as never
    const result = await userService.updateUser(data, actingUser)
    expect(result).toHaveProperty('id', data.userId)
  })

  it('should throw FORBIDDEN if acting user tries to update self', () => {
    const data = { id: '1', userId: '1', role: 'admin' } as never
    expect(userService.updateUser(data, data)).rejects.toThrow(
      'You cannot update yourself',
    )
  })

  it('should throw NOT_FOUND if user does not exist on update', () => {
    const data = { id: 'not-exist' } as never
    const actingUser = { role: 'admin' } as never
    expect(userService.updateUser(data, actingUser)).rejects.toThrow(
      'User not found',
    )
  })

  it('should update user profile', async () => {
    const data = { fullName: 'Updated Name' } as never
    const result = await userService.updateUserProfile('1', data)
    expect(result).toHaveProperty('id', '1')
  })

  it('should throw NOT_FOUND if profile does not exist on update', () => {
    const data = { fullName: 'Updated Name' } as never
    expect(userService.updateUserProfile('not-exist', data)).rejects.toThrow(
      'Profile not found',
    )
  })
})
