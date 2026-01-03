import { accounts, sessions, users, verifications } from '@yukinu/db/schema'
import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

/* --------------------------------------------------------------------------
 * Convert Drizzle ORM schemas to Zod schemas for validation
 * --------------------------------------------------------------------------
 */

export const userSchema = createSelectSchema(users, {
  id: z.cuid(),
  username: (schema) =>
    schema.regex(
      /^(?!\.)(?!.*\.$)[a-zA-Z0-9.]{4,20}$/,
      'Username can only contain letters, numbers and periods, and must be between 4 and 20 characters long',
    ),
  email: z.email('Invalid email address'),
})
export type UserSchema = z.infer<typeof userSchema>

export const roles = userSchema.shape.role.options
export type Role = (typeof roles)[number]

export const userStatuses = userSchema.shape.status.options
export type UserStatus = z.infer<typeof userStatuses>

export const accountSchema = createSelectSchema(accounts, {
  id: z.cuid(),
  userId: z.cuid(),
  password: (schema) =>
    schema.regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
      'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
})
export type AccountSchema = z.infer<typeof accountSchema>

export const verificationSchema = createSelectSchema(verifications, {
  userId: z.cuid(),
})
export type VerificationSchema = z.infer<typeof verificationSchema>

export const sessionSchema = createSelectSchema(sessions, {
  userId: z.cuid(),
})
export type SessionSchema = z.infer<typeof sessionSchema>

/* --------------------------------------------------------------------------
 * Contract schemas for service inputs and outputs
 * --------------------------------------------------------------------------
 */

export const registerInput = userSchema
  .pick({ username: true, email: true })
  .extend({
    password: accountSchema.shape.password.unwrap(),
    confirmPassword: z.string('Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
export type RegisterInput = z.infer<typeof registerInput>
export const registerOutput = userSchema.pick({ id: true })
export type RegisterOutput = z.infer<typeof registerOutput>

export const verifyEmailInput = verificationSchema.pick({ token: true })
export type VerifyEmailInput = z.infer<typeof verifyEmailInput>
export const verifyEmailOutput = verificationSchema.pick({
  userId: true,
})
export type VerifyEmailOutput = z.infer<typeof verifyEmailOutput>

export const loginInput = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  password: accountSchema.shape.password.unwrap(),
})
export type LoginInput = z.infer<typeof loginInput>
export const loginOutput = z.object({
  token: z.string(),
  accessToken: z.string(),
})
export type LoginOutput = z.infer<typeof loginOutput>

export const changeUsernameInput = userSchema
  .pick({ id: true, username: true })
  .extend({ password: accountSchema.shape.password.unwrap() })
export type ChangeUsernameInput = z.infer<typeof changeUsernameInput>
export const changeUsernameOutput = userSchema.pick({ id: true })
export type ChangeUsernameOutput = z.infer<typeof changeUsernameOutput>

export const changePasswordInput = accountSchema
  .pick({ userId: true, password: true })
  .extend({
    newPassword: accountSchema.shape.password.unwrap(),
    confirmNewPassword: z.string('Please confirm your new password'),
    isLogout: z.boolean().default(true),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  })
export type ChangePasswordInput = z.infer<typeof changePasswordInput>
export const changePasswordOutput = accountSchema.pick({ userId: true })
export type ChangePasswordOutput = z.infer<typeof changePasswordOutput>

export const forgotPasswordInput = userSchema.pick({ email: true })
export type ForgotPasswordInput = z.infer<typeof forgotPasswordInput>
export const forgotPasswordOutput = userSchema.pick({ id: true })
export type ForgotPasswordOutput = z.infer<typeof forgotPasswordOutput>

export const resetPasswordInput = z
  .object({
    token: z.string().min(1, 'Token is required'),
    newPassword: accountSchema.shape.password.unwrap(),
    confirmNewPassword: z.string('Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  })
export type ResetPasswordInput = z.infer<typeof resetPasswordInput>
export const resetPasswordOutput = accountSchema.pick({ userId: true })
export type ResetPasswordOutput = z.infer<typeof resetPasswordOutput>

export const allSessionsInput = sessionSchema.pick({ userId: true })
export type AllSessionsInput = z.infer<typeof allSessionsInput>
export const allSessionsOutput = z.array(
  sessionSchema.omit({ userId: true, token: true }),
)
export type AllSessionsOutput = z.infer<typeof allSessionsOutput>

export const deleteSessionInput = sessionSchema.pick({
  id: true,
  userId: true,
})
export type DeleteSessionInput = z.infer<typeof deleteSessionInput>
export const deleteSessionOutput = sessionSchema.pick({ id: true })
export type DeleteSessionOutput = z.infer<typeof deleteSessionOutput>

export const deleteAccountInput = accountSchema
  .pick({ userId: true, password: true })
  .refine((data) => data.password !== null && data.password.length > 0, {
    message: 'Password is required',
  })
export type DeleteAccountInput = z.infer<typeof deleteAccountInput>
export const deleteAccountOutput = userSchema.pick({ id: true })
export type DeleteAccountOutput = z.infer<typeof deleteAccountOutput>
