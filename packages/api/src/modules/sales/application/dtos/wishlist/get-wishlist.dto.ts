import * as z from 'zod'

import { priceRegex } from '@/shared/schema'

export namespace GetWishlistDto {
  export const input = z.object({ userId: z.cuid2() })
  export type Input = z.infer<typeof input>

  export const output = z.array(
    z.object({
      product: z.object({
        id: z.string(),
        name: z.string(),
        image: z.string().nullable(),
        price: priceRegex,
      }),
      addedAt: z.date(),
    }),
  )
  export type Output = z.infer<typeof output>
}
