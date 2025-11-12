import { beforeEach, describe } from 'bun:test'

import type { Database } from '@yukinu/db'

import type { IAuthService } from '@/contracts/services/auth.service'
import { AccountRepository } from '@/repositories/account.repository.mock'
import { ProfileRepository } from '@/repositories/profile.repository.mock'
import { UserRepository } from '@/repositories/user.repository.mock'
import { AuthService } from '@/services/auth.service'

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
})
