import * as z from 'zod'

export namespace AllStaffsDto {
  export const input = z.object({ id: z.cuid2() })
  export type Input = z.infer<typeof input>

  export const output = z.array(
    z.object({
      userId: z.cuid2(),
      username: z.string(),
      email: z.email(),
      assignedAt: z.date(),
    }),
  )
  export type Output = z.infer<typeof output>
}
