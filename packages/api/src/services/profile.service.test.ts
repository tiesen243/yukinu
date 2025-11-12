import { beforeEach, describe } from 'bun:test'

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
})
