import * as z from 'zod'

import { PaymentEntity } from '@/modules/finance/domain/entities/payment.entity'

export namespace OnePaymentDto {
  export const input = z.object({
    id: z.cuid2(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.instanceof(PaymentEntity)
  export type Output = z.infer<typeof output>
}
