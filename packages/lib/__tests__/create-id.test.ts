import { describe, expect, it } from 'bun:test'
import { cuid2 } from 'zod'

import { createId } from '@/create-id'

describe('createId', () => {
  it('should create IDs that validate against the CUID2 regex', () => {
    const id = createId()
    expect(cuid2().safeParse(id).success).toBe(true)
  })

  it('should create a unique ID', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 1000; i += 1) ids.add(createId())
    expect(ids.size).toBe(1000)
  })
})
