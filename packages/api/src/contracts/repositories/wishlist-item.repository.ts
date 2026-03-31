import type { Database } from '@yukinu/db'
import type { wishlistItems } from '@yukinu/db/schema'
import type { UserSchema } from '@yukinu/validators/auth'
import type {
  ProductImageSchema,
  ProductSchema,
  WishlistItemSchema,
} from '@yukinu/validators/product'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface IWishlistItemRepository extends IBaseRepository<
  typeof wishlistItems
> {
  allWithProduct(
    userId: UserSchema['id'],
    tx?: Database,
  ): Promise<IWishlistItemRepository.WishlistItemWithProduct[]>
}

export namespace IWishlistItemRepository {
  export type WishlistItemWithProduct = Pick<WishlistItemSchema, 'addedAt'> & {
    product: Pick<ProductSchema, 'id' | 'name' | 'price'> & {
      image: ProductImageSchema['url'] | null
    }
  }
}
