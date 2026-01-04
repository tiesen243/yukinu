import type { ICategoryRepository } from '@/contracts/repositories/category.repository'
import type { ICategoryService } from '@/contracts/services/category.service'
import type { Database } from '@yukinu/db'
import type * as Validators from '@yukinu/validators/general'

import { TRPCError } from '@trpc/server'
import { utapi } from '@yukinu/uploadthing'

export class CategoryService implements ICategoryService {
  constructor(
    private readonly _db: Database,
    private readonly _category: ICategoryRepository,
  ) {}

  async all(
    input: Validators.AllCategoriesInput,
  ): Promise<Validators.AllCategoriesOutput> {
    const { search, isTopLevelOnly, page, limit } = input
    const offset = (page - 1) * limit

    const whereClauses = [
      { name: `%${search}%`, ...(isTopLevelOnly && { parentId: 'null' }) },
    ]

    const [categories, total] = await Promise.all([
      this._category.allWithParent(
        whereClauses,
        { name: 'asc' },
        { limit, offset },
      ),
      this._category.count(whereClauses),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      categories,
      pagination: { total, page, limit, totalPages },
    }
  }

  async one(
    input: Validators.OneCategoryInput,
  ): Promise<Validators.OneCategoryOutput> {
    const { id } = input

    const category = await this._category.findWithParent(id)
    if (!category)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' })

    return category
  }

  async create(
    input: Validators.CreateCategoryInput,
  ): Promise<Validators.CreateCategoryOutput> {
    const { parentId } = input

    if (parentId)
      await this._checkCircularHierarchy(parentId, new Set([parentId]))

    const id = await this._category.create(input)
    return { id }
  }

  async update(
    input: Validators.UpdateCategoryInput,
  ): Promise<Validators.UpdateCategoryOutput> {
    const { id, parentId, ...data } = input

    const target = await this._category.find(id)
    if (!target)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' })

    if (parentId && parentId !== target.parentId)
      await this._checkCircularHierarchy(parentId, new Set([id, parentId]))

    await this._category.update(id, { ...data, parentId })

    return { id }
  }

  async delete(
    input: Validators.DeleteCategoryInput,
  ): Promise<Validators.DeleteCategoryOutput> {
    const target = await this._category.find(input.id)
    if (!target)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' })

    await this._category.delete(input.id)
    await utapi.deleteFiles(target.image?.split('/').pop() ?? '')

    return input
  }

  private async _checkCircularHierarchy(
    currentId: string,
    visited: Set<string>,
  ) {
    if (!currentId) return
    const parent = await this._category.findWithParent(currentId)
    const parentIdToCheck = parent?.parent?.id ?? ''

    if (visited.has(parentIdToCheck))
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Circular category hierarchy detected',
      })

    if (parentIdToCheck) {
      visited.add(parentIdToCheck)
      await this._checkCircularHierarchy(parentIdToCheck, visited)
    }
  }
}
