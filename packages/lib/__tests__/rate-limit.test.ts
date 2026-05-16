import { describe, expect, it } from 'bun:test'

import { TokenBucketRateLimit } from '@/rate-limit'

describe('TokenBucketRateLimit', () => {
  it('should allow requests within the rate limit', () => {
    const rateLimit = new TokenBucketRateLimit(5, 1000)
    for (let i = 0; i < 5; i += 1)
      expect(rateLimit.consume('user1', 1)).toBe(true)
  })

  it('should reject requests that exceed the rate limit', () => {
    const rateLimit = new TokenBucketRateLimit(5, 1000)
    for (let i = 0; i < 5; i += 1)
      expect(rateLimit.consume('user1', 1)).toBe(true)
    expect(rateLimit.consume('user1', 1)).toBe(false)
  })

  it('should handle multiple keys independently', () => {
    const rateLimit = new TokenBucketRateLimit(5, 1000)

    for (let i = 0; i < 5; i += 1) {
      expect(rateLimit.consume('user1', 1)).toBe(true)
      expect(rateLimit.consume('user2', 1)).toBe(true)
    }

    expect(rateLimit.consume('user1', 1)).toBe(false)
    expect(rateLimit.consume('user2', 1)).toBe(false)
  })
})
