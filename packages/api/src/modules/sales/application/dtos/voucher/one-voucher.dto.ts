import * as z from 'zod'

import { VoucherEntity } from '@/modules/sales/domain/entities/voucher.entity'

export namespace OneVoucherDto {
  export const input = z.object({ code: z.string() })
  export type Input = z.infer<typeof input>

  export const output = z.instanceof(VoucherEntity)
  export type Output = z.infer<typeof output>
}
