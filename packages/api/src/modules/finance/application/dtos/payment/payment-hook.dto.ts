import * as z from 'zod'

export namespace PaymentHookDto {
  export const input = z.object({
    gateway: z.string(),
    transactionDate: z.string(),
    accountNumber: z.string(),
    subAccount: z.string().optional(),
    code: z.string(),
    content: z.string(),
    transferType: z.enum(['in', 'out']),
    description: z.string(),
    transferAmount: z.number(),
    referenceCode: z.string(),
    accumulated: z.number(),
    id: z.number(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.void()
  export type Output = z.infer<typeof output>
}
