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
  paymentMethod: z.enum([
    'credit_card',
    'debit_card',
    'paypal',
    'bank_transfer',
    'cash_on_delivery',
  ]),
})

export type CreateOrderSchema = z.infer<typeof createOrderSchema>

export const updateOrderSchema = byOrderIdSchema.extend({
  orderStatus: z
    .enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
    .optional(),
  paymentStatus: z
    .enum(['pending', 'completed', 'failed', 'refunded'])
    .optional(),
})
