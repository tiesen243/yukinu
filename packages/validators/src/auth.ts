import * as z from 'zod'

export namespace AuthValidators {
  const passwordRegex = z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
      'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
    )

  export const registerInput = z
    .object({
      username: z
        .string('Username is required')
        .min(4, 'Username must be at least 4 characters long')
        .max(20, 'Username must be at most 20 characters long')
        .regex(
          /^(?!\.)(?!.*\.$)[a-zA-Z0-9.]+$/,
          'Username can only contain letters, numbers and periods',
        ),
      email: z.email('Invalid email address'),
      password: passwordRegex,
      confirmPassword: z.string('Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })
  export type RegisterInput = z.infer<typeof registerInput>
  export const registerOutput = z.object({ id: z.cuid() })
  export type RegisterOutput = z.infer<typeof registerOutput>

  export const verifyEmailInput = z.object({
    token: z.string().min(1, 'Token is required'),
  })
  export type VerifyEmailInput = z.infer<typeof verifyEmailInput>
  export const verifyEmailOutput = z.void()
  export type VerifyEmailOutput = z.infer<typeof verifyEmailOutput>

  export const loginInput = z.object({
    identifier: z.string().min(1, 'Identifier is required'),
    password: passwordRegex,
  })
  export type LoginInput = z.infer<typeof loginInput>
  export const loginOutput = z.object({ token: z.string() })
  export type LoginOutput = z.infer<typeof loginOutput>

  export const changeUsernameInput = z.object({
    userId: z.cuid(),
    username: z
      .string()
      .min(4, 'Username must be at least 4 characters long')
      .max(20, 'Username must be at most 20 characters long')
      .regex(
        /^(?!\.)(?!.*\.$)[a-zA-Z0-9.]+$/,
        'Username can only contain letters, numbers and periods',
      ),
    password: passwordRegex,
  })
  export type ChangeUsernameInput = z.infer<typeof changeUsernameInput>
  export const changeUsernameOutput = z.void()
  export type ChangeUsernameOutput = z.infer<typeof changeUsernameOutput>

  export const changePasswordInput = z
    .object({
      userId: z.cuid(),
      currentPassword: z.string().optional(),
      newPassword: passwordRegex,
      confirmNewPassword: z.string('Please confirm your new password'),
      isLogOut: z.boolean().default(true),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: 'New passwords do not match',
      path: ['confirmNewPassword'],
    })
  export type ChangePasswordInput = z.infer<typeof changePasswordInput>
  export const changePasswordOutput = z.void()
  export type ChangePasswordOutput = z.infer<typeof changePasswordOutput>

  export const forgotPasswordInput = z.object({
    email: z.email('Invalid email address'),
  })
  export type ForgotPasswordInput = z.infer<typeof forgotPasswordInput>
  export const forgotPasswordOutput = z.void()
  export type ForgotPasswordOutput = z.infer<typeof forgotPasswordOutput>

  export const resetPasswordInput = z
    .object({
      token: z.string().min(1, 'Token is required'),
      newPassword: passwordRegex,
      confirmNewPassword: z.string('Please confirm your new password'),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: 'New passwords do not match',
      path: ['confirmNewPassword'],
    })
  export type ResetPasswordInput = z.infer<typeof resetPasswordInput>
  export const resetPasswordOutput = z.void()
  export type ResetPasswordOutput = z.infer<typeof resetPasswordOutput>
}
