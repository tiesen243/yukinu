import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { OneProductDto } from '@/modules/catalog/application/dtos/product/one-product.dto'
import type { ProductRepository } from '@/modules/catalog/domain/repositories/product.repository'
import type { WishlistItemRepository } from '@/modules/sales/domain/repositories/wishlist-item.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class OneProductUseCase extends AbstractUseCase<
  OneProductDto.Input,
  OneProductDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _productRepo: ProductRepository,
    private readonly _wishlistItemRepo: WishlistItemRepository,
  ) {
    super()
  }

  public async execute(
    input: OneProductDto.Input & { userId?: string },
  ): Promise<OneProductDto.Output> {
    const [product, wishlistItem] = await Promise.allSettled([
      this._productRepo.findWithDetails(input.id),
      input.userId
        ? this._wishlistItemRepo.find(
            [{ productId: input.id, userId: input.userId }],
            {},
            { limit: 1 },
          )
        : Promise.resolve([]),
    ])

    if (
      product.status === 'rejected' ||
      wishlistItem.status === 'rejected' ||
      !product.value
    )
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch product details',
      })

    return {
      ...product.value,
      isWishlisted: wishlistItem.value.length > 0,
    }
  }
}
