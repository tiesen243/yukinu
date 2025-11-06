import { beforeEach, describe, expect, it } from 'bun:test'

import type { Database } from '@yukinu/db'

import type { IAuthService } from '../contracts/services/auth.service'
import { AccountRepository } from '../repositories/account.repository.mock'
import { ProfileRepository } from '../repositories/profile.repository.mock'
import { UserRepository } from '../repositories/user.repository.mock'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let service: IAuthService

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
    service = new AuthService(db, accountRepo, profileRepo, userRepo)
  })

  describe('AuthService.register', () => {
    it('should register a new user', async () => {
      const result = await service.register({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })
      expect(result).toHaveProperty('id')
    })

    it('should throw CONFLICT if username or email exists', () => {
      expect(
        service.register({
          username: 'alice',
          email: 'alice@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        }),
      ).rejects.toThrow('Username or email already exists')
    })
  })

  describe('changePassword', () => {
    it('should create account if not existed', async () => {
      const result = await service.changePassword('not-exist', {
        currentPassword: '',
        newPassword: 'newpass',
        confirmNewPassword: 'newpass',
        isLogOutOtherSessions: false,
      })
      expect(result).toHaveProperty('id', 'not-exist')
    })

    it('should throw BAD_REQUEST if current password is missing', async () => {
      const user = await service.register({
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'oldpass',
        confirmPassword: 'oldpass',
      })
      expect(
        service.changePassword(user.id, {
          currentPassword: '',
          newPassword: 'newpass',
          confirmNewPassword: 'newpass',
          isLogOutOtherSessions: false,
        }),
      ).rejects.toThrow('Current password is required')
    })

    it('should throw BAD_REQUEST if current password is incorrect', async () => {
      const user = await service.register({
        email: 'test@example.com',
        username: 'testuser',
        password: 'correct',
        confirmPassword: 'correct',
      })
      expect(
        service.changePassword(user.id, {
          currentPassword: 'wrong',
          newPassword: 'newpass',
          confirmNewPassword: 'newpass',
          isLogOutOtherSessions: false,
        }),
      ).rejects.toThrow('Current password is incorrect')
    })

    it('should throw BAD_REQUEST if new password is same as current', async () => {
      const password = 'samepass'
      const user = await service.register({
        email: 'test@example.com',
        username: 'testuser',
        password,
        confirmPassword: password,
      })

      expect(
        service.changePassword(user.id, {
          currentPassword: password,
          newPassword: password,
          confirmNewPassword: password,
          isLogOutOtherSessions: false,
        }),
      ).rejects.toThrow(
        'New password must be different from the current password',
      )
    })

    it('should change password and logout other sessions', async () => {
      const password = 'oldpass'
      const user = await service.register({
        email: 'testuser@example.com',
        username: 'testuser',
        password,
        confirmPassword: password,
      })
      const result = await service.changePassword(user.id, {
        currentPassword: password,
        newPassword: 'newpass',
        confirmNewPassword: 'newpass',
        isLogOutOtherSessions: true,
      })
      expect(result).toHaveProperty('id', user.id)
    })
  })
})
