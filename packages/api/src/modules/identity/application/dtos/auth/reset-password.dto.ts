import * as z from 'zod'

import { passwordRegex } from '@/shared/schema'

export namespace ResetPasswordDto {
  export const input = z.object({
    token: z.string().min(1),
    newPassword: passwordRegex,
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    userId: z.string().min(1),
  })
  export type Output = z.infer<typeof output>
}
