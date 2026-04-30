import * as z from 'zod'

import { VendorEntity } from '@/modules/merchant/domain/entities/vendor.entity'

export namespace UpdateVendorStatusDto {
  export const input = z.object({
    id: z.cuid2(),
    ownerId: z.cuid2(),
    status: z.enum(VendorEntity.statuses),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.cuid2() })
  export type Output = z.infer<typeof output>
}
