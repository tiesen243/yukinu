import * as z from 'zod'

export namespace VendorValidator {
  export const vendorStatus = ['pending', 'approved', 'suspended'] as const
  export type VendorStatus = (typeof vendorStatus)[number]

  export const allParams = z.object({
    status: z.enum(vendorStatus).optional(),
    page: z.number().min(1, 'Page must be at least 1').default(1),
    limit: z.number().min(1, 'Limit must be at least 1').default(10),
  })
  export type AllParams = z.infer<typeof allParams>

  export const registerBody = z.object({
    name: z.string(),
    description: z.string().optional(),
    website: z.url().optional(),
  })
  export type RegisterBody = z.infer<typeof registerBody>

  export const approveBody = z.object({
    vendorId: z.cuid2(),
  })
  export type ApproveBody = z.infer<typeof approveBody>

  export const inviteBody = z.object({
    vendorId: z.cuid2(),
    email: z.email(),
  })
  export type InviteBody = z.infer<typeof inviteBody>
}
