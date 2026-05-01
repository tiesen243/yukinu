import * as z from 'zod'

import { SaveProductDto } from '@/modules/catalog/application/dtos/product/save-product.dto'

export namespace RecreateVariantDto {
  export const input = SaveProductDto.input.pick({
    id: true,
    vendorId: true,
    variants: true,
  })
  export type Input = z.infer<typeof input>

  export const output = z.void()
  export type Output = z.infer<typeof output>
}
