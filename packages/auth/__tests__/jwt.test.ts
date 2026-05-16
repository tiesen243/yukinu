import { beforeEach, describe, expect, it } from 'bun:test'

import { JWT } from '@/core/jwt'

describe('JWT', () => {
  let jwt: JWT<Record<string, unknown>>

  beforeEach(() => {
    const secret = 'my-secret-key'
    jwt = new JWT(secret)
  })

  it('should sign and verify a token', async () => {
    const payload = { userId: 123 }
    const token = await jwt.sign(payload, { expiresIn: 1 * 60 })
    expect(typeof token).toBe('string')

    const decoded = await jwt.verify(token)
    expect(decoded).toMatchObject(payload)
  })

  it('should return null for an invalid token', () => {
    const invalidToken = 'invalid.token.here'
    expect(jwt.verify(invalidToken)).rejects.toThrow('Invalid token signature')
  })

  it('should return null for an expired token', async () => {
    const payload = { userId: 123 }
    const token = await jwt.sign(payload, { expiresIn: -1 }) // Expired token
    expect(jwt.verify(token)).rejects.toThrow('Token has expired')
  })
})
