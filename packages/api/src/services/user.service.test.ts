import { beforeEach, describe, expect, it } from 'bun:test'

import type { Database } from '@yukinu/db/types'

import type { IUserService } from '../contracts/services/user.service'
import { ProfileRepository } from '../repositories/profile.repository.mock'
import { UserRepository } from '../repositories/user.repository.mock'
import { UserService } from './user.service'

describe('UserService', () => {
  let userService: IUserService
  let adminUser: { id: string; email: string; role: 'admin'; status: 'active' }
  function createMockUser(id: string) {
    return {
      id,
      userId: id,
      email: 'user@mock.com',
      role: 'user' as const,
      status: 'active' as const,
    }
  }

  beforeEach(() => {
    const db = {
      transaction: async (fn: (tx: unknown) => unknown) => {
        const tx = { rollback: () => undefined }
        return await fn(tx)
      },
    } as unknown as Database
    const profileRepo = new ProfileRepository(db)
    const userRepo = new UserRepository(db)
    userService = new UserService(db, profileRepo, userRepo)
    adminUser = {
      id: 'admin-1',
      email: 'admin@test.com',
      role: 'admin',
      status: 'active',
    }
  })

  it('should get users with pagination', async () => {
    const query = { search: '', page: 1, limit: 10 }
    const result = await userService.getUsers(query)
    expect(result).toHaveProperty('users')
    expect(Array.isArray(result.users)).toBe(true)
  })

  it('should get user profile', async () => {
    const user = { id: 'user-1' }
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
    const data = createMockUser('user-1')
    const result = await userService.updateUser(data, adminUser)
    expect(result).toHaveProperty('id', data.userId)
  })

  it('should throw FORBIDDEN if acting user tries to update self', () => {
    const data = createMockUser(adminUser.id)
    expect(userService.updateUser(data, adminUser)).rejects.toThrow(
      'You cannot update yourself',
    )
  })

  it('should throw NOT_FOUND if user does not exist on update', () => {
    const data = createMockUser('not-exist')
    expect(userService.updateUser(data, adminUser)).rejects.toThrow(
      'User not found',
    )
  })

  it('should update user profile', async () => {
    const userId = 'user-1'
    const data = {
      fullName: 'Updated Name',
      avatarUrl: 'https://example.com/new-avatar.png',
      gender: 'helicopter',
      dateOfBirth: '1990-01-01',
      website: 'https://new-website.com',
      bio: 'This is an updated bio.',
    }
    const result = await userService.updateUserProfile(userId, data)
    expect(result).toHaveProperty('id', userId)
  })

  it('should throw NOT_FOUND if profile does not exist on update', () => {
    const userId = 'not-exist'
    const data = {
      fullName: 'Updated Name',
      avatarUrl: 'https://example.com/new-avatar.png',
      gender: 'helicopter',
      dateOfBirth: '1990-01-01',
      website: 'https://new-website.com',
      bio: 'This is an updated bio.',
    }
    expect(userService.updateUserProfile(userId, data)).rejects.toThrow(
      'Profile not found',
    )
  })
})
