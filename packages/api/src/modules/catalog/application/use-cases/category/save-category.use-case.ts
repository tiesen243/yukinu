import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { SaveCategoryDto } from '@/modules/catalog/application/dtos/category/save-category.dto'
import type { CategoryRepository } from '@/modules/catalog/domain/repositories/category.repository'

import { CategoryEntity } from '@/modules/catalog/domain/entities/category.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class SaveCategoryUseCase extends AbstractUseCase<
  SaveCategoryDto.Input,
  SaveCategoryDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _categoryRepo: CategoryRepository,
  ) {
    super()
  }
  async execute(input: SaveCategoryDto.Input): Promise<SaveCategoryDto.Output> {
    if (input.parentId)
      await this._checkCircularHierarchy(
        input.parentId,
        new Set([input.parentId]),
      )

    const category = new CategoryEntity(input)
    await this._categoryRepo.save(category)

    return { id: category.id }
  }

  private async _checkCircularHierarchy(
    currentId: string,
    visited: Set<string>,
  ) {
    if (!currentId) return
    const [parent] = await this._categoryRepo.findWithParent(
      [{ id: currentId }],
      {},
      { limit: 1 },
    )
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
