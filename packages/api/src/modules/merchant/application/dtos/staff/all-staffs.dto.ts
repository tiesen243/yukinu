import * as z from 'zod'

import { VendorStaffEntity } from '@/modules/merchant/domain/entities/vendor-staff.entity'

export namespace AllStaffsDto {
  export const input = z.object({ id: z.cuid2() })
  export type Input = z.infer<typeof input>

  export const output = z.array(
    z.instanceof(VendorStaffEntity).transform(
      (val) =>
        val as VendorStaffEntity & {
          username: string
          email: string
        },
    ),
  )
  export type Output = z.infer<typeof output>
}
