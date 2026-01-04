import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { Database } from '@yukinu/db'
import type { wishlistItems } from '@yukinu/db/schema'
import type { UserSchema } from '@yukinu/validators/auth'
import type { WishlistItemSchema } from '@yukinu/validators/general'
import type {
  ProductImageSchema,
  ProductSchema,
} from '@yukinu/validators/product'

export interface IWishlistItemRepository extends IBaseRepository<
  typeof wishlistItems
> {
  allWithProduct(
    userId: UserSchema['id'],
    tx?: Database,
  ): Promise<
    (Pick<WishlistItemSchema, 'addedAt'> & {
      product: Pick<ProductSchema, 'id' | 'name' | 'price'> & {
        image: ProductImageSchema['url'] | null
      }
    })[]
  >
}
