import type { Database } from '@yukinu/db/drizzle'

import { wishlistItems } from '@yukinu/db/schema'

import type { WishlistItemRepository } from '@/modules/sales/domain/repositories/wishlist-item.repository'

import { WishlistItemEntity } from '@/modules/sales/domain/entities/wishlist-item.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleWishlistItemRepository
  extends DrizzleRepository<WishlistItemEntity, typeof wishlistItems>
  implements WishlistItemRepository
{
  public constructor(db: Database) {
    super(db, wishlistItems, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof wishlistItems>,
  ): WishlistItemEntity {
    return new WishlistItemEntity(row)
  }
}
