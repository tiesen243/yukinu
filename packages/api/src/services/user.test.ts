import { TRPCError } from '@trpc/server'
import { beforeEach, describe, expect, it, jest, mock } from 'bun:test'

import { UserService } from './user'

const mockTransaction = jest.fn()
const mockSelect = jest.fn()
const mockInsert = jest.fn()
const mockDb = {
  transaction: mockTransaction,
  select: mockSelect,
  insert: mockInsert,
}

mock(() => ({
  Password: jest.fn().mockImplementation(() => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
  })),
}))

describe('UserService', () => {
  let service: UserService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new UserService(mockDb as never)
  })

  describe('register', () => {
    it('registers a new user successfully', async () => {
      mockTransaction.mockImplementation(
        async (cb: (tx: unknown) => Promise<unknown>) => {
          return cb({
            select: () => ({ from: () => ({ where: () => [] }) }),
            insert: () => ({
              values: () => ({ returning: () => [{ id: 'user-id' }] }),
            }),
          })
        },
      )

      const result = await service.register({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        confirmPassword: 'password',
      })
      expect(result).toEqual({ id: 'user-id' })
    })

    it('throws conflict if user exists', () => {
      mockTransaction.mockImplementation(
        async (cb: (tx: unknown) => Promise<unknown>) => {
          return cb({
            select: () => ({
              from: () => ({
                where: () => [{ id: 'existing-id' }],
              }),
            }),
          })
        },
      )

      expect(
        service.register({
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
        }),
      ).rejects.toThrow(TRPCError)
    })
  })

  describe('getProfile', () => {
    it('returns profile if found', async () => {
      const mockProfile = {
        id: 'id1',
        userId: 'user-id',
        fullName: 'Test User',
        avatarUrl: null,
        bio: null,
        gender: null,
        dateOfBirth: null,
        website: null,
      }

      mockDb.select.mockReturnValue({
        from: () => ({ where: () => ({ limit: () => [mockProfile] }) }),
      })

      const result = await service.getProfile('user-id')
      expect(result).toEqual(mockProfile)
    })

    it('throws not found if profile missing', () => {
      mockDb.select.mockReturnValue({
        from: () => ({ where: () => ({ limit: () => [] }) }),
      })

      expect(service.getProfile('missing')).rejects.toThrow(TRPCError)
    })
  })
})
