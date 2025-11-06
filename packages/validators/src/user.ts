import * as z from 'zod'

export namespace UserValidator {
  export const roles = [
    'admin',
    'moderator',
    'vendor_owner',
    'vendor_staff',
    'user',
  ] as const
  export type Role = (typeof roles)[number]

  export const statuses = ['active', 'inactive'] as const
  export type Status = (typeof statuses)[number]

  export interface User {
    id: string
    email: string
    role: Role
    status: Status
  }

  export const allParams = z.object({
    search: z.string().max(100, 'Search query is too long'),
    page: z
      .number()
      .int('Page must be an integer')
      .min(1, 'Page must be at least 1')
      .default(1),
    limit: z
      .number()
      .int('Limit must be an integer')
      .min(1, 'Limit must be at least 1')
      .max(100, 'Limit cannot exceed 100')
      .default(10),
  })
  export type AllParams = z.infer<typeof allParams>

  export const oneParams = z.object({
    userId: z.cuid2('Invalid user ID'),
  })
  export type OneParams = z.infer<typeof oneParams>

  export const updateUserBody = z.object({
    userId: z.cuid2('Invalid user ID'),
    role: z.enum(roles, { error: 'Invalid role' }),
    status: z.enum(statuses, { error: 'Invalid status' }),
    password: z.string().optional(),
  })
  export type UpdateUserBody = z.infer<typeof updateUserBody>

  export const updateProfileBody = z.object({
    avatarUrl: z.url('Invalid avatar URL'),
    fullName: z
      .string()
      .min(1, 'Full name cannot be empty')
      .max(100, 'Full name is too long'),
    gender: z
      .string()
      .min(1, 'Gender cannot be empty')
      .max(50, 'Gender is too long'),
    dateOfBirth: z.iso.date('Invalid date format'),
    website: z.url('Invalid URL').optional(),
    bio: z.string().max(160, 'Bio is too long'),
  })
  export type UpdateProfileBody = z.infer<typeof updateProfileBody>
}
