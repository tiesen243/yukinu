import * as z from 'zod'

import { VendorEntity } from '@/modules/merchant/domain/entities/vendor.entity'

export namespace OneVendorDto {
  export const input = z.object({ id: z.cuid2() })
  export type Input = z.infer<typeof input>

  export const output = z.instanceof(VendorEntity)
  export type Output = z.infer<typeof output>
}
