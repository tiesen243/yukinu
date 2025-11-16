import * as z from 'zod'

import { paginationInputSchema, paginationOutputSchema } from '@/lib/shared'

export namespace CategoryModels {
  //#region Category Schema
  export const category = z.object({
    id: z.cuid2('Invalid category ID'),
    name: z
      .string('Category name must be a string')
      .min(1, 'Category name cannot be empty'),
  })
  export type Category = z.infer<typeof category>
  //#endregion

  //#region All Categories Schema
  export const allInput = paginationInputSchema
  export type AllInput = z.infer<typeof allInput>

  export const allOutput = z.object({
    categories: z.array(category),
    pagination: paginationOutputSchema,
  })
  export type AllOutput = z.infer<typeof allOutput>
  //#endregion

  //#region One Category Schema
  export const oneInput = category.pick({ id: true })
  export type OneInput = z.infer<typeof oneInput>

  export const oneOutput = category
  export type OneOutput = z.infer<typeof oneOutput>
  //#endregion

  //#region Create Category Schema
  export const createInput = category.pick({ name: true })
  export type CreateInput = z.infer<typeof createInput>

  export const createOutput = z.object({ categoryId: category.shape.id })
  export type CreateOutput = z.infer<typeof createOutput>
  //#endregion

  //#region Update Category Schema
  export const updateInput = category
  export type UpdateInput = z.infer<typeof updateInput>

  export const updateOutput = z.object({ categoryId: category.shape.id })
  export type UpdateOutput = z.infer<typeof updateOutput>
  //#endregion

  //#region Delete Category Schema
  export const deleteInput = category.pick({ id: true })
  export type DeleteInput = z.infer<typeof deleteInput>

  export const deleteOutput = z.object({ categoryId: category.shape.id })
  export type DeleteOutput = z.infer<typeof deleteOutput>
  //#endregion
}
