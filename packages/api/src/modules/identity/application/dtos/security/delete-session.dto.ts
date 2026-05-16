import * as z from 'zod'

export namespace DeleteSessionDto {
  export const input = z.object({ id: z.string(), userId: z.cuid2() })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.string() })
  export type Output = z.infer<typeof output>
}
