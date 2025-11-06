import { beforeEach, describe, expect, it } from 'bun:test'

import type { Database } from '@yukinu/db'

import type { IVendorService } from '@/types'
import { UserRepository } from '@/repositories/user.repository.mock'
import { VendorRepository } from '@/repositories/vendor.repository.mock'
import { VendorService } from '@/services/vendor.service'

describe('VendorService', () => {
  let service: IVendorService

  beforeEach(() => {
    const db = {
      transaction: async (fn: (tx: unknown) => unknown) => {
        const tx = { rollback: () => undefined }
        return await fn(tx)
      },
    } as unknown as Database
    const userRepo = new UserRepository()
    const vendorRepo = new VendorRepository()
    service = new VendorService(db, userRepo, vendorRepo)
  })

  describe('VendorService.register', () => {
    it('should register a new vendor for a user without an existing vendor', async () => {
      const data = {
        ownerId: '1',
        name: 'New Vendor',
        description: 'Test vendor',
        imageUrl: null,
        website: undefined,
      }
      const result = await service.register(data)
      expect(result).toHaveProperty('id')
      expect(typeof result.id).toBe('string')
    })

    it('should throw CONFLICT if user already has a vendor', () => {
      const data = {
        ownerId: 'user-1',
        name: 'Duplicate Vendor',
        description: 'Test vendor',
        imageUrl: null,
        website: undefined,
      }
      expect(service.register(data)).rejects.toThrow(
        'You already has a registered vendor',
      )
    })
  })

  describe('VendorService.update', () => {
    it('should throw NOT_FOUND if vendor does not exist', () => {
      expect(
        service.update({ vendorId: 'not-exist', status: 'approved' }),
      ).rejects.toThrow('Vendor not found')
    })

    it('should throw BAD_REQUEST for invalid status transition', async () => {
      const data = {
        ownerId: 'user-3',
        name: 'Test Vendor',
        description: 'Test',
        imageUrl: null,
        website: 'https://test.com',
      }
      const { id } = await service.register(data)
      expect(
        service.update({ vendorId: id, status: 'suspended' }),
      ).rejects.toThrow('Invalid status transition')
    })
  })

  describe('VendorService.inviteMember', () => {
    it('should throw NOT_FOUND if vendor does not exist', () => {
      expect(
        service.inviteMember({
          vendorId: 'not-exist',
          email: 'alice@example.com',
        }),
      ).rejects.toThrow('Vendor not found')
    })

    it('should throw NOT_FOUND if user does not exist', async () => {
      const { id } = await service.register({
        ownerId: '1',
        name: 'Test Vendor',
        description: 'Test',
        website: 'https://test.com',
      })
      expect(
        service.inviteMember({
          vendorId: id,
          email: 'notfound@example.com',
        }),
      ).rejects.toThrow('User with the provided email not found')
    })

    it('should throw CONFLICT if user is already a member', async () => {
      const { id } = await service.register({
        ownerId: '1',
        name: 'Test Vendor',
        description: 'Test',
        website: 'https://test.com',
      })
      expect(
        service.inviteMember({
          vendorId: id,
          email: 'alice@example.com',
        }),
      ).rejects.toThrow('User is already a member of the vendor')
    })
  })
})
