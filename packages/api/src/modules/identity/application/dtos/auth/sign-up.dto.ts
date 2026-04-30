import * as z from 'zod'

import { passwordRegex } from '@/shared/schema'

export namespace SignUpDto {
  export const input = z
    .object({
      email: z.email('Invalid email address'),
      username: passwordRegex,
      password: passwordRegex,
      confirmPassword: passwordRegex,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    userId: z.cuid2(),
    verificationToken: z.string().min(1),
  })
  export type Output = z.infer<typeof output>
}
