import * as z from 'zod'

export namespace VendorValidators {
  export const statuses = ['pending', 'approved', 'suspended'] as const
  export type Status = (typeof statuses)[number]

  export const vendor = z.object({
    id: z.cuid(),
    ownerId: z.cuid().nullable(),
    name: z.string().min(1).max(255),
    description: z.string().nullable(),
    image: z.url().nullable(),
    address: z.string().min(1).max(500).nullable(),
    status: z.enum(statuses),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  export type Vendor = z.infer<typeof vendor>

  export const vendorStaff = z.object({
    vendorId: z.cuid(),
    userId: z.cuid(),
    assignedAt: z.date(),
  })
  export type VendorStaff = z.infer<typeof vendorStaff>

  export const allInput = z.object({
    search: z.string().optional(),
    status: z.enum(statuses).nullable(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  })
  export type AllInput = z.infer<typeof allInput>
  export const allOutput = z.object({
    vendors: z.array(
      vendor
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
    pagination: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
    }),
  })
  export type AllOutput = z.infer<typeof allOutput>

  export const oneInput = z.object({ id: z.cuid() })
  export type OneInput = z.infer<typeof oneInput>
  export const oneOutput = vendor.omit({ ownerId: true }).extend({
    owner: z.object({ id: z.cuid(), username: z.string() }),
    staffs: z.array(z.object({ id: z.cuid(), username: z.string() })),
  })
  export type OneOutput = z.infer<typeof oneOutput>

  export const createInput = z.object({
    ownerId: z.cuid(),
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().optional(),
    image: z.url('Invalid image URL').optional(),
    address: z.string().min(1, 'Address is required').max(500).optional(),
  })
  export type CreateInput = z.infer<typeof createInput>
  export const createOutput = z.object({ id: z.cuid() })
  export type CreateOutput = z.infer<typeof createOutput>

  export const updateStatusInput = z.object({
    id: z.cuid(),
    status: z.enum(statuses),
  })
  export type UpdateStatusInput = z.infer<typeof updateStatusInput>
  export const updateStatusOutput = z.object({ id: z.cuid() })
  export type UpdateStatusOutput = z.infer<typeof updateStatusOutput>

  export const updateInput = createInput
    .omit({ ownerId: true })
    .extend({ id: z.cuid() })
  export type UpdateInput = z.infer<typeof updateInput>
  export const updateOutput = z.object({ id: z.cuid() })
  export type UpdateOutput = z.infer<typeof updateOutput>

  export const allStaffsInput = z.object({
    vendorId: z.cuid(),
  })
  export type AllStaffsInput = z.infer<typeof allStaffsInput>
  export const allStaffsOutput = z.array(
    z.object({
      id: z.cuid(),
      username: z.string(),
      email: z.email(),
      assignedAt: z.date(),
    }),
  )
  export type AllStaffsOutput = z.infer<typeof allStaffsOutput>

  export const addStaffInput = z.object({
    vendorId: z.cuid(),
    email: z.email('Invalid email address'),
  })
  export type AddStaffInput = z.infer<typeof addStaffInput>
  export const addStaffOutput = z.void()
  export type AddStaffOutput = z.infer<typeof addStaffOutput>

  export const acceptStaffInvitationInput = z.object({
    token: z.string(),
  })
  export type AcceptStaffInvitationInput = z.infer<
    typeof acceptStaffInvitationInput
  >
  export const acceptStaffInvitationOutput = z.void()
  export type AcceptStaffInvitationOutput = z.infer<
    typeof acceptStaffInvitationOutput
  >

  export const removeStaffInput = z.object({
    vendorId: z.cuid(),
    staffId: z.cuid(),
  })
  export type RemoveStaffInput = z.infer<typeof removeStaffInput>
  export const removeStaffOutput = z.void()
  export type RemoveStaffOutput = z.infer<typeof removeStaffOutput>
}
