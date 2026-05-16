import * as z from 'zod'

import { CategoryEntity } from '@/modules/catalog/domain/entities/category.entity'

export namespace OneCategoryDto {
  export const input = z.object({ id: z.cuid2() })
  export type Input = z.infer<typeof input>

  export const output = z.instanceof(CategoryEntity)
  export type Output = z.infer<typeof output>
}
