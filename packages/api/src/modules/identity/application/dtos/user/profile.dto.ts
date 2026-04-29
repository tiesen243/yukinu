import * as z from 'zod'

import { ProfileEntity } from '@/modules/identity/domain/entities/profile.entity'
import { UserEntity } from '@/modules/identity/domain/entities/user.entity'

export namespace ProfileDto {
  export const input = z.object({ id: z.cuid2() })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    user: z.instanceof(UserEntity),
    profile: z.instanceof(ProfileEntity),
  })
  export type Output = z.infer<typeof output>
}
