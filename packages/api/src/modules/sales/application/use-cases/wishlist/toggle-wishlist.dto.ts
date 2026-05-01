import type { Database } from '@yukinu/db/drizzle'

import type { ToggleWishlistDto } from '@/modules/sales/application/dtos/wishlist/toggle-wishlist.dto'
import type { WishlistItemRepository } from '@/modules/sales/domain/repositories/wishlist-item.repository'

import { WishlistItemEntity } from '@/modules/sales/domain/entities/wishlist-item.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class ToggleWishlistUseCase extends AbstractUseCase<
  ToggleWishlistDto.Input,
  ToggleWishlistDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _wishlistItemRepo: WishlistItemRepository,
  ) {
    super()
  }

  public async execute(
    input: ToggleWishlistDto.Input,
  ): Promise<ToggleWishlistDto.Output> {
    const [wishlist] = await this._wishlistItemRepo.find(
      [input],
      {},
      { limit: 1 },
    )
    if (wishlist) {
      await this._wishlistItemRepo.delete([wishlist])
      return { added: false }
    }

    const newWishlistItem = new WishlistItemEntity(input)
    await this._wishlistItemRepo.save(newWishlistItem)
    return { added: true }
  }
}
