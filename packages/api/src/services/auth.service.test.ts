import { beforeEach, describe, expect, it, vi } from 'bun:test'

import type { Database } from '@yukinu/db'

import type { IAuthService } from '@/contracts/services/auth.service'
import { AccountRepository } from '@/repositories/account.repository.mock'
import { ProfileRepository } from '@/repositories/profile.repository.mock'
import { UserRepository } from '@/repositories/user.repository.mock'
import { AuthService } from '@/services/auth.service'

await vi.mock('@yukinu/auth', () => {
  return {
    Password: class {
      async verify(hash: string, password: string) {
        // Only 'alice' with password 'password123' is valid
        return Promise.resolve(
          hash === 'hashed-password123' && password === 'password123',
        )
      }
      async hash(password: string) {
        return Promise.resolve(`hashed-${password}`)
      }
    },
    createSessionCookie: async (userId: string) =>
      Promise.resolve({
        token: 'token-' + userId,
        expires: new Date(Date.now() + 1000 * 60 * 60),
        cookie: 'session=token-' + userId,
      }),
    invalidateSession: async () => Promise.resolve('session=; Max-Age=0'),
    invalidateSessionTokens: async () => Promise.resolve(undefined),
  }
})

describe('AuthService', () => {
  let _service: IAuthService

  beforeEach(() => {
    const db = {
      transaction: async (fn: (tx: unknown) => unknown) => {
        const tx = { rollback: () => undefined }
        return await fn(tx)
      },
    } as unknown as Database
    const account = new AccountRepository()
    const profile = new ProfileRepository()
    const user = new UserRepository()
    _service = new AuthService(db, account, profile, user)
  })

  describe('login', () => {
    it('should throw UNAUTHORIZED if user does not exist', () => {
      const headers = new Headers()
      const resHeaders = new Headers()
      expect(
        _service.login(
          { identifier: 'notfound', password: 'pass' },
          headers,
          resHeaders,
        ),
      ).rejects.toThrow('Invalid credentials')
    })

    it('should throw UNAUTHORIZED if password is invalid', () => {
      const headers = new Headers()
      const resHeaders = new Headers()
      expect(
        _service.login(
          { identifier: 'alice', password: 'wrong' },
          headers,
          resHeaders,
        ),
      ).rejects.toThrow('Invalid credentials')
    })

    it('should return token and set cookie for valid credentials', async () => {
      const headers = new Headers()
      const resHeaders = new Headers()
      const result = await _service.login(
        { identifier: 'alice', password: 'password123' },
        headers,
        resHeaders,
      )
      expect(result).toHaveProperty('token')
      expect(resHeaders.get('Set-Cookie')).toContain('session=token-user-2')
    })
  })

  describe('register', () => {
    it('should throw CONFLICT if user already exists', () => {
      expect(
        _service.register({
          email: 'alice@example.com',
          username: 'alice',
          password: 'pass',
          confirmPassword: 'pass',
        }),
      ).rejects.toThrow('Email or username already in use')
    })

    it('should register a new user', async () => {
      const result = await _service.register({
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'pass',
        confirmPassword: 'pass',
      })
      expect(result).toHaveProperty('userId')
    })
  })

  describe('logout', () => {
    it('should append Set-Cookie if invalidateSession returns a cookie', async () => {
      const headers = new Headers()
      const resHeaders = new Headers()
      await _service.logout(headers, resHeaders)
      expect(resHeaders.get('Set-Cookie')).toContain('session=; Max-Age=0')
    })
  })

  describe('changePassword', () => {
    it('should throw UNAUTHORIZED if current password is incorrect', () => {
      expect(
        _service.changePassword({
          userId: 'user-2',
          currentPassword: 'wrong',
          newPassword: 'newpass',
          confirmNewPassword: 'newpass',
          isLogOutOtherSessions: false,
        }),
      ).rejects.toThrow('Invalid current password')
    })

    it('should change password and optionally logout other sessions', async () => {
      const result = await _service.changePassword({
        userId: 'user-2',
        currentPassword: 'password123',
        newPassword: 'newpass',
        confirmNewPassword: 'newpass',
        isLogOutOtherSessions: true,
      })
      expect(result).toHaveProperty('userId')
    })
  })
})
