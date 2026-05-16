import { describe, expect, it } from 'bun:test'

import { transformer } from '@/transformer'

describe('transformer', () => {
  it('should serialize and deserialize complex objects', () => {
    const obj = {
      name: 'Alice',
      age: 30,
      birthday: new Date('1990-01-01'),
      regex: /hello/gi,
      url: new URL('https://example.com'),
      error: new Error('Something went wrong'),
      set: new Set([1, 2, 3]),
      map: new Map([['key', 'value']]),
      bigInt: BigInt(12_345_678_901_234_567_890n),
    }

    const serialized = transformer.serialize(obj)
    const deserialized = transformer.deserialize(serialized)

    expect(deserialized).toEqual(obj)
  })

  it('should return non-object values unchanged', () => {
    expect(transformer.deserialize(42)).toBe(42)
    expect(transformer.deserialize('hello')).toBe('hello')
    expect(transformer.deserialize(null)).toBe(null)
  })

  it('should handle nested objects', () => {
    const nestedData = {
      user: {
        name: 'Bob',
        profile: {
          birthday: new Date('1985-05-15'),
          website: new URL('https://bob.com'),
          addresses: [
            {
              city: 'New York',
              regex: /NY/gi,
            },
            {
              city: 'Los Angeles',
              regex: /LA/gi,
            },
          ],
        },
      },
    }

    const serialized = transformer.serialize(nestedData)
    const deserialized = transformer.deserialize(serialized)

    expect(deserialized).toEqual(nestedData)
  })
})
