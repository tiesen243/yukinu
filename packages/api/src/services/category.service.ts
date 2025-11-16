import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db'
import type { CategoryModels } from '@yukinu/validators/category'

import type { ICategoryService } from '@/contracts/services/category.service'
import type { ICategoryRepository } from '@/types'

export class CategoryService implements ICategoryService {
  constructor(
    private readonly _db: Database,
    private readonly _category: ICategoryRepository,
  ) {}

  async all(input: CategoryModels.AllInput): Promise<CategoryModels.AllOutput> {
    const { page, limit } = input
    const offset = (page - 1) * limit

    const categories = await this._category.findBy(
      [],
      { name: 'asc' },
      limit,
      offset,
    )

    const totalItems = await this._category.count([])
    const totalPages = Math.ceil(totalItems / limit)

    return {
      categories,
      pagination: { page, totalPages, totalItems },
    }
  }

  async one(input: CategoryModels.OneInput): Promise<CategoryModels.OneOutput> {
    const { id } = input

    const category = await this._category.find(id)
    if (!category)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' })
    return category
  }

  async create(
    input: CategoryModels.CreateInput,
  ): Promise<CategoryModels.CreateOutput> {
    const { name } = input

    const [category] = await this._category.findBy([{ name }], {}, 1)
    if (category)
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Category with the same name already exists',
      })

    const { id } = await this._category.create({ name })
    return { categoryId: id }
  }

  async update(
    input: CategoryModels.UpdateInput,
  ): Promise<CategoryModels.UpdateOutput> {
    const { id, name } = input

    const category = await this._category.find(id)
    if (!category)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' })

    const [existingCategory] = await this._category.findBy([{ name }], {}, 1)
    if (existingCategory && existingCategory.id !== id)
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Category with the same name already exists',
      })

    await this._category.update(id, { name })

    return { categoryId: id }
  }

  async delete(
    input: CategoryModels.DeleteInput,
  ): Promise<CategoryModels.DeleteOutput> {
    const { id } = input

    const category = await this._category.find(id)
    if (!category)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' })

    await this._category.delete(id)

    return { categoryId: id }
  }
}
