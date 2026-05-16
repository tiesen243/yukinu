import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { OneCategoryDto } from '@/modules/catalog/application/dtos/category/one-category.dto'
import type { CategoryRepository } from '@/modules/catalog/domain/repositories/category.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class OneCategoryUseCase extends AbstractUseCase<
  OneCategoryDto.Input,
  OneCategoryDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _categoryRepo: CategoryRepository,
  ) {
    super()
  }
  async execute(input: OneCategoryDto.Input): Promise<OneCategoryDto.Output> {
    const [category] = await this._categoryRepo.findWithParent(
      [{ id: input.id }],
      {},
      { limit: 1 },
    )
    if (!category)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' })

    return category
  }
}
