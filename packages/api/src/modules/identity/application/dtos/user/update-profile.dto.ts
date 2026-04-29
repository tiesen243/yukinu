import * as z from 'zod'

import { ProfileEntity } from '@/modules/identity/domain/entities/profile.entity'

export namespace UpdateProfileDto {
  export const input = z.object({
    id: z.cuid2(),
    fullName: z
      .string()
      .max(255, 'Full name must be at most 255 characters long')
      .nullable(),
    bio: z.string().nullable(),
    image: z.url().optional(),
    banner: z.url().max(500).nullable(),
    gender: z.enum(ProfileEntity.genders).nullable(),
    dateOfBirth: z.iso.date().nullable(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.cuid2() })
  export type Output = z.infer<typeof output>
}
