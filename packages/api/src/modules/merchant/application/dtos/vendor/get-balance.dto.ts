import * as z from 'zod'

import { VendorBalanceEntity } from '@/modules/merchant/domain/entities/vendor-balance.entity'
import { VendorTransferEntity } from '@/modules/merchant/domain/entities/vendor-transfer.entity'

export namespace GetBalanceDto {
  export const input = z.object({
    vendorId: z.cuid2(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    balance: z.instanceof(VendorBalanceEntity),
    transfers: z.array(z.instanceof(VendorTransferEntity)),
  })
  export type Output = z.infer<typeof output>
}
