import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'
import { utapi } from '@yukinu/uploadthing'

import type { DeleteCategoryDto } from '@/modules/catalog/application/dtos/category/delete-category.dto'
import type { CategoryRepository } from '@/modules/catalog/domain/repositories/category.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class DeleteCategoryUseCase extends AbstractUseCase<
  DeleteCategoryDto.Input,
  DeleteCategoryDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _categoryRepo: CategoryRepository,
  ) {
    super()
  }

  async execute(
    input: DeleteCategoryDto.Input,
  ): Promise<DeleteCategoryDto.Output> {
    const [target] = await this._categoryRepo.find(
      [{ id: input.id }],
      {},
      { limit: 1 },
    )
    if (!target)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' })

    await this._categoryRepo.delete([{ id: input.id }])
    if (target.image)
      await utapi.deleteFiles(target.image?.split('/').pop() ?? '')

    return { id: input.id }
  }
}
