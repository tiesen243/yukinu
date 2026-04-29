import * as z from 'zod'

import { UserEntity } from '@/modules/identity/domain/entities/user.entity'

export namespace UpdateUserDto {
  export const input = z.object({
    id: z.cuid2(),
    status: z.enum(UserEntity.statuses).optional(),
    role: z.enum(UserEntity.roles).optional(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.cuid2() })
  export type Output = z.infer<typeof output>
}
