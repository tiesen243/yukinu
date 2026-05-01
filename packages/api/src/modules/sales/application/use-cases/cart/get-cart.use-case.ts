import type { Database } from '@yukinu/db/drizzle'

import type { CartItemRepository } from '@/modules/sales/domain/repositories/cart-item.repository'

import type { GetCartDto } from '@/modules/sales/application/dtos/cart/get-cart.dto'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class GetCartUseCase extends AbstractUseCase<
  GetCartDto.Input,
  GetCartDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _cartItemRepo: CartItemRepository,
  ) {
    super()
  }

  public async execute(input: GetCartDto.Input): Promise<GetCartDto.Output> {
    const items = await this._cartItemRepo.findWithProduct([input], {
      productId: 'asc',
    })

    const totalAmount = items
      .reduce(
        (acc, { productPrice, quantity }) =>
          acc + (productPrice ? Number.parseFloat(productPrice) * quantity : 0),
        0,
      )
      .toFixed(2)

    return { items, totalAmount }
  }
}
