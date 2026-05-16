import * as z from 'zod'

import { AddressEntity } from '@/modules/identity/domain/entities/address.entity'

export namespace AllAddressesDto {
  export const input = z.object({ userId: z.cuid2() })
  export type Input = z.infer<typeof input>

  export const output = z.array(z.instanceof(AddressEntity))
  export type Output = z.infer<typeof output>
}
