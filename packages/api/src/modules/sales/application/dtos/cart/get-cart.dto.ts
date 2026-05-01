import * as z from 'zod'

import { priceRegex } from '@/shared/schema'

export namespace GetCartDto {
  export const input = z.object({
    userId: z.cuid2(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    items: z.array(
      z.object({
        id: z.cuid2(),
        productId: z.cuid2(),
        productName: z.string(),
        productImage: z.url().nullable(),
        productPrice: priceRegex,
        productStock: z.number().int(),
        variant: z.record(z.string(), z.string()),
        quantity: z.int().positive(),
      }),
    ),
    totalAmount: priceRegex,
  })
  export type Output = z.infer<typeof output>
}
