import { beforeEach, describe, expect, it } from 'bun:test'

import type { Database } from '@yukinu/db'

import type { IUserService } from '../contracts/services/user.service'
import { AccountRepository } from '@/repositories/account.repository.mock'
import { ProfileRepository } from '../repositories/profile.repository.mock'
import { UserRepository } from '../repositories/user.repository.mock'
import { UserService } from './user.service'

describe('UserService', () => {
  let service: IUserService

  beforeEach(() => {
    const db = {
      transaction: async (fn: (tx: unknown) => unknown) => {
        const tx = { rollback: () => undefined }
        return await fn(tx)
      },
    } as unknown as Database
    const accountRepo = new AccountRepository()
    const profileRepo = new ProfileRepository()
    const userRepo = new UserRepository()
    service = new UserService(db, accountRepo, profileRepo, userRepo)
  })

  describe('UserService.getUsers', () => {
    it('returns users and pagination', async () => {
      const result = await service.getUsers({ search: '', page: 1, limit: 10 })
      expect(result.users.length).toBeGreaterThan(0)
      expect(result.pagination).toHaveProperty('page', 1)
    })
  })

  describe('UserService.getUserProfile', () => {
    it('returns user profile if exists', async () => {
      const profile = await service.getUserProfile({ id: '1' })
      expect(profile).toHaveProperty('profile')
    })

    it('throws NOT_FOUND if profile does not exist', () => {
      expect(service.getUserProfile({ id: 'not-exist' })).rejects.toThrow(
        'Profile not found',
      )
    })
  })

  describe('UserService.updateUser', () => {
    const adminUser = {
      id: '1',
      role: 'admin',
      status: 'active',
      email: 'admin@example.com',
    } as const

    it('throws NOT_FOUND if user does not exist', () => {
      expect(
        service.updateUser(
          {
            userId: 'not-exist',
            password: '123',
            role: 'user',
            status: 'active',
          },
          adminUser,
        ),
      ).rejects.toThrow('User not found')
    })

    it('throws FORBIDDEN if acting user tries to update self', () => {
      expect(
        service.updateUser(
          { userId: '1', password: '123', role: 'admin', status: 'active' },
          adminUser,
        ),
      ).rejects.toThrow('You cannot update yourself')
    })

    it('throws FORBIDDEN if moderator tries to update admin', () => {
      expect(
        service.updateUser(
          { userId: '2', password: '123', role: 'admin', status: 'active' },
          { ...adminUser, role: 'moderator' },
        ),
      ).rejects.toThrow('You do not have permission to update this user')
    })
  })
})
