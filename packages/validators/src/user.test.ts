import { describe, expect, it } from 'bun:test'

import { UserModel } from './user'

describe('UserModel.registerBody', () => {
  const schema = UserModel.registerBody

  it('accepts valid password', () => {
    const result = schema.safeParse({
      email: 'test@example.com',
      username: 'testuser',
      password: 'Abcdef1!',
      confirmPassword: 'Abcdef1!',
    })
    expect(result.success).toBe(true)
  })

  it('rejects password shorter than 8 chars', () => {
    const result = schema.safeParse({
      email: 'test@example.com',
      username: 'testuser',
      password: 'Ab1!',
    })
    expect(result.success).toBe(false)
  })

  it('rejects password without number', () => {
    const result = schema.safeParse({
      email: 'test@example.com',
      username: 'testuser',
      password: 'Abcdefgh!',
    })
    expect(result.success).toBe(false)
  })

  it('rejects password without uppercase', () => {
    const result = schema.safeParse({
      email: 'test@example.com',
      username: 'testuser',
      password: 'abcdef1!',
    })
    expect(result.success).toBe(false)
  })

  it('rejects password without lowercase', () => {
    const result = schema.safeParse({
      email: 'test@example.com',
      username: 'testuser',
      password: 'ABCDEF1!',
    })
    expect(result.success).toBe(false)
  })

  it('rejects password without special character', () => {
    const result = schema.safeParse({
      email: 'test@example.com',
      username: 'testuser',
      password: 'Abcdef12',
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-matching confirmPassword', () => {
    const result = schema.safeParse({
      email: 'test@example.com',
      username: 'testuser',
      password: 'Abcdef1!',
      confirmPassword: 'Different1!',
    })
    expect(result.success).toBe(false)
  })
})

describe('UserModel.loginBody', () => {
  it('accepts valid email and password', () => {
    const data = {
      identifier: 'test@example.com',
      password: 'Password#123',
    }
    const result = UserModel.loginBody.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('accepts valid username and password', () => {
    const data = {
      identifier: 'validuser',
      password: 'Password#123',
    }
    const result = UserModel.loginBody.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('rejects short username', () => {
    const data = {
      identifier: 'abc',
      password: 'password123',
    }
    const result = UserModel.loginBody.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const data = {
      identifier: 'test@example.com',
      password: 'short',
    }
    const result = UserModel.loginBody.safeParse(data)
    expect(result.success).toBe(false)
  })
})
