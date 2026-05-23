import * as z from 'zod'

export namespace SaveCategoryDto {
  export const input = z.object({
    id: z.cuid2().optional(),
    name: z
      .string()
      .min(1, 'Name is required')
      .max(255, 'Name must be less than 255 characters'),
    description: z.string().optional(),
    image: z.url().optional(),
    parentId: z.cuid2().nullable(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.cuid2() })
  export type Output = z.infer<typeof output>
}
