import * as z from 'zod'

import { OrderEntity } from '@/modules/checkout/domain/entities/order.entity'

export namespace UpdateOrderStatusDto {
  export const input = z.object({
    id: z.number().int().positive(),
    status: z.enum(OrderEntity.statuses),
  })
  export type Input = z.infer<typeof input>

  export const output = z.void()
  export type Output = z.infer<typeof output>
}
