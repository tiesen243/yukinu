import { describe, expect, it } from 'bun:test'

import {
  constantTimeEqual,
  decodeBase64Url,
  decodeHex,
  encodeBase64Url,
  encodeHex,
  generateCodeChallenge,
  generateSecureString,
  generateStateOrCode,
  hashSecret,
} from '@/core/crypto'

describe('crypto', () => {
  describe('constantTimeEqual', () => {
    it('should return true for equal buffers', () => {
      const a = new Uint8Array([1, 2, 3])
      const b = new Uint8Array([1, 2, 3])
      expect(constantTimeEqual(a, b)).toBe(true)
    })

    it('should return false for different buffers', () => {
      const a = new Uint8Array([1, 2, 3])
      const b = new Uint8Array([1, 2, 4])
      expect(constantTimeEqual(a, b)).toBe(false)
    })

    it('should return false for buffers of different lengths', () => {
      const a = new Uint8Array([1, 2, 3])
      const b = new Uint8Array([1, 2])
      expect(constantTimeEqual(a, b)).toBe(false)
    })
  })

  describe('encodeBase64Url and decodeBase64Url', () => {
    it('should encode and decode correctly', () => {
      const original = new Uint8Array([1, 2, 3, 4, 5])
      const encoded = encodeBase64Url(original)
      const decoded = decodeBase64Url(encoded)
      expect(decoded).toEqual(original)
    })
  })

  describe('encodeHex and decodeHex', () => {
    it('should encode and decode correctly', () => {
      const original = new Uint8Array([1, 2, 3, 4, 5])
      const encoded = encodeHex(original)
      const decoded = decodeHex(encoded)
      expect(decoded).toEqual(original)
    })
  })

  describe('generateCodeChallenge', () => {
    it('should generate a valid code challenge', async () => {
      const codeVerifier = 'test-code-verifier'
      const codeChallenge = await generateCodeChallenge(codeVerifier)
      expect(typeof codeChallenge).toBe('string')
      expect(codeChallenge.length).toBeGreaterThan(0)
    })
  })

  describe('generateSecureString', () => {
    it('should generate a secure string of the correct length', () => {
      const secureString = generateSecureString()
      expect(typeof secureString).toBe('string')
      expect(secureString.length).toBe(24)
    })
  })

  describe('generateStateOrCode', () => {
    it('should generate a state or code string of the correct length', () => {
      const stateOrCode = generateStateOrCode()
      expect(typeof stateOrCode).toBe('string')
      expect(stateOrCode.length).toBe(43)
    })
  })

  describe('hashSecret', () => {
    it('should hash a secret and return a string', async () => {
      const secret = 'my-secret'
      const hash = await hashSecret(secret)
      expect(hash).toBeInstanceOf(Uint8Array)
      expect(hash.length).toBeGreaterThan(0)
    })

    it('should produce different hashes for different secrets', async () => {
      const secret1 = 'secret-1'
      const secret2 = 'secret-2'
      const hash1 = await hashSecret(secret1)
      const hash2 = await hashSecret(secret2)
      expect(constantTimeEqual(hash1, hash2)).toBe(false)
    })

    it('should produce the same hash for the same secret', async () => {
      const secret = 'consistent secret value'
      const hash1 = await hashSecret(secret)
      const hash2 = await hashSecret(secret)
      expect(constantTimeEqual(hash1, hash2)).toBe(true)
    })
  })
})
