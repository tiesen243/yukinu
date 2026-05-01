import * as z from 'zod'

export namespace SaveCartItemDto {
  export const input = z.object({
    userId: z.cuid2(),
    productId: z.cuid2(),
    productVariantId: z.cuid2().nullable(),
    quantity: z.int().positive().min(1, 'Quantity must be at least 1'),
  })
  export type Input = z.infer<typeof input>

  export const output = z.void()
  export type Output = z.infer<typeof output>
}
