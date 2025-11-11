import * as z from 'zod'

import { paginationInputSchema, paginationOutputSchema } from '@/lib/shared'

export namespace UserModels {
  //#region User Schema
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

  export const user = z.object({
    id: z.cuid2('Invalid user ID'),
    username: z.string('Username must be a string').min(4).max(100),
    email: z.email('Invalid email address'),
    emailVerified: z.date('Email verified must be a date').nullable(),
    role: z.enum(roles, 'Invalid user role'),
    status: z.enum(statuses, 'Invalid user status'),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  export type User = z.infer<typeof user>
  //#endregion

  //#region All Users Schema
  export const allInput = paginationInputSchema.extend({ search: z.string() })
  export type AllInput = z.infer<typeof allInput>

  export const allOutput = z.object({
    users: z.array(
      user.pick({
        id: true,
        username: true,
        role: true,
        status: true,
        updatedAt: true,
      }),
    ),
    pagination: paginationOutputSchema,
  })
  export type AllOutput = z.infer<typeof allOutput>
  //#endregion

  //#region One User Schema
  export const oneInput = user.pick({ id: true })
  export type OneInput = z.infer<typeof oneInput>

  export const oneOutput = user.nullable()
  export type OneOutput = z.infer<typeof oneOutput>
  //#endregion

  //#region Update User Schema
  export const updateInput = user.pick({ id: true, role: true, status: true })
  export type UpdateInput = z.infer<typeof updateInput>

  export const updateOutput = z.object({ userId: user.shape.id })
  export type UpdateOutput = z.infer<typeof updateOutput>
  //#endregion

  //#region Delete User Schema
  export const deleteInput = oneInput
  export type DeleteInput = z.infer<typeof deleteInput>

  export const deleteOutput = z.object({ userId: user.shape.id })
  export type DeleteOutput = z.infer<typeof deleteOutput>
  //#endregion
}
