import * as z from 'zod'

import { passwordRegex } from '@/shared/schema'

export namespace SignInDto {
  export const input = z.object({
    identifier: z.string().min(1, 'Identifier is required'),
    password: passwordRegex,
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
    expiresAt: z.date(),
  })
  export type Output = z.infer<typeof output>
}
