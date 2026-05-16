import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { RemoveCartItemDto } from '@/modules/sales/application/dtos/cart/remove-cart-item.dto'
import type { CartItemRepository } from '@/modules/sales/domain/repositories/cart-item.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class RemoveCartItemUseCase extends AbstractUseCase<
  RemoveCartItemDto.Input,
  RemoveCartItemDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _cartItemRepo: CartItemRepository,
  ) {
    super()
  }

  public async execute(
    input: RemoveCartItemDto.Input,
  ): Promise<RemoveCartItemDto.Output> {
    const [item] = await this._cartItemRepo.find([input], {}, { limit: 1 })
    if (!item)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Cart item not found' })

    await this._cartItemRepo.delete([input])
  }
}
