import * as z from 'zod'

import { UserEntity } from '@/modules/identity/domain/entities/user.entity'

export namespace OneUserDto {
  export const input = z.object({ id: z.cuid2() })
  export type Input = z.infer<typeof input>

  export const output = z.instanceof(UserEntity)
  export type Output = z.infer<typeof output>
}
