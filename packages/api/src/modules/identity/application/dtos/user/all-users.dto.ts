import * as z from 'zod'

import { UserEntity } from '@/modules/identity/domain/entities/user.entity'
import { Pagination } from '@/shared/schema'

export namespace AllUsersDto {
  export const input = Pagination.input.extend({
    search: z.string().optional(),
    role: z.enum(UserEntity.roles).optional(),
    isDeleted: z.boolean().default(false),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    users: z.array(z.instanceof(UserEntity)),
    pagination: Pagination.output,
  })
  export type Output = z.infer<typeof output>
}
