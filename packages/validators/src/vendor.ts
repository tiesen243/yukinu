import * as z from 'zod'

export namespace VendorValidator {
  export const vendorStatus = ['pending', 'approved', 'suspended'] as const
  export type VendorStatus = (typeof vendorStatus)[number]

  export const allParams = z.object({
    status: z.enum(vendorStatus, 'Invalid vendor status').optional(),
    page: z.number().min(1, 'Page must be at least 1').default(1),
    limit: z.number().min(1, 'Limit must be at least 1').default(10),
  })
  export type AllParams = z.infer<typeof allParams>

  export const oneParams = z.object({
    vendorId: z.cuid2(),
  })
  export type OneParams = z.infer<typeof oneParams>

  export const registerBody = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters'),
    website: z.url().optional(),
  })
  export type RegisterBody = z.infer<typeof registerBody>

  export const updateBody = z.object({
    vendorId: z.cuid2(),
    status: z.enum(vendorStatus),
  })
  export type UpdateBody = z.infer<typeof updateBody>

  export const inviteBody = z.object({
    vendorId: z.cuid2(),
    email: z.email(),
  })
  export type InviteBody = z.infer<typeof inviteBody>
}
