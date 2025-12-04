import { TRPCError } from '@trpc/server'

import type { CategoryValidators } from '@yukinu/validators/category'

import type { ICategoryService } from '@/contracts/services/category.service'
import { BaseService } from '@/services/base.service'

export class CategoryService extends BaseService implements ICategoryService {
  async all(
    input: CategoryValidators.AllInput,
  ): Promise<CategoryValidators.AllOutput> {
    const { asc, ilike } = this._orm
    const { categories } = this._schema
    const { search, page, limit } = input
    const offset = (page - 1) * limit

    const whereClause = search
      ? ilike(categories.name, `%${search}%`)
      : undefined

    const [categoriesList, total] = await Promise.all([
      this._db
        .select()
        .from(categories)
        .where(whereClause)
        .offset(offset)
        .limit(limit)
        .orderBy(asc(categories.name)),
      this._db.$count(categories, whereClause),
    ])
    const totalPages = Math.ceil(total / limit)

    return {
      categories: categoriesList,
      pagination: { total, page, limit, totalPages },
    }
  }

  async one(
    input: CategoryValidators.OneInput,
  ): Promise<CategoryValidators.OneOutput> {
    const { eq } = this._orm
    const { categories } = this._schema
    const { id } = input

    const [category] = await this._db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1)

    if (!category)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' })

    return category
  }

  async create(
    input: CategoryValidators.CreateInput,
  ): Promise<CategoryValidators.CreateOutput> {
    const { categories } = this._schema
    const { parentId, ...data } = input

    if (parentId) {
      let currentId: string | null = parentId
      const visited = new Set([input.parentId])
      while (currentId) {
        const parent = await this.one({ id: currentId })
        if (visited.has(parent.parentId ?? undefined)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Circular parent-child relationship detected',
          })
        }
        if (parent.parentId) visited.add(parent.parentId)
        currentId = parent.parentId
      }
    }
    const [result] = await this._db
      .insert(categories)
      .values({ ...data, parentId: parentId ?? null })
      .returning({ id: categories.id })

    if (!result?.id)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create category',
      })

    return result
  }

  async update(
    input: CategoryValidators.UpdateInput,
  ): Promise<CategoryValidators.UpdateOutput> {
    const { eq } = this._orm
    const { categories } = this._schema
    const { id, name, description, parentId } = input

    const category = await this.one({ id })
    if (parentId !== category.parentId) {
      let currentId: string | null = parentId ?? null
      const visited = new Set([input.parentId])
      while (currentId) {
        const parent = await this.one({ id: currentId })
        if (visited.has(parent.parentId ?? undefined) || parent.id === id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Circular parent-child relationship detected',
          })
        }
        if (parent.parentId) visited.add(parent.parentId)
        currentId = parent.parentId
      }
    }

    await this._db
      .update(categories)
      .set({ name, description })
      .where(eq(categories.id, id))

    return { id }
  }

  async delete(
    input: CategoryValidators.DeleteInput,
  ): Promise<CategoryValidators.DeleteOutput> {
    const { eq } = this._orm
    const { categories } = this._schema
    const { id } = input

    await this.one({ id })

    await this._db.delete(categories).where(eq(categories.id, id))

    return { id }
  }
}
