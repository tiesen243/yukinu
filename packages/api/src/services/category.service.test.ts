import { beforeEach, describe, expect, it } from 'bun:test'

import type { Database } from '@yukinu/db'

import type { ICategoryService } from '@/contracts/services/category.service'
import { CategoryRepository } from '@/repositories/category.repository.mock'
import { CategoryService } from '@/services/category.service'

describe('CategoryService', () => {
  let _service: ICategoryService

  beforeEach(() => {
    const db = {
      transaction: async (fn: (tx: unknown) => unknown) => {
        const tx = { rollback: () => undefined }
        return await fn(tx)
      },
    } as unknown as Database
    const category = new CategoryRepository()
    _service = new CategoryService(db, category)
  })

  describe('all', () => {
    it('returns paginated categories', async () => {
      const result = await _service.all({ page: 1, limit: 2 })
      expect(result.categories.length).toBe(2)
      expect(result.pagination.totalItems).toBe(4)
      expect(result.pagination.totalPages).toBe(2)
    })
  })

  describe('one', () => {
    it('returns a category by id', async () => {
      const result = await _service.one({ id: 'category-1' })
      expect(result).toMatchObject({ id: 'category-1', name: 'Category 1' })
    })
    it('throws NOT_FOUND if category does not exist', () => {
      expect(_service.one({ id: 'not-exist' })).rejects.toThrow(
        'Category not found',
      )
    })
  })

  describe('create', () => {
    it('creates a new category', async () => {
      const result = await _service.create({ name: 'New Category' })
      expect(result.categoryId).toBeDefined()
    })
    it('throws CONFLICT if name exists', () => {
      expect(_service.create({ name: 'Category 1' })).rejects.toThrow(
        'Category with the same name already exists',
      )
    })
  })

  describe('update', () => {
    it('updates an existing category', async () => {
      const result = await _service.update({
        id: 'category-1',
        name: 'Updated Name',
      })
      expect(result.categoryId).toBe('category-1')
    })
    it('throws NOT_FOUND if category does not exist', () => {
      expect(
        _service.update({ id: 'not-exist', name: 'Name' }),
      ).rejects.toThrow('Category not found')
    })
    it('throws CONFLICT if name exists on another category', () => {
      expect(
        _service.update({ id: 'category-1', name: 'Category 2' }),
      ).rejects.toThrow('Category with the same name already exists')
    })
  })

  describe('delete', () => {
    it('deletes an existing category', async () => {
      const result = await _service.delete({ id: 'category-1' })
      expect(result.categoryId).toBe('category-1')
    })
    it('throws NOT_FOUND if category does not exist', () => {
      expect(_service.delete({ id: 'not-exist' })).rejects.toThrow(
        'Category not found',
      )
    })
  })
})
