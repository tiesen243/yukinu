import * as z from 'zod'

import { passwordRegex } from '@/shared/schema'

export namespace ChangeUsernameDto {
  export const input = z.object({
    id: z.cuid2(),
    username: z.string(),
    password: passwordRegex,
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.cuid2() })
  export type Output = z.infer<typeof output>
}
