import * as z from 'zod'

import { TransactionEntity } from '@/modules/finance/domain/entities/transaction.entity'

export namespace AllTransactionsByUserDto {
  export const input = z.object({
    userId: z.cuid2(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.array(z.instanceof(TransactionEntity))
  export type Output = z.infer<typeof output>
}
