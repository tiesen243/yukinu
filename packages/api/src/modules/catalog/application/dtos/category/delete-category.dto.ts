import * as z from 'zod'

export namespace DeleteCategoryDto {
  export const input = z.object({ id: z.cuid2() })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.cuid2() })
  export type Output = z.infer<typeof output>
}
