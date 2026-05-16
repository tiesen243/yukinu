import * as z from 'zod'

export namespace ForgotPasswordDto {
  export const input = z.object({
    email: z.email('Invalid email address'),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    id: z.string().min(1),
  })
  export type Output = z.infer<typeof output>
}
