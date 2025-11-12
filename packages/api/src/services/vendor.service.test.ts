import { beforeEach, describe } from 'bun:test'

import type { Database } from '@yukinu/db'

import type { IVendorService } from '@/types'
import { UserRepository } from '@/repositories/user.repository.mock'
import { VendorRepository } from '@/repositories/vendor.repository.mock'
import { VendorService } from '@/services/vendor.service'

describe('VendorService', () => {
  let _service: IVendorService

  beforeEach(() => {
    const db = {
      transaction: async (fn: (tx: unknown) => unknown) => {
        const tx = { rollback: () => undefined }
        return await fn(tx)
      },
    } as unknown as Database
    const user = new UserRepository()
    const vendor = new VendorRepository()
    _service = new VendorService(db, user, vendor)
  })
})
