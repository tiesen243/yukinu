import * as z from 'zod'

export namespace UpdateVariantDto {
  export const input = z.object({
    id: z.cuid2(),
    price: z.string(),
    stock: z.int().positive(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.void()
  export type Output = z.infer<typeof output>
}
