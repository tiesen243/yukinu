import { describe, expect, it } from 'bun:test'

import { db } from '@/index'

describe('db', () => {
  it('should be defined', () => {
    expect(db).toBeDefined()
  })
})
