import { beforeEach, describe, expect, it } from 'bun:test'

import type { Database } from '@yukinu/db'

import type { IAuthService } from '../contracts/services/auth.service'
import { AccountRepository } from '../repositories/account.repository.mock'
import { ProfileRepository } from '../repositories/profile.repository.mock'
import { UserRepository } from '../repositories/user.repository.mock'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let authService: IAuthService

  beforeEach(() => {
    const db = {
      transaction: async (fn: (tx: unknown) => unknown) => {
        const tx = { rollback: () => undefined }
        return await fn(tx)
      },
    } as unknown as Database
    const accountRepo = new AccountRepository()
    const profileRepo = new ProfileRepository()
    const userRepo = new UserRepository(profileRepo)
    authService = new AuthService(db, accountRepo, profileRepo, userRepo)
  })

  it('registers a new user', async () => {
    const data = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    }
    const result = await authService.register(data)
    expect(result).toHaveProperty('id')
  })

  it('throws CONFLICT if user exists', () => {
    const data = {
      username: 'alice',
      email: 'alice@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    }
    expect(authService.register(data)).rejects.toThrow(
      'Username or email already exists',
    )
  })

  it('changes password for existing account', async () => {
    const data = {
      currentPassword: 'oldpass',
      newPassword: 'newpass',
      confirmNewPassword: 'newpass',
      isLogOutOtherSessions: false,
    }
    const result = await authService.changePassword('user-1', data)
    expect(result).toHaveProperty('id')
  })

  it('creates password for account if not exists', async () => {
    const data = {
      currentPassword: '',
      newPassword: 'newpass',
      confirmNewPassword: 'newpass',
      isLogOutOtherSessions: false,
    }
    const result = await authService.changePassword('user-2', data)
    expect(result).toHaveProperty('id')
  })
})
