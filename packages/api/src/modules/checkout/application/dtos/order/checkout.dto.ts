import * as z from 'zod'

import { PaymentEntity } from '@/modules/finance/domain/entities/payment.entity'

export namespace CheckoutDto {
  export const input = z.object({
    userId: z.cuid2(),
    addressId: z.cuid2(),
    voucherId: z.cuid2().nullable().default(null),
    paymentMethod: z.enum(PaymentEntity.methods),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    orderIds: z.array(z.number().int().positive()),
  })
  export type Output = z.infer<typeof output>
}

