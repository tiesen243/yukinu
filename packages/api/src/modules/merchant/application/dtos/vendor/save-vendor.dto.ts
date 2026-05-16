import * as z from 'zod'

export namespace SaveVendorDto {
  export const input = z.object({
    id: z.cuid2().optional(),
    ownerId: z.cuid2(),
    name: z.string().max(255),
    description: z.string().optional(),
    image: z.url().max(500).optional(),
    address: z.string().max(500).optional(),
    contact: z.string().max(100).optional(),
    payoutBankName: z.string().max(50).optional(),
    payoutAccountName: z.string().max(255).optional(),
    payoutAccountNumber: z.string().max(100).optional(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.cuid2() })
  export type Output = z.infer<typeof output>
}
