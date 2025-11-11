import { beforeEach, describe } from 'bun:test'

import type { Database } from '@yukinu/db'

import type { IVendorService } from '@/types'
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
    const vendorRepo = new VendorRepository()
    _service = new VendorService(db, vendorRepo)
  })
})
