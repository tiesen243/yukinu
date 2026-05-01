import * as z from 'zod'

import { OrderEntity } from '@/modules/checkout/domain/entities/order.entity'

export namespace OneOrderDto {
  export const input = z.object({
    id: z.number().int().positive(),
    userId: z.cuid2().nullable().optional(),
    vendorId: z.cuid2().nullable().optional(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    id: z.number().int().positive(),
    status: z.enum(OrderEntity.statuses),
    totalAmount: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    user: z.object({ id: z.cuid2(), email: z.email(), username: z.string() }),
    address: z.object({
      id: z.cuid2(),
      recipientName: z.string(),
      phoneNumber: z.string(),
      street: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
    }),
    items: z.array(
      z.object({
        quantity: z.number().int().positive(),
        productId: z.cuid2().nullable(),
        unitPrice: z.string(),
        productName: z.string(),
        productImage: z.url().nullable(),
      }),
    ),
  })
  export type Output = z.infer<typeof output>
}

