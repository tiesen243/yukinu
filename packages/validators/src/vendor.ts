import * as z from 'zod'

import { currencySchema, paginationInput, paginationOutput } from '@/shared'

/* --------------------------------------------------------------------------
 * Convert Drizzle ORM schemas to Zod schemas for validation
 * --------------------------------------------------------------------------
 */

export const vendorStatuses = ['pending', 'approved', 'suspended'] as const
export type VendorStatus = (typeof vendorStatuses)[number]

export const vendorSchema = z.object({
  id: z.cuid(),
  ownerId: z.cuid(),
  name: z.string().max(255, 'Name must be at most 255 characters long'),
  description: z.string().nullable(),
  address: z
    .string()
    .max(500, 'Address must be at most 500 characters long')
    .nullable(),
  image: z
    .url('Invalid image URL')
    .max(500, 'Image URL must be at most 500 characters long')
    .nullable(),
  contact: z
    .string()
    .max(100, 'Contact must be at most 100 characters long')
    .nullable(),
  payoutBankName: z
    .string()
    .max(50, 'Payout bank code must be at most 50 characters long')
    .nullable(),
  payoutAccountName: z
    .string()
    .max(255, 'Payout account name must be at most 255 characters long')
    .nullable(),
  payoutAccountNumber: z
    .string()
    .max(100, 'Payout account number must be at most 100 characters long')
    .nullable(),
  status: z.enum(vendorStatuses).default('pending'),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type VendorSchema = z.infer<typeof vendorSchema>

export const vendorStaffSchema = z.object({
  vendorId: z.cuid(),
  userId: z.cuid(),
  assignedAt: z.date(),
})
export type VendorStaffSchema = z.infer<typeof vendorStaffSchema>

export const VendorBalanceSchema = z.object({
  vendorId: z.cuid(),
  balance: currencySchema,
  updatedAt: z.date(),
})
export type VendorBalanceSchema = z.infer<typeof VendorBalanceSchema>

export const vendorTransferSchema = z.object({
  id: z.cuid(),
  vendorId: z.cuid(),
  reference: z.string().max(100, 'Reference must be at most 100 characters'),
  amountIn: currencySchema,
  amountOut: currencySchema,
  createdAt: z.date(),
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
export type UpdateVendorStatusOutput = z.infer<typeof updateVendorStatusOutput>

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
export const allStaffsInput = vendorSchema.pick({ id: true })
export type AllStaffsInput = z.infer<typeof allStaffsInput>
export const allStaffsOutput = z.array(
  vendorStaffSchema
    .omit({ userId: true, vendorId: true })
    .extend({ id: z.cuid(), username: z.string(), email: z.email() }),
)
export type AllStaffsOutput = z.infer<typeof allStaffsOutput>

export const inviteStaffInput = vendorStaffSchema
  .pick({ vendorId: true })
  .extend({ email: z.email('Invalid email address') })
export type InviteStaffInput = z.infer<typeof inviteStaffInput>
export const inviteStaffOutput = vendorStaffSchema.pick({
  userId: true,
})
export type InviteStaffOutput = z.infer<typeof inviteStaffOutput>

export const acceptStaffInvitationInput = vendorStaffSchema
  .pick({ userId: true })
  .extend({ token: z.string() })
export type AcceptStaffInvitationInput = z.infer<
  typeof acceptStaffInvitationInput
>
export const acceptStaffInvitationOutput = vendorStaffSchema.pick({
  userId: true,
})
export type AcceptStaffInvitationOutput = z.infer<
  typeof acceptStaffInvitationOutput
>

export const removeStaffInput = vendorStaffSchema.pick({
  vendorId: true,
  userId: true,
})
export type RemoveStaffInput = z.infer<typeof removeStaffInput>
export const removeStaffOutput = vendorStaffSchema.pick({
  userId: true,
})
export type RemoveStaffOutput = z.infer<typeof removeStaffOutput>
//#endregion Vendor Staff
