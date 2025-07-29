import * as z from 'zod/v4'

export const byOrderIdSchema = z.object({
  id: z.cuid2(),
})

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.cuid2(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    }),
  ),
  addressId: z.cuid2(),
})

export const updateOrderSchema = byOrderIdSchema.extend({
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
})
