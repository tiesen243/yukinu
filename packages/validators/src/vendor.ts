import * as z from 'zod'

export namespace VendorValidators {
  export const vendorStatus = ['pending', 'approved', 'suspended'] as const
  export type VendorStatus = (typeof vendorStatus)[number]

  export const vendor = z.object({
    id: z.cuid(),
    ownerId: z.cuid(),
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    image: z.url(),
    address: z.string().min(1).max(500),
    status: z.enum(vendorStatus),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  export type Vendor = z.infer<typeof vendor>

  export const vendorStaff = z.object({
    vendorId: z.cuid(),
    userId: z.cuid(),
  })
  export type VendorStaff = z.infer<typeof vendorStaff>

  export const getVendorsInput = z.object({
    search: z.string().optional(),
    status: z.enum(vendorStatus).optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  })
  export type GetVendorsInput = z.infer<typeof getVendorsInput>
  export const getVendorsOutput = z.object({
    vendors: z.array(vendor),
    pagination: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
    }),
  })
  export type GetVendorsOutput = z.infer<typeof getVendorsOutput>

  export const getVendorInput = z.object({ id: z.cuid() })
  export type GetVendorInput = z.infer<typeof getVendorInput>
  export const getVendorOutput = vendor.extend({
    staffs: z.array(z.object({ userId: z.cuid(), username: z.string() })),
  })
  export type GetVendorOutput = z.infer<typeof getVendorOutput>

  export const createVendorInput = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().optional(),
    image: z.url('Invalid image URL'),
    address: z.string().min(1, 'Address is required').max(500),
  })
  export type CreateVendorInput = z.infer<typeof createVendorInput>
  export const createVendorOutput = z.object({ id: z.cuid() })
  export type CreateVendorOutput = z.infer<typeof createVendorOutput>

  export const updateVendorStatusInput = z.object({
    id: z.cuid(),
    status: z.enum(vendorStatus),
  })
  export type UpdateVendorStatusInput = z.infer<typeof updateVendorStatusInput>
  export const updateVendorStatusOutput = z.object({ id: z.cuid() })
  export type UpdateVendorStatusOutput = z.infer<
    typeof updateVendorStatusOutput
  >

  export const updateVendorInput = createVendorInput.extend({
    id: z.cuid(),
  })
  export type UpdateVendorInput = z.infer<typeof updateVendorInput>
  export const updateVendorOutput = z.object({ id: z.cuid() })
  export type UpdateVendorOutput = z.infer<typeof updateVendorOutput>

  export const addStaffInput = z.object({
    vendorId: z.cuid(),
    userId: z.cuid(),
  })
  export type AddStaffInput = z.infer<typeof addStaffInput>
  export const addStaffOutput = z.void()
  export type AddStaffOutput = z.infer<typeof addStaffOutput>

  export const removeStaffInput = z.object({
    vendorId: z.cuid(),
    userId: z.cuid(),
  })
  export type RemoveStaffInput = z.infer<typeof removeStaffInput>
  export const removeStaffOutput = z.void()
  export type RemoveStaffOutput = z.infer<typeof removeStaffOutput>
}
