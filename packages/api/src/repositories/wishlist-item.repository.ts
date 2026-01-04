import type { IWishlistItemRepository } from '@/contracts/repositories/wishlist-item.repository'
import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'
import type { UserSchema } from '@yukinu/validators/auth'
import type { WishlistItemSchema } from '@yukinu/validators/general'
import type {
  ProductSchema,
  ProductImageSchema,
} from '@yukinu/validators/product'

import { BaseRepository } from '@/repositories/base.repository'

export class WishlistItemRepository
  extends BaseRepository<typeof Schema.wishlistItems>
  implements IWishlistItemRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.wishlistItems)
  }

  allWithProduct(
    userId: UserSchema['id'],
    tx = this._db,
  ): Promise<
    (Pick<WishlistItemSchema, 'addedAt'> & {
      product: Pick<ProductSchema, 'id' | 'name' | 'price'> & {
        image: ProductImageSchema['url'] | null
      }
    })[]
  > {
    const { eq, min } = this._orm
    const { products, productImages } = this._schema

    return tx
      .select({
        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          image: min(productImages.url),
        },
        addedAt: this._table.addedAt,
      })
      .from(this._table)
      .where(eq(this._table.userId, userId))
      .innerJoin(products, eq(this._table.productId, products.id))
      .leftJoin(productImages, eq(productImages.productId, products.id))
      .groupBy(products.id, this._table.addedAt)
  }
}
