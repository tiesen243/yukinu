import * as z from 'zod'

import { VendorEntity } from '@/modules/merchant/domain/entities/vendor.entity'
import { Pagination } from '@/shared/schema'

export namespace AllVendorsDto {
  export const input = Pagination.input.extend({
    search: z.string().optional(),
    status: z.enum(VendorEntity.statuses).optional(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    vendors: z.array(z.instanceof(VendorEntity)),
    pagination: Pagination.output,
  })
  export type Output = z.infer<typeof output>
}
