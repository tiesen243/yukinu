import type { ICategoryService } from '@/contracts/services/category.service'
import type { CategoryValidators } from '@yukinu/validators/category'

import { TRPCError } from '@trpc/server'
import { alias } from '@yukinu/db'

import { BaseService } from '@/services/base.service'

export class CategoryService extends BaseService implements ICategoryService {
  async all(
    input: CategoryValidators.AllInput,
  ): Promise<CategoryValidators.AllOutput> {
    const { and, asc, ilike, isNull } = this._orm
    const { categories } = this._schema
    const { search, istopLevelOnly, page, limit } = input
    const offset = (page - 1) * limit

    const whereClauses = []
    if (search) whereClauses.push(ilike(categories.name, `%${search}%`))
    if (istopLevelOnly) whereClauses.push(isNull(categories.parentId))
    const whereClause =
      whereClauses.length > 0 ? and(...whereClauses) : undefined

    const parent = alias(categories, 'parent')
    const [categoriesList, total] = await Promise.all([
      this._db
        .select({
          id: categories.id,
          name: categories.name,
          description: categories.description,
          image: categories.image,
          parent: { id: parent.id, name: parent.name },
        })
        .from(categories)
        .where(whereClause)
        .leftJoin(parent, this._orm.eq(categories.parentId, parent.id))
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

    const parent = alias(categories, 'parent')
    const [category] = await this._db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        image: categories.image,
        parent: {
          id: parent.id,
          name: parent.name,
        },
      })
      .from(categories)
      .where(eq(categories.id, id))
      .leftJoin(parent, eq(categories.parentId, parent.id))
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

    if (parentId && parentId !== 'no-parent') {
      let currentId = parentId
      const visited = new Set([parentId])
      while (currentId) {
        // oxlint-disable-next-line no-await-in-loop
        const parent = await this.one({ id: currentId })
        if (visited.has(parent.parent?.id ?? '')) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Circular parent-child relationship detected',
          })
        }
        if (parent.parent?.id) visited.add(parent.parent.id)
        currentId = parent.parent?.id ?? ''
      }
    }
    const [result] = await this._db
      .insert(categories)
      .values({ ...data, parentId: parentId === 'no-parent' ? null : parentId })
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
    if (
      parentId &&
      parentId !== category.parent?.id &&
      parentId !== 'no-parent'
    ) {
      let currentId = parentId
      const visited = new Set([parentId])
      while (currentId) {
        // oxlint-disable-next-line no-await-in-loop
        const parent = await this.one({ id: currentId })
        if (visited.has(parent.parent?.id ?? '') || parent.id === id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Circular parent-child relationship detected',
          })
        }
        if (parent.parent?.id) visited.add(parent.parent.id)
        currentId = parent.parent?.id ?? ''
      }
    }

    await this._db
      .update(categories)
      .set({
        name,
        description,
        ...(parentId !== undefined && {
          parentId: parentId === 'no-parent' ? null : parentId,
        }),
      })
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
