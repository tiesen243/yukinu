import * as z from 'zod'

export namespace AuthModel {
  const usernameSchema = z
    .string()
    .trim()
    .min(2, 'Username too short')
    .max(100, 'Username too long')
    .transform((val) => val.toLowerCase())

  const passwordSchema = z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
      'Password not strong enough',
    )

  export const loginBody = z.object({
    indentifier: z.union([usernameSchema, z.email('Invalid email address')]),
    password: passwordSchema,
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
