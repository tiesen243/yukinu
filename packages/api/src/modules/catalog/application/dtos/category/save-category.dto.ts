import * as z from 'zod'

export namespace SaveCategoryDto {
  export const input = z.object({
    id: z.cuid2().optional(),
    name: z.string(),
    description: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    parentId: z.cuid2().nullable().optional(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.cuid2() })
  export type Output = z.infer<typeof output>
}
