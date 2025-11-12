import * as z from 'zod'

export namespace ProfileModels {
  //#region Profile Schema

  export const profile = z.object({
    id: z.cuid2('Invalid profile ID'),
    fullName: z.string('Full name must be a string').nullable(),
    avatarUrl: z.url('Invalid avatar URL').nullable(),
    bio: z
      .string('Bio must be a string')
      .max(160, 'Bio cannot exceed 160 characters')
      .nullable(),
    gender: z.string().nullable(),
    dateOfBirth: z.iso.date('Date of birth is not a valid date').nullable(),
    website: z.url('Invalid website URL').nullable(),
  })
  export type Profile = z.infer<typeof profile>
  //#endregion

  //#region One Profile Schema
  export const oneInput = profile.pick({ id: true })
  export type OneInput = z.infer<typeof oneInput>

  export const oneOutput = profile.extend({
    username: z.string('Username must be a string'),
    email: z.email('Invalid email address'),
  })
  export type OneOutput = z.infer<typeof oneOutput>
  //#endregion

  //#region Update Profile Schema
  export const updateInput = profile.partial()
  export type UpdateInput = z.infer<typeof updateInput>

  export const updateOutput = z.object({ profileId: profile.shape.id })
  export type UpdateOutput = z.infer<typeof updateOutput>
  //#endregion
}
