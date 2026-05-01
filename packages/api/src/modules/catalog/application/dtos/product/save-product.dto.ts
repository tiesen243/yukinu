import * as z from 'zod'

export namespace SaveProductDto {
  export const input = z.object({
    id: z.cuid2().optional(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.string(),
    vendorId: z.cuid2().nullable(),
    categoryId: z.cuid2().nullable(),
    stock: z.number().default(0),
    images: z.array(z.url()),
    attributes: z.array(
      z.object({
        name: z.string(),
        value: z.string(),
      }),
    ),
    variants: z.array(
      z.object({
        name: z.string(),
        options: z.array(z.string()),
      }),
    ),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.cuid2() })
  export type Output = z.infer<typeof output>
}
