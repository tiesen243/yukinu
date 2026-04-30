import * as z from 'zod'

export namespace SaveVoucherDto {
  export const input = z.object({
    id: z.cuid2().optional(),
    code: z.string(),
    discountAmount: z.string().nullable(),
    discountPercentage: z.number().nullable(),
    quantity: z.number(),
    expiredAt: z.date(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.cuid2() })
  export type Output = z.infer<typeof output>
}
