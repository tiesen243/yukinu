import type { cartItems } from '@yukinu/db/schema'
import type { CartItemSchema } from '@yukinu/validators/cart'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface ICartItemRepository extends IBaseRepository<typeof cartItems> {
  allWithProduct(
    criterias?: Partial<CartItemSchema>[],
    orderBy?: Partial<Record<keyof CartItemSchema, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
  ): Promise<ICartItemRepository.CartItemWithProduct[]>
}

export namespace ICartItemRepository {
  export type CartItemWithProduct = Omit<CartItemSchema, 'userId'> & {
    productName: string
    productImage: string | null
    productPrice: string
    productStock: number
    variant: Record<string, string>
    vendorId: string | null
  }
}
