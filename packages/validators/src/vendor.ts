import {
  vendorBalances,
  vendors,
  vendorStaffs,
  vendorTransfers,
} from '@yukinu/db/schema'
import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

import { paginationInput, paginationOutput } from '@/shared'

export namespace VendorValidators {
  /* --------------------------------------------------------------------------
   * Convert Drizzle ORM schemas to Zod schemas for validation
   * --------------------------------------------------------------------------
   */

  export const vendorSchema = createSelectSchema(vendors, {
    id: z.cuid(),
    ownerId: z.cuid().nullable(),
    image: z.url('Invalid image url').nullable(),
  })
  export type VendorSchema = z.infer<typeof vendorSchema>

  export const vendorStaffSchema = createSelectSchema(vendorStaffs, {
    vendorId: z.cuid(),
    userId: z.cuid(),
  })
  export type VendorStaffSchema = z.infer<typeof vendorStaffSchema>

  export const VendorBalanceSchema = createSelectSchema(vendorBalances, {
    vendorId: z.cuid(),
    balance: (schema) =>
      schema.regex(/^(?:\d{1,10})(?:\.\d{1,2})?$/, 'Invalid balance format'),
  })
  export type VendorBalanceSchema = z.infer<typeof VendorBalanceSchema>

  export const vendorTransferSchema = createSelectSchema(vendorTransfers, {
    id: z.cuid(),
    vendorId: z.cuid(),
    amountIn: (schema) =>
      schema.regex(/^(?:\d{1,10})(?:\.\d{1,2})?$/, 'Invalid amount format'),
    amountOut: (schema) =>
      schema.regex(/^(?:\d{1,10})(?:\.\d{1,2})?$/, 'Invalid amount format'),
  })

  /* --------------------------------------------------------------------------
   * Contract schemas for service inputs and outputs
   * --------------------------------------------------------------------------
   */

  //#region Vendors
  export const allVendorsInput = paginationInput.extend({
    search: z.string('Search must be a valid string').nullable(),
    status: vendorSchema.shape.status.nullable(),
  })
  export type AllVendorsInput = z.infer<typeof allVendorsInput>
  export const allVendorsOutput = z.object({
    vendors: z.array(
      vendorSchema
        .pick({
          id: true,
          name: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        })
        .extend({
          owner: z.object({ id: z.cuid(), username: z.string() }),
          staffCount: z.number(),
        }),
    ),
    pagination: paginationOutput,
  })
  export type AllVendorsOutput = z.infer<typeof allVendorsOutput>

  export const oneVendorInput = vendorSchema.pick({ id: true })
  export type OneVendorInput = z.infer<typeof oneVendorInput>
  export const oneVendorOutput = vendorSchema.omit({ ownerId: true })
  export type OneVendorOutput = z.infer<typeof oneVendorOutput>

  export const createVendorInput = vendorSchema.pick({
    name: true,
    description: true,
    address: true,
    image: true,
    ownerId: true,
  })
  export type CreateVendorInput = z.infer<typeof createVendorInput>
  export const createVendorOutput = vendorSchema.pick({ id: true })
  export type CreateVendorOutput = z.infer<typeof createVendorOutput>

  export const updateVendorStatusInput = vendorSchema
    .pick({ id: true, status: true })
    .extend({ userId: vendorSchema.shape.ownerId })
  export type UpdateVendorStatusInput = z.infer<typeof updateVendorStatusInput>
  export const updateVendorStatusOutput = vendorSchema.pick({ id: true })
  export type UpdateVendorStatusOutput = z.infer<
    typeof updateVendorStatusOutput
  >

  export const updateVendorInput = vendorSchema.omit({
    ownerId: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  })
  export type UpdateVendorInput = z.infer<typeof updateVendorInput>
  export const updateVendorOutput = vendorSchema.pick({ id: true })
  export type UpdateVendorOutput = z.infer<typeof updateVendorOutput>

  export const deleteVendorInput = vendorSchema
    .pick({ id: true })
    .extend({ userId: vendorSchema.shape.ownerId })
  export type DeleteVendorInput = z.infer<typeof deleteVendorInput>
  export const deleteVendorOutput = vendorSchema.pick({ id: true })
  export type DeleteVendorOutput = z.infer<typeof deleteVendorOutput>
  //#endregion

  //#region Vendor Staff
  export const allVendorStaffInput = vendorSchema.pick({ id: true })
  export type AllVendorStaffInput = z.infer<typeof allVendorStaffInput>
  export const allVendorStaffOutput = z.object({
    staff: z.array(
      vendorStaffSchema.extend({
        user: z.object({ id: z.cuid(), username: z.string() }),
      }),
    ),
  })
  export type AllVendorStaffOutput = z.infer<typeof allVendorStaffOutput>

  export const inviteVendorStaffInput = vendorStaffSchema
    .pick({ vendorId: true })
    .extend({ email: z.email('Invalid email address') })
  export type InviteVendorStaffInput = z.infer<typeof inviteVendorStaffInput>
  export const inviteVendorStaffOutput = vendorStaffSchema.pick({
    userId: true,
  })
  export type InviteVendorStaffOutput = z.infer<typeof inviteVendorStaffOutput>

  export const acceptVendorStaffInvitationInput = vendorStaffSchema.pick({
    token: z.string(),
    userId: true,
  })
  export type AcceptVendorStaffInvitationInput = z.infer<
    typeof acceptVendorStaffInvitationInput
  >
  export const acceptVendorStaffInvitationOutput = vendorStaffSchema.pick({
    assignedAt: true,
  })
  export type AcceptVendorStaffInvitationOutput = z.infer<
    typeof acceptVendorStaffInvitationOutput
  >

  export const removeVendorStaffInput = vendorStaffSchema.pick({
    vendorId: true,
    userId: true,
  })
  export type RemoveVendorStaffInput = z.infer<typeof removeVendorStaffInput>
  export const removeVendorStaffOutput = vendorStaffSchema.pick({
    userId: true,
  })
  export type RemoveVendorStaffOutput = z.infer<typeof removeVendorStaffOutput>
  //#endregion Vendor Staff
}
