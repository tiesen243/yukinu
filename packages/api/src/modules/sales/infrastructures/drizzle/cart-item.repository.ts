import type { Database } from '@yukinu/db/drizzle'

import { cartItems } from '@yukinu/db/schema'

import type { CartItemRepository } from '@/modules/sales/domain/repositories/cart-item.repository'

import { CartItemEntity } from '@/modules/sales/domain/entities/cart-item.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleCartItemRepository
  extends DrizzleRepository<CartItemEntity, typeof cartItems>
  implements CartItemRepository
{
  public constructor(db: Database) {
    super(db, cartItems, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof cartItems>,
  ): CartItemEntity {
    return new CartItemEntity(row)
  }
}
