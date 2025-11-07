import * as z from 'zod'

import { passwordSchema, usernameSchema } from '@/lib/shared'

export namespace AuthValidator {
  export const loginBody = z.object({
    identifier: z.union([usernameSchema, z.email('Invalid email address')]),
    password: passwordSchema,
    setSession: z.boolean().default(true),
  })
  export type LoginBody = z.infer<typeof loginBody>

  export const registerBody = z
    .object({
      username: usernameSchema,
      email: z.email('Invalid email address'),
      password: passwordSchema,
      confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      error: 'Passwords do not match',
      path: ['confirmPassword'],
    })
  export type RegisterBody = z.infer<typeof registerBody>

  export const changePasswordBody = z
    .object({
      currentPassword: z.string().optional(),
      newPassword: passwordSchema,
      confirmNewPassword: passwordSchema,
      isLogOutOtherSessions: z.boolean(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      error: 'New passwords do not match',
      path: ['confirmNewPassword'],
    })
  export type ChangePasswordBody = z.infer<typeof changePasswordBody>
}
