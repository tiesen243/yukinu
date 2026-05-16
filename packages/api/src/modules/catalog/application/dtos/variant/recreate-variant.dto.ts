import * as z from 'zod'

import { SaveProductDto } from '@/modules/catalog/application/dtos/product/save-product.dto'

export namespace RecreateVariantDto {
  export const input = z.object({
    id: z.cuid2(),
    vendorId: z.cuid2(),
    variants: SaveProductDto.input.shape.variants.min(
      1,
      'At least one variant is required',
    ),
  })

  export type Input = z.infer<typeof input>

  export const output = z.void()
  export type Output = z.infer<typeof output>
}
