import { beforeEach, describe, expect, it } from 'bun:test'

import { Password } from '@/core/password'

describe('Password', () => {
  let password: Password

  beforeEach(() => {
    password = new Password()
  })

  it('should hash and verify a password', async () => {
    const plainPassword = 'my-secure-password'
    const hash = await password.hash(plainPassword)

    expect(typeof hash).toBe('string')
    expect(hash.split(':').length).toBe(2)

    const isValid = await password.verify(hash, plainPassword)
    expect(isValid).toBe(true)
  })

  it('should fail verification for an incorrect password', async () => {
    const plainPassword = 'my-secure-password'
    const hash = await password.hash(plainPassword)

    const isValid = await password.verify(hash, 'wrong-password')
    expect(isValid).toBe(false)
  })

  it('should fail verification for an invalid hash format', async () => {
    const isValid = await password.verify('invalid-hash-format', 'password')
    expect(isValid).toBe(false)
  })
})
