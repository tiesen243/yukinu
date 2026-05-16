import * as z from 'zod'

export namespace RemoveCartItemDto {
  export const input = z.object({
    userId: z.cuid2(),
    cartItemId: z.cuid2(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.void()
  export type Output = z.infer<typeof output>
}
