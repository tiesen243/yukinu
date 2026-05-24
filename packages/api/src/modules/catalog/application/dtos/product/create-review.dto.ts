import * as z from 'zod'

export namespace CreateReviewDto {
  export const input = z.object({
    productId: z.cuid2(),
    rating: z.number(),
    comment: z.string(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.void()
  export type Output = z.infer<typeof output>
}
