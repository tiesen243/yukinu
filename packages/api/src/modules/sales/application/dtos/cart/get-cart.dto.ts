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
      z.instanceof(CartItemEntity).and(
        z.object({
          product: z.object({
            vendorId: z.string().nullable(),
            name: z.string(),
            image: z.string().nullable(),
            price: z.string(),
            stock: z.number(),
            variant: z.record(z.string(), z.string()),
          }),
        }),
      ),
    ),
    totalAmount: priceRegex,
  })
  export type Output = z.infer<typeof output>
}
