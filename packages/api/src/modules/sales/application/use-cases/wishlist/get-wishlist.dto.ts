import type { Database } from '@yukinu/db/drizzle'

import type { GetWishlistDto } from '@/modules/sales/application/dtos/wishlist/get-wishlist.dto'
import type { WishlistItemRepository } from '@/modules/sales/domain/repositories/wishlist-item.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class GetWishlistUseCase extends AbstractUseCase<
  GetWishlistDto.Input,
  GetWishlistDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _wishlistItemRepo: WishlistItemRepository,
  ) {
    super()
  }

  public execute(input: GetWishlistDto.Input): Promise<GetWishlistDto.Output> {
    return this._wishlistItemRepo.findWithProduct([input], { addedAt: 'desc' })
  }
}
