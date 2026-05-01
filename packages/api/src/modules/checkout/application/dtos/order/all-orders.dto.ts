import * as z from 'zod'

import { OrderEntity } from '@/modules/checkout/domain/entities/order.entity'
import { Pagination } from '@/shared/schema'

export namespace AllOrdersDto {
  export const input = Pagination.input.extend({
    userId: z.cuid2().nullable().optional(),
    vendorId: z.cuid2().nullable().optional(),
    paymentId: z.cuid2().nullable().optional(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    orders: z.array(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(OrderEntity.statuses),
        totalAmount: z.string(),
        user: z.object({ id: z.cuid2(), username: z.string() }),
        items: z.array(
          z.object({
            quantity: z.number().int().positive(),
            productId: z.cuid2().nullable(),
            unitPrice: z.string(),
            productName: z.string(),
            productImage: z.url().nullable(),
          }),
        ),
      }),
    ),
    pagination: Pagination.output,
  })
  export type Output = z.infer<typeof output>
}

