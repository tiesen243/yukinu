import * as z from 'zod'

/* --------------------------------------------------------------------------
 * Convert Drizzle ORM schemas to Zod schemas for validation
 * --------------------------------------------------------------------------
 */

export const roles = [
  'user',
  'admin',
  'vendor_owner',
  'vendor_staff',
  'moderator',
] as const
export type Role = (typeof roles)[number]

export const userStatuses = ['active', 'inactive'] as const
export type UserStatus = z.infer<typeof userStatuses>

export const userSchema = z.object({
  id: z.cuid(),
  username: z
    .string()
    .regex(
      /^(?!\.)(?!.*\.$)[a-zA-Z0-9.]{4,20}$/,
      'Username can only contain letters, numbers and periods, and must be between 4 and 20 characters long',
    ),
  email: z.email('Invalid email address'),
  emailVerified: z.date().nullable(),
  role: z.enum(roles, 'Invalid user role'),
  status: z.enum(userStatuses, 'Invalid user status'),
  image: z
    .url('Invalid image URL')
    .max(500, 'Image URL is too long')
    .nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
})
export type UserSchema = z.infer<typeof userSchema>

export const accountSchema = z.object({
  id: z.cuid(),
  userId: z.cuid(),
  provider: z.string().min(1).max(50),
  accountId: z.string().min(1).max(100),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
      'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
    )
    .nullable(),
})
export type AccountSchema = z.infer<typeof accountSchema>

export const verificationSchema = z.object({
  token: z.string().min(1).max(64),
  userId: z.cuid(),
  expiresAt: z.date(),
  type: z.string().min(1).max(50),
})
export type VerificationSchema = z.infer<typeof verificationSchema>

export const sessionSchema = z.object({
  id: z.cuid(),
  userId: z.cuid(),
  token: z.string().min(1).max(64),
  expiresAt: z.date(),
  ipAddress: z.string().max(45).nullable(),
  userAgent: z.string().nullable(),
  createdAt: z.date(),
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

export const changePasswordInput = z
  .object({
    userId: z.cuid().nullable(),
    currentPassword: accountSchema.shape.password,
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

export const deleteAccountInput = accountSchema.pick({ userId: true }).extend({
  password: accountSchema.shape.password.unwrap(),
})
export type DeleteAccountInput = z.infer<typeof deleteAccountInput>
export const deleteAccountOutput = userSchema.pick({ id: true })
export type DeleteAccountOutput = z.infer<typeof deleteAccountOutput>
