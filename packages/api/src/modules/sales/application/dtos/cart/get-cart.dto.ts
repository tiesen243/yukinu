import * as z from 'zod'

import { CartItemEntity } from '@/modules/sales/domain/entities/cart-item.entity'
import { priceRegex } from '@/shared/schema'

export namespace GetCartDto {
  export const input = z.object({
    userId: z.cuid2(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    items: z.array(
      z.instanceof(CartItemEntity).transform(
        (val) =>
          val as CartItemEntity & {
            product: {
              vendorId: string | null
              name: string
              image: string | null
              price: string
              stock: number
              variant: Record<string, string>
            }
          },
      ),
    ),
    totalAmount: priceRegex,
  })
  export type Output = z.infer<typeof output>
}
