import * as z from 'zod'

export namespace CategoryValidators {
  export const category = z.object({
    id: z.cuid(),
    name: z.string().min(1).max(255),
    image: z.url().nullable(),
    description: z.string().nullable(),
  })
  export type Category = z.infer<typeof category>

  export const allInput = z.object({
    search: z.string().optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  })
  export type AllInput = z.infer<typeof allInput>
  export const allOutput = z.object({
    categories: z.array(category),
    pagination: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
    }),
  })
  export type AllOutput = z.infer<typeof allOutput>

  export const oneInput = z.object({ id: z.cuid() })
  export type OneInput = z.infer<typeof oneInput>
  export const oneOutput = category
  export type OneOutput = z.infer<typeof oneOutput>

  export const createInput = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().nullable(),
    image: z.url('Invalid image URL').nullable(),
  })
  export type CreateInput = z.infer<typeof createInput>
  export const createOutput = z.object({ id: z.cuid() })
  export type CreateOutput = z.infer<typeof createOutput>

  export const updateInput = createInput.extend({
    id: z.cuid(),
  })
  export type UpdateInput = z.infer<typeof updateInput>
  export const updateOutput = z.object({ id: z.cuid() })
  export type UpdateOutput = z.infer<typeof updateOutput>

  export const deleteInput = z.object({ id: z.cuid() })
  export type DeleteInput = z.infer<typeof deleteInput>
  export const deleteOutput = z.object({ id: z.cuid() })
  export type DeleteOutput = z.infer<typeof deleteOutput>
}
