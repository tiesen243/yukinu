import * as z from 'zod'

import { priceRegex } from '@/shared/schema'

export namespace SaveProductDto {
  export const input = z.object({
    id: z.cuid2().optional(),
    vendorId: z.cuid2().nullable(),
    categoryId: z.cuid2().nullable(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: priceRegex,
    stock: z.number().default(0),
    images: z
      .array(z.url('Invalid image URL'))
      .min(1, 'At least one image is required'),
    attributes: z.array(
      z.object({
        name: z.string().min(1, 'Attribute name is required'),
        value: z.string().min(1, 'Attribute value is required'),
      }),
    ),
    variants: z.array(
      z.object({
        name: z.string().min(1, 'Variant name is required'),
        options: z
          .array(z.string())
          .min(2, 'At least two options are required for a variant'),
      }),
    ),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.cuid2() })
  export type Output = z.infer<typeof output>
}
