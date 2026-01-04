import { addresses, profiles } from '@yukinu/db/schema'
import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

import { userSchema } from '@/auth'
import { paginationInput, paginationOutput } from '@/shared'

/* --------------------------------------------------------------------------
 * Convert Drizzle ORM schemas to Zod schemas for validation
 * --------------------------------------------------------------------------
 */

export const profileSchema = createSelectSchema(profiles, {
  id: z.cuid(),
  gender: z.enum(['male', 'female', 'other']).nullable(),
})
export type ProfileSchema = z.infer<typeof profileSchema>

export const genders = profileSchema.shape.gender.options
export type Gender = (typeof genders)[number]

export const addressSchema = createSelectSchema(addresses, {
  id: z.cuid(),
  userId: z.cuid(),
  phoneNumber: (schema) =>
    schema.regex(
      /^\(\+\d{1,3}\)\s\d{2,4}(?:\s\d{2,4}){1,3}$/,
      'Invalid phone number',
    ),
  postalCode: (schema) =>
    schema.regex(
      /^[A-Za-z0-9][A-Za-z0-9\- ]{1,8}[A-Za-z0-9]$/,
      'Invalid postal code',
    ),
})
export type AddressSchema = z.infer<typeof addressSchema>

/* --------------------------------------------------------------------------
 * Contract schemas for service inputs and outputs
 * --------------------------------------------------------------------------
 */

//#region Users
export const allUsersInput = paginationInput.extend({
  search: z.string('Search must be a valid string').nullable(),
  role: userSchema.shape.role.nullable(),
})
export type AllUsersInput = z.infer<typeof allUsersInput>
export const allUsersOutput = z.object({
  users: z.array(userSchema.omit({ emailVerified: true, deletedAt: true })),
  pagination: paginationOutput,
})
export type AllUsersOutput = z.infer<typeof allUsersOutput>

export const oneUserInput = userSchema.pick({ id: true })
export type OneUserInput = z.infer<typeof oneUserInput>
export const oneUserOutput = userSchema
export type OneUserOutput = z.infer<typeof oneUserOutput>

export const updateUserInput = userSchema
  .pick({ id: true, role: true, status: true })
  .extend({ userId: userSchema.shape.id })
export type UpdateUserInput = z.infer<typeof updateUserInput>
export const updateUserOutput = userSchema.pick({ id: true })
export type UpdateUserOutput = z.infer<typeof updateUserOutput>

export const deleteUserInput = userSchema.pick({ id: true }).extend({
  userId: userSchema.shape.id,
})
export type DeleteUserInput = z.infer<typeof deleteUserInput>
export const deleteUserOutput = userSchema.pick({ id: true })
export type DeleteUserOutput = z.infer<typeof deleteUserOutput>

export const restoreUserInput = userSchema.pick({ id: true }).extend({
  userId: userSchema.shape.id,
})
export type RestoreUserInput = z.infer<typeof restoreUserInput>
export const restoreUserOutput = userSchema.pick({ id: true })
export type RestoreUserOutput = z.infer<typeof restoreUserOutput>

export const permanentlyDeleteUserInput = userSchema
  .pick({ id: true })
  .extend({ userId: userSchema.shape.id })
export type PermanentlyDeleteUserInput = z.infer<
  typeof permanentlyDeleteUserInput
>
export const permanentlyDeleteUserOutput = userSchema.pick({ id: true })
export type PermanentlyDeleteUserOutput = z.infer<
  typeof permanentlyDeleteUserOutput
>
//#endregion Users

//#region Profiles
export const profileInput = profileSchema.pick({ id: true })
export type ProfileInput = z.infer<typeof profileInput>
export const profileOutput = userSchema
  .omit({ status: true, updatedAt: true, deletedAt: true })
  .extend({ profile: profileSchema.omit({ id: true }) })
export type ProfileOutput = z.infer<typeof profileOutput>

export const updateProfileInput = profileSchema.extend({
  image: userSchema.shape.image,
})
export type UpdateProfileInput = z.infer<typeof updateProfileInput>
export const updateProfileOutput = profileSchema.pick({ id: true })
export type UpdateProfileOutput = z.infer<typeof updateProfileOutput>
//#endregion Profiles

//#region Addresses
export const allAddressesInput = addressSchema.pick({ userId: true })
export type AllAddressesInput = z.infer<typeof allAddressesInput>
export const allAddressesOutput = z.object({
  addresses: z.array(addressSchema),
})
export type AllAddressesOutput = z.infer<typeof allAddressesOutput>

export const oneAddressInput = addressSchema.pick({ id: true, userId: true })
export type OneAddressInput = z.infer<typeof oneAddressInput>
export const oneAddressOutput = addressSchema
export type OneAddressOutput = z.infer<typeof oneAddressOutput>

export const createAddressInput = addressSchema.omit({ id: true })
export type CreateAddressInput = z.infer<typeof createAddressInput>
export const createAddressOutput = addressSchema.pick({ id: true })
export type CreateAddressOutput = z.infer<typeof createAddressOutput>

export const updateAddressInput = addressSchema
export type UpdateAddressInput = z.infer<typeof updateAddressInput>
export const updateAddressOutput = addressSchema.pick({ id: true })
export type UpdateAddressOutput = z.infer<typeof updateAddressOutput>

export const deleteAddressInput = addressSchema.pick({ id: true, userId: true })
export type DeleteAddressInput = z.infer<typeof deleteAddressInput>
export const deleteAddressOutput = addressSchema.pick({ id: true })
export type DeleteAddressOutput = z.infer<typeof deleteAddressOutput>
//#endregion Addresses
