import { describe, expect, it } from 'bun:test'

import { slugify, formatDate, formatPrice } from '@/utils'

describe('utils', () => {
  describe('slugify', () => {
    it('should convert a string to a slug', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('should handle special characters', () => {
      expect(slugify('Café & Restaurant')).toBe('cafe-restaurant')
    })

    it('should handle multiple spaces', () => {
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
    })

    it('should handle empty strings', () => {
      expect(slugify('')).toBe('')
    })
  })

  describe('formatDate', () => {
    it('should format a date string', () => {
      expect(formatDate('2024-01-01')).toBe('January 1, 2024')
    })

    it('should format a Date object', () => {
      expect(formatDate(new Date('2024-01-01'))).toBe('January 1, 2024')
    })
  })

  describe('formatPrice', () => {
    it('should format a number as currency', () => {
      expect(formatPrice(1234.56)).toBe('$1,234.56')
    })

    it('should format a string as currency', () => {
      expect(formatPrice('1234.56')).toBe('$1,234.56')
    })
  })
})
