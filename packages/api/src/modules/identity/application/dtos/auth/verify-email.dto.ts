import * as z from 'zod'

export namespace VerifyEmailDto {
  export const input = z.object({
    token: z.string().min(1),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    userId: z.string().min(1),
  })
  export type Output = z.infer<typeof output>
}
