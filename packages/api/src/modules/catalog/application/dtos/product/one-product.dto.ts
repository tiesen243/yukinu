import * as z from 'zod'

export namespace OneProductDto {
  export const input = z.object({
    id: z.cuid2(),
    vendorId: z.cuid2().optional(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    id: z.cuid2(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.string(),
    stock: z.number().default(0),
    sold: z.number().default(0),
    createdAt: z.date(),
    updatedAt: z.date(),
    category: z.object({ id: z.cuid2(), name: z.string() }).nullable(),
    vendor: z
      .object({
        id: z.cuid2(),
        name: z.string(),
        image: z.url().nullable(),
        address: z.string().nullable(),
      })
      .nullable(),
    images: z.array(
      z.object({
        id: z.cuid2(),
        url: z.url(),
      }),
    ),
    attributes: z.array(
      z.object({
        name: z.string(),
        value: z.string(),
      }),
    ),
    variants: z.array(
      z.object({
        id: z.cuid2(),
        sku: z.string(),
        price: z.string(),
        stock: z.number().default(0),
        options: z.array(z.object({ name: z.string(), value: z.string() })),
      }),
    ),
    reviews: z.array(
      z.object({
        rating: z.number(),
        comment: z.string().nullable(),
        user: z.object({
          id: z.cuid2(),
          username: z.string(),
          image: z.url().nullable(),
        }),
        createdAt: z.date(),
      }),
    ),
  })
  export type Output = z.infer<typeof output>
}
