import * as z from 'zod'

import { VoucherEntity } from '@/modules/sales/domain/entities/voucher.entity'

export namespace AllVouchersDto {
  export const input = z.void()
  export type Input = z.infer<typeof input>

  export const output = z.array(z.instanceof(VoucherEntity))
  export type Output = z.infer<typeof output>
}
