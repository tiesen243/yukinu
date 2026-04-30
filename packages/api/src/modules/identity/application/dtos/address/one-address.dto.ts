import * as z from 'zod'

import { AddressEntity } from '@/modules/identity/domain/entities/address.entity'

export namespace OneAddressDto {
  export const input = z.object({ id: z.cuid2(), userId: z.cuid2() })
  export type Input = z.infer<typeof input>

  export const output = z.instanceof(AddressEntity)
  export type Output = z.infer<typeof output>
}
