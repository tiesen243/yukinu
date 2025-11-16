import { beforeEach, describe, expect, it } from 'bun:test'

import type { Database } from '@yukinu/db'

import type { IProfileService } from '@/contracts/services/profile.service'
import { ProfileRepository } from '@/repositories/profile.repository.mock'
import { ProfileService } from '@/services/profile.service'

describe('UserService', () => {
  let _service: IProfileService

  beforeEach(() => {
    const db = {
      transaction: async (fn: (tx: unknown) => unknown) => {
        const tx = { rollback: () => undefined }
        return await fn(tx)
      },
    } as unknown as Database
    const profile = new ProfileRepository()
    _service = new ProfileService(db, profile)
  })

  describe('getByUserId', () => {
    it('should return profile data if found', async () => {
      const result = await _service.getByUserId({ id: 'user-1' })
      expect(result).toHaveProperty('id', 'user-1')
      expect(result).toHaveProperty('fullName')
    })

    it('should throw NOT_FOUND if profile does not exist', () => {
      expect(_service.getByUserId({ id: 'notfound' })).rejects.toThrow(
        'Profile not found',
      )
    })
  })

  describe('update', () => {
    it('should update profile and return profileId', async () => {
      const result = await _service.update({
        id: 'user-1',
        fullName: 'Alice Updated',
      })
      expect(result).toHaveProperty('profileId', 'user-1')
    })

    it('should throw NOT_FOUND if profile does not exist', () => {
      expect(
        _service.update({ id: 'notfound', fullName: 'Test' }),
      ).rejects.toThrow('Profile not found')
    })
  })
})
