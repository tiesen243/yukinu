import * as z from 'zod'

import { UserEntity } from '@/modules/identity/domain/entities/user.entity'

export namespace AllUsersDto {
  export const input = z.object({
    search: z.string().optional(),
    role: z.enum(UserEntity.roles).optional(),
    page: z.number().min(1),
    limit: z.number().min(1),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    users: z.array(z.instanceof(UserEntity)),
    pagination: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
    }),
  })
  export type Output = z.infer<typeof output>
}
