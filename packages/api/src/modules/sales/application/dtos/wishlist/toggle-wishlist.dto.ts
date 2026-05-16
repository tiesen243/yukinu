import * as z from 'zod'

export namespace ToggleWishlistDto {
  export const input = z.object({
    userId: z.cuid2(),
    productId: z.cuid2(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    added: z.boolean(),
  })
  export type Output = z.infer<typeof output>
}
