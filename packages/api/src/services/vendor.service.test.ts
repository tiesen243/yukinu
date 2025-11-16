import { beforeEach, describe, expect, it } from 'bun:test'

import type { Database } from '@yukinu/db'

import type { IVendorService } from '@/contracts/services/vendor.service'
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
    const vendor = new VendorRepository(user)
    _service = new VendorService(db, user, vendor)
  })

  describe('all', () => {
    it('should return all vendors with pagination', async () => {
      const result = await _service.all({
        status: undefined,
        limit: 2,
        page: 1,
      })

      expect(result.vendors.length).toBeGreaterThan(0)
      expect(result.pagination.totalItems).toBeGreaterThan(0)
      expect(result.pagination.page).toBe(1)
    })
  })

  describe('register', () => {
    it('should register a new vendor', async () => {
      const output = await _service.register({
        userId: 'user-2',
        name: 'New Vendor',
        description: 'desc',
        website: '',
      })
      expect(output.vendorId).toBeDefined()
    })

    it('should throw if user already has a vendor', () => {
      expect(
        _service.register({
          userId: 'user-3',
          name: 'Duplicate Vendor',
          description: '',
          website: '',
        }),
      ).rejects.toThrow('You already have a vendor registered.')
    })
  })

  describe('update', () => {
    it('should update vendor status and user role', async () => {
      const output = await _service.update(
        { id: 'vendor-1', status: 'suspended' },
        { id: 'user-1', role: 'admin' },
      )
      expect(output.vendorId).toBe('vendor-1')
    })

    it('should throw on invalid status transition', () => {
      expect(
        _service.update(
          { id: 'vendor-1', status: 'pending' },
          { id: 'user-1', role: 'admin' },
        ),
      ).rejects.toThrow('Invalid status transition.')
    })

    it('should throw if vendor not found', () => {
      expect(
        _service.update(
          { id: 'not-exist', status: 'approved' },
          { id: 'user-1', role: 'admin' },
        ),
      ).rejects.toThrow('Vendor with ID not-exist not found.')
    })
  })

  describe('delete', () => {
    it('should delete a vendor and update user role', async () => {
      const output = await _service.delete(
        { id: 'vendor-1' },
        { id: 'user-1', role: 'admin' },
      )
      expect(output.vendorId).toBe('vendor-1')
    })

    it('should throw if vendor not found', () => {
      expect(
        _service.delete({ id: 'not-exist' }, { id: 'user-1', role: 'admin' }),
      ).rejects.toThrow('Vendor with ID not-exist not found.')
    })
  })
})
