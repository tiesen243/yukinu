import { beforeEach, describe, expect, it } from 'bun:test'

import type { Database } from '@yukinu/db'

import type { IUserService } from '@/contracts/services/user.service'
import { ProfileRepository } from '@/repositories/profile.repository.mock'
import { UserRepository } from '@/repositories/user.repository.mock'
import { UserService } from '@/services/user.service'

describe('UserService', () => {
  let _service: IUserService

  beforeEach(() => {
    const db = {
      transaction: async (fn: (tx: unknown) => unknown) => {
        const tx = { rollback: () => undefined }
        return await fn(tx)
      },
    } as unknown as Database
    const profile = new ProfileRepository()
    const user = new UserRepository()
    _service = new UserService(db, profile, user)
  })

  describe('all', () => {
    it('should return all users with pagination', async () => {
      const result = await _service.all({ search: '', limit: 2, page: 1 })
      expect(result.users.length).toBe(0)
      expect(result.pagination.totalItems).toBe(3)
      expect(result.pagination.totalPages).toBe(2)
    })
  })

  describe('one', () => {
    it('should return a user by id', async () => {
      const user = await _service.one({ id: 'user-1' })
      expect(user).toBeDefined()
      expect(user.id).toBe('user-1')
    })

    it('should return undefined if user does not exist', () => {
      expect(_service.one({ id: 'not-exist' })).rejects.toThrow(
        'User not found.',
      )
    })
  })

  describe('update', () => {
    it('should update a user if permissions allow', async () => {
      const output = await _service.update(
        { id: 'user-2', role: 'moderator' },
        { id: 'user-1', role: 'admin' },
      )
      expect(output.userId).toBe('user-2')
      const updated = await _service.one({ id: 'user-2' })
      expect(updated.role).toBe('moderator')
    })

    it('should throw if updating own account', () => {
      expect(
        _service.update(
          { id: 'user-1', role: 'admin' },
          { id: 'user-1', role: 'admin' },
        ),
      ).rejects.toThrow('Users cannot modify their own account.')
    })

    it('should throw if updating admin as moderator', () => {
      expect(
        _service.update(
          { id: 'user-1', role: 'admin' },
          { id: 'user-2', role: 'moderator' },
        ),
      ).rejects.toThrow('Moderators cannot modify admin users.')
    })

    it('should throw NOT_FOUND if user does not exist', () => {
      expect(
        _service.update({ id: 'not-exist' }, { id: 'user-1', role: 'admin' }),
      ).rejects.toThrow('')
    })
  })
})
