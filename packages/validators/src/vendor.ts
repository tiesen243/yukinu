import * as z from 'zod'

import { paginationInputSchema, paginationOutputSchema } from '@/lib/shared'

export namespace VendorModels {
  //#region Vendor Schema
  export const statuses = ['pending', 'approved', 'suspended'] as const
  export type Status = (typeof statuses)[number]

  export const vendor = z.object({
    id: z.cuid2('Invalid vendor ID'),
    ownerId: z.cuid2('Invalid owner ID'),
    name: z
      .string('Vendor name must be a string')
      .min(4, 'Vendor name must be at least 4 characters long')
      .max(100, 'Vendor name must be at most 100 characters long'),
    status: z.enum(statuses, 'Invalid vendor status'),
    description: z.string('Vendor description must be a string').nullable(),
    imageUrl: z.url('Invalid image URL').nullable(),
    website: z.url('Invalid vendor website').nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  export type Vendor = z.infer<typeof vendor>
  //#endregion

  //#region All Vendors Schema
  export const allInput = paginationInputSchema.extend({
    status: z.enum(statuses, 'Invalid vendor status').optional(),
  })
  export type AllInput = z.infer<typeof allInput>

  export const allOutput = z.object({
    vendors: z.array(
      vendor
        .pick({ id: true, name: true, status: true, updatedAt: true })
        .extend({ owner: z.string() }),
    ),
    pagination: paginationOutputSchema,
  })
  export type AllOutput = z.infer<typeof allOutput>
  //#endregion

  //#region One Vendor Schema
  export const oneInput = vendor.pick({ id: true })
  export type oneInput = z.infer<typeof oneInput>

  export const oneOutput = vendor.extend({ owner: z.string() }).nullable()
  export type OneOutput = z.infer<typeof oneOutput>
  //#endregion

  //#region Register Vendor Schema
  export const registerInput = vendor
    .pick({ name: true, description: true, website: true })
    .extend({ userId: z.cuid2() })
  export type RegisterInput = z.infer<typeof registerInput>

  export const registerOutput = z.object({ vendorId: vendor.shape.id })
  export type RegisterOutput = z.infer<typeof registerOutput>
  //#endregion

  //#region Update Vendor Schema
  export const updateInput = vendor
    .omit({ createdAt: true, updatedAt: true })
    .partial()
  export type UpdateInput = z.infer<typeof updateInput>

  export const updateOutput = z.object({ vendorId: vendor.shape.id })
  export type UpdateOutput = z.infer<typeof updateOutput>
  //#endregion

  //#region Delete Vendor Schema
  export const deleteInput = vendor.pick({ id: true })
  export type DeleteInput = z.infer<typeof deleteInput>

  export const deleteOutput = z.object({ vendorId: vendor.shape.id })
  export type DeleteOutput = z.infer<typeof deleteOutput>
  //#endregion
}
