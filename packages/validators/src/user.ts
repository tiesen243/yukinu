import * as z from 'zod'

export namespace UserModel {
  export const updateProfileBody = z.object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .max(100, 'Full name is too long')
      .optional(),
    gender: z
      .string()
      .min(1, 'Gender is required')
      .max(50, 'Gender is too long')
      .optional(),
    dateOfBirth: z.iso.date('Invalid date format').optional(),
    website: z.url('Invalid URL').optional(),
    bio: z.string().max(160, 'Bio is too long').optional(),
  })
  export type UpdateProfileBody = z.infer<typeof updateProfileBody>
}
