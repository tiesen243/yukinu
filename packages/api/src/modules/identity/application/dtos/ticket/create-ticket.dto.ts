import * as z from 'zod'

export namespace CreateTicketDto {
  export const input = z.object({
    userId: z.cuid2(),
    subject: z.string(),
    description: z.string(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.cuid2() })
  export type Output = z.infer<typeof output>
}
