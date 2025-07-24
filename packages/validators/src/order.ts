import * as z from 'zod/v4'

export const createSchema = z.object({
  items: z.array(
    z.object({
      productId: z.cuid2(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    }),
  ),
  addressId: z.cuid2(),
})

export const byIdSchema = z.object({
  id: z.cuid2(),
})
