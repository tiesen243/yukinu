import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { CreateReviewDto } from '@/modules/catalog/application/dtos/product/create-review.dto'
import type { ProductReviewRepository } from '@/modules/catalog/domain/repositories/product-review.repository'
import type { ProductRepository } from '@/modules/catalog/domain/repositories/product.repository'

import { ProductReviewEntity } from '@/modules/catalog/domain/entities/product-review.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class CreateReviewUseCase extends AbstractUseCase<
  CreateReviewDto.Input & { userId: string },
  CreateReviewDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _productReviewRepo: ProductReviewRepository,
    private readonly _productRepo: ProductRepository,
  ) {
    super()
  }

  public async execute(
    input: CreateReviewDto.Input & { userId: string },
  ): Promise<CreateReviewDto.Output> {
    const [product] = await this._productRepo.find(
      [{ id: input.productId }],
      {},
      { limit: 1 },
    )
    if (!product)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with ID ${input.productId} not found`,
      })

    const newReview = new ProductReviewEntity({
      productId: input.productId,
      userId: input.userId,
      rating: input.rating,
      comment: input.comment,
    })
    await this._productReviewRepo.save(newReview)
  }
}
