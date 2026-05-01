import type { Database } from '@yukinu/db/drizzle'

import type { SaveCartItemDto } from '@/modules/sales/application/dtos/cart/save-cart-item.dto'
import type { CartItemRepository } from '@/modules/sales/domain/repositories/cart-item.repository'

import { CartItemEntity } from '@/modules/sales/domain/entities/cart-item.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class SaveCartItemUseCase extends AbstractUseCase<
  SaveCartItemDto.Input,
  SaveCartItemDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _cartItemRepo: CartItemRepository,
  ) {
    super()
  }

  public async execute(
    input: SaveCartItemDto.Input,
  ): Promise<SaveCartItemDto.Output> {
    const item = new CartItemEntity(input)
    await this._cartItemRepo.save(item)
  }
}
