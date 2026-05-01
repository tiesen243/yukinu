import * as z from 'zod'

import { passwordRegex } from '@/shared/schema'

export namespace ChangePasswordDto {
  export const input = z
    .object({
      userId: z.cuid2().optional(),
      currentPassword: passwordRegex.optional(),
      newPassword: passwordRegex,
      confirmNewPassword: passwordRegex,
      isLogout: z.boolean().default(true),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: 'New passwords do not match',
      path: ['confirmNewPassword'],
    })
  export type Input = z.infer<typeof input>

  export const output = z.object({ userId: z.cuid2() })
  export type Output = z.infer<typeof output>
}
