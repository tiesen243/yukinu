import * as z from 'zod'

export namespace UserModel {
  export interface User {
    id: string
    email: string
    role: 'admin' | 'user' | 'manager' | 'vendor'
    status: 'active' | 'inactive'
    createdAt: Date
    updatedAt: Date
  }

  export const findUsersBySearchWithPaginationQuery = z.object({
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
  export type FindUsersBySearchWithPaginationQuery = z.infer<
    typeof findUsersBySearchWithPaginationQuery
  >

  export const updateUserBody = z.object({
    userId: z.cuid2('Invalid user ID'),
    role: z.enum(['admin', 'user', 'manager', 'vendor'], {
      error: 'Invalid role',
    }),
    status: z.enum(['active', 'inactive'], {
      error: 'Invalid status',
    }),
  })
  export type UpdateUserBody = z.infer<typeof updateUserBody>

  export const updateProfileBody = z.object({
    fullName: z
      .string()
      .min(1, 'Full name cannot be empty')
      .max(100, 'Full name is too long'),
    gender: z
      .string()
      .min(1, 'Gender cannot be empty')
      .max(50, 'Gender is too long'),
    dateOfBirth: z.iso.date('Invalid date format'),
    website: z.url('Invalid URL'),
    bio: z.string().max(160, 'Bio is too long'),
  })
  export type UpdateProfileBody = z.infer<typeof updateProfileBody>
}
