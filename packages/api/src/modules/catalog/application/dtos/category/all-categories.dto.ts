import * as z from 'zod'

import { CategoryEntity } from '@/modules/catalog/domain/entities/category.entity'
import { Pagination } from '@/shared/schema'

export namespace AllCategoriesDto {
  export const input = Pagination.input.extend({
    search: z.string().optional(),
    isTopLevelOnly: z.boolean().optional(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    categories: z.array(z.instanceof(CategoryEntity)),
    pagination: Pagination.output,
  })
  export type Output = z.infer<typeof output>
}
