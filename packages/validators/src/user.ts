import * as z from 'zod'

export namespace UserModel {
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
