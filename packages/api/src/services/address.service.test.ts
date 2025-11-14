import { beforeEach, describe, expect, it } from 'bun:test'

import type { Database } from '@yukinu/db'

import type { IAddressService } from '@/types'
import { AddressRepository } from '@/repositories/address.repository.mock'
import { AddressService } from '@/services/address.service'

describe('AddressService', () => {
  let _service: IAddressService

  beforeEach(() => {
    const db = {
      transaction: async (fn: (tx: unknown) => unknown) => {
        const tx = { rollback: () => undefined }
        return await fn(tx)
      },
    } as unknown as Database
    const address = new AddressRepository()
    _service = new AddressService(db, address)
  })

  describe('all', () => {
    it('returns all addresses for a user', async () => {
      const result = await _service.all({ userId: 'user-1' })
      expect(result.addresses.length).toBe(2)
      expect(result.addresses.at(0)?.userId).toBe('user-1')
    })
    it('returns empty array for user with no addresses', async () => {
      const result = await _service.all({ userId: 'user-x' })
      expect(result.addresses.length).toBe(0)
    })
  })

  describe('create', () => {
    it('creates address if under limit', async () => {
      const input = {
        userId: 'user-2',
        recipientName: 'Alice',
        phoneNumber: '555-0000',
        street: '789 Oak St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '11111',
        country: 'USA',
      }
      const result = await _service.create(input)
      expect(result.addressId).toBeDefined()
    })
    it('sets isDefault true if first address', async () => {
      const input = {
        userId: 'user-3',
        recipientName: 'Bob',
        phoneNumber: '555-1111',
        street: '101 Pine St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '22222',
        country: 'USA',
      }
      const result = await _service.create(input)
      const addr = await _service.one({
        id: result.addressId,
        userId: 'user-3',
      })
      expect(addr.isDefault).toBe(true)
    })
    it('throws BAD_REQUEST if address count >= 5', async () => {
      for (let i = 0; i < 5; i++) {
        await _service.create({
          userId: 'user-4',
          recipientName: `User4-${i}`,
          phoneNumber: `555-000${i}`,
          street: `${i} Test St`,
          city: 'Springfield',
          state: 'IL',
          postalCode: `0000${i}`,
          country: 'USA',
        })
      }
      expect(
        _service.create({
          userId: 'user-4',
          recipientName: 'Overflow',
          phoneNumber: '555-9999',
          street: 'Overflow St',
          city: 'Springfield',
          state: 'IL',
          postalCode: '99999',
          country: 'USA',
        }),
      ).rejects.toThrow('You can have a maximum of 5 addresses.')
    })
  })

  describe('one', () => {
    it('returns address if found and belongs to user', async () => {
      const result = await _service.one({ id: 'address-1', userId: 'user-1' })
      expect(result.id).toBe('address-1')
    })
    it('throws NOT_FOUND if address does not exist', () => {
      expect(
        _service.one({ id: 'address-x', userId: 'user-1' }),
      ).rejects.toThrow('Address not found.')
    })
    it('throws NOT_FOUND if address does not belong to user', () => {
      expect(
        _service.one({ id: 'address-1', userId: 'user-x' }),
      ).rejects.toThrow("You don't have permission to access this address.")
    })
  })

  describe('update', () => {
    it('updates address if found and belongs to user', async () => {
      const result = await _service.update({
        id: 'address-1',
        userId: 'user-1',
        recipientName: 'Updated Name',
      })
      expect(result.addressId).toBe('address-1')
      const addr = await _service.one({ id: 'address-1', userId: 'user-1' })
      expect(addr.recipientName).toBe('Updated Name')
    })
    it('throws NOT_FOUND if address does not belong to user', () => {
      expect(
        _service.update({
          id: 'address-1',
          userId: 'user-x',
          recipientName: 'Should Fail',
        }),
      ).rejects.toThrow("You don't have permission to update this address.")
    })
    it('sets isDefault and unsets others if isDefault is true', async () => {
      await _service.update({
        id: 'address-2',
        userId: 'user-1',
        isDefault: true,
      })
      const addr1 = await _service.one({ id: 'address-1', userId: 'user-1' })
      const addr2 = await _service.one({ id: 'address-2', userId: 'user-1' })
      expect(addr1.isDefault).toBe(false)
      expect(addr2.isDefault).toBe(true)
    })
  })

  describe('delete', () => {
    it('deletes address if found and belongs to user', async () => {
      const result = await _service.delete({
        id: 'address-2',
        userId: 'user-1',
      })
      expect(result.addressId).toBe('address-2')
      const addr = await _service
        .one({ id: 'address-2', userId: 'user-1' })
        .catch(() => null)
      expect(addr).toBeNull()
    })
    it('throws NOT_FOUND if address does not belong to user', () => {
      expect(
        _service.delete({ id: 'address-1', userId: 'user-x' }),
      ).rejects.toThrow("You don't have permission to delete this address.")
    })
    it('throws BAD_REQUEST if trying to delete default address and more than one exists', () => {
      expect(
        _service.delete({ id: 'address-1', userId: 'user-1' }),
      ).rejects.toThrow(
        'Cannot delete the default address. Please set another address as default before deleting.',
      )
    })
    it('allows deleting default address if it is the only one', async () => {
      await _service.delete({ id: 'address-2', userId: 'user-1' })
      const result = await _service.delete({
        id: 'address-1',
        userId: 'user-1',
      })
      expect(result.addressId).toBe('address-1')
    })
  })
})
