import { beforeEach, describe, expect, it } from 'bun:test'

import type { Database } from '@yukinu/db'

import type { IVendorService } from '@/types'
import { UserRepository } from '@/repositories/user.repository.mock'
import { VendorRepository } from '@/repositories/vendor.repository.mock'
import { VendorService } from '@/services/vendor.service'

describe('VendorService', () => {
  let vendorService: IVendorService

  beforeEach(() => {
    const db = {
      transaction: async (fn: (tx: unknown) => unknown) => {
        const tx = { rollback: () => undefined }
        return await fn(tx)
      },
    } as unknown as Database
    const userRepo = new UserRepository()
    const vendorRepo = new VendorRepository()
    vendorService = new VendorService(db, userRepo, vendorRepo)
  })

  it('should get vendors with pagination', async () => {
    const query = { search: '', page: 1, limit: 10 }
    const result = await vendorService.all(query)
    expect(result).toHaveProperty('vendors')
    expect(Array.isArray(result.vendors)).toBe(true)
  })
})
