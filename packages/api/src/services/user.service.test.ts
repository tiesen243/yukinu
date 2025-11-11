import { beforeEach, describe } from 'bun:test'

import type { Database } from '@yukinu/db'

import type { IUserService } from '../contracts/services/user.service'
import { ProfileRepository } from '../repositories/profile.repository.mock'
import { UserRepository } from '../repositories/user.repository.mock'
import { UserService } from './user.service'

describe('UserService', () => {
  let _service: IUserService

  beforeEach(() => {
    const db = {
      transaction: async (fn: (tx: unknown) => unknown) => {
        const tx = { rollback: () => undefined }
        return await fn(tx)
      },
    } as unknown as Database
    const profileRepo = new ProfileRepository()
    const userRepo = new UserRepository()
    _service = new UserService(db, profileRepo, userRepo)
  })
})
