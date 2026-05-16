import type { Database } from '@yukinu/db/drizzle'

import type { AllCategoriesDto } from '@/modules/catalog/application/dtos/category/all-categories.dto'
import type { CategoryRepository } from '@/modules/catalog/domain/repositories/category.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class AllCategoriesUseCase extends AbstractUseCase<
  AllCategoriesDto.Input,
  AllCategoriesDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _categoryRepo: CategoryRepository,
  ) {
    super()
  }

  async execute(
    input: AllCategoriesDto.Input,
  ): Promise<AllCategoriesDto.Output> {
    const { search, isTopLevelOnly, page, limit } = input
    const offset = (page - 1) * limit
    const whereClauses = [
      {
        ...(search ? { name: { $like: `%${search}%` } } : {}),
        ...(isTopLevelOnly ? { parentId: 'null' } : {}),
      },
    ]

    const [categories, total] = await Promise.all([
      this._categoryRepo.findWithParent(
        whereClauses,
        { name: 'asc' },
        { limit, offset },
      ),
      this._categoryRepo.count(whereClauses),
    ])
    const totalPages = Math.ceil(total / limit)

    return {
      categories,
      pagination: { total, page, limit, totalPages },
    }
  }
}
