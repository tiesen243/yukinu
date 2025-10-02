import { expect, test } from 'bun:test'

import { createId } from './utils'

test('createId returns unique values', () => {
  const ids = new Set<string>()
  for (let i = 0; i < 1000; i++) ids.add(createId())
  expect(ids.size).toEqual(1000)
})

test('createId starts with a lowercase letter', () => {
  const id = createId()
  expect(id[0]).toMatch(/[a-z]/)
})

test('createId only contains lowercase letters and digits', () => {
  const id = createId()
  expect(id).toMatch(/^[a-z][a-z0-9]+$/)
})
