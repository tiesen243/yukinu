import * as z from 'zod'

import { paginationInputSchema, paginationOutputSchema } from '@/lib/shared'

export namespace ProductModels {
  //#region Product View Schema
  export const productStatuses = ['active', 'inactive', 'out_of_stock'] as const
  export type ProductStatus = (typeof productStatuses)[number]

  export const productView = z.object({
    id: z.cuid2(),
    name: z.string(),
    imageUrl: z.url().nullable(),
    price: z.string(),
    stock: z.number().min(0),
    status: z.enum(productStatuses),
    minPrice: z.number().min(0).nullable(),
    maxPrice: z.number().min(0).nullable(),
    averageRating: z.number().min(0).max(5).nullable(),
  })
  export type ProductView = z.infer<typeof productView>
  //#endregion

  //#region All Products Schema
  export const allInput = paginationInputSchema.extend({
    search: z.string().optional().default(''),
  })
  export type AllInput = z.infer<typeof allInput>

  export const allOutput = z.object({
    products: z.array(productView),
    pagination: paginationOutputSchema,
  })
  export type AllOutput = z.infer<typeof allOutput>
  //#endregion

  //#region Create Product Schema
  export const createInput = z.object({
    vendorId: z.cuid2('Invalid vendor ID'),
    categoryId: z.cuid2('Invalid category ID'),
    name: z
      .string()
      .min(1, 'Product name must be at least 1 character long')
      .max(255, 'Product name must be at most 255 characters long'),
    description: z.string().optional(),
    price: z.number().min(0, 'Price must be at least 0'),
    stock: z.number().min(0, 'Stock must be at least 0'),

    images: z.array(
      z.object({
        url: z.url('Invalid image URL'),
        alt: z
          .string()
          .min(1, 'Imaga alt is required')
          .max(255, 'Image alt must be at most 255 characters long'),
      }),
    ),

    variantGroups: z.array(
      z.object({
        name: z
          .string()
          .min(1, 'Variant group name must be at least 1 character long')
          .max(100, 'Variant group name must be at most 100 characters long'),
        variants: z.array(
          z.object({
            name: z
              .string()
              .min(1, 'Variant name must be at least 1 character long')
              .max(100, 'Variant name must be at most 100 characters long'),
            extraPrice: z
              .number()
              .min(0, 'Variant extra price must be at least 0'),
            stock: z.number().min(0, 'Variant stock must be at least 0'),
          }),
        ),
      }),
    ),
  })
  export type CreateInput = z.infer<typeof createInput>

  export const createOutput = z.object({ productId: productView.shape.id })
  export type CreateOutput = z.infer<typeof createOutput>
  //#endregion
}
