import * as z from 'zod'

import { identifierSchema, passwordSchema } from '@/lib/shared'

export namespace AuthModels {
  //#region Login Schema
  export const loginInput = z.object({
    identifier: identifierSchema,
    password: passwordSchema,
  })
  export type LoginInput = z.infer<typeof loginInput>

  export const loginOutput = z.object({ token: z.string(), expires: z.date() })
  export type LoginOutput = z.infer<typeof loginOutput>
  //#endregion

  //#region Register Schema
  export const registerInput = z
    .object({
      username: identifierSchema,
      email: z.email('Invalid email address'),
      password: passwordSchema,
      confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      error: 'Passwords do not match',
      path: ['confirmPassword'],
    })
  export type RegisterInput = z.infer<typeof registerInput>

  export const registerOutput = z.object({ userId: z.string() })
  export type RegisterOutput = z.infer<typeof registerOutput>
  //#endregion

  //#region Change Password Schema
  export const changePasswordInput = z
    .object({
      userId: z.cuid2('Invalid user ID'),
      currentPassword: passwordSchema.optional(),
      newPassword: passwordSchema,
      confirmNewPassword: passwordSchema,
      isLogOutOtherSessions: z.boolean().default(true),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      error: 'New passwords do not match',
      path: ['confirmNewPassword'],
    })
  export type ChangePasswordInput = z.infer<typeof changePasswordInput>

  export const changePasswordOutput = z.object({ userId: z.string() })
  export type ChangePasswordOutput = z.infer<typeof changePasswordOutput>
  //#endregion
}
