import type { IWishlistItemRepository } from '@/contracts/repositories/wishlist-item.repository'
import type { IWishlistService } from '@/contracts/services/wishlist.service'
import type { Database } from '@yukinu/db'
import type * as Validators from '@yukinu/validators/general'

export class WishlistService implements IWishlistService {
  constructor(
    private readonly _db: Database,
    private readonly _wishlistItem: IWishlistItemRepository,
  ) {}

  get(
    input: Validators.AllWishlistItemsInput,
  ): Promise<Validators.AllWishlistItemsOutput> {
    return this._wishlistItem.allWithProduct(input.userId)
  }

  toggleItem(
    input: Validators.ToggleWishlistItemInput,
  ): Promise<Validators.ToggleWishlistItemOutput> {
    return this._db.transaction(async (tx) => {
      const [existingItem] = await this._wishlistItem.all(
        [input],
        {},
        { limit: 1 },
        tx,
      )

      if (existingItem) {
        await this._wishlistItem.delete(existingItem.id, tx)
        return { added: false }
      }

      await this._wishlistItem.create(input, tx)
      return { added: true }
    })
  }
}
