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
    price: z.coerce.string(),
    stock: z.number().min(0),
    status: z.enum(productStatuses),
    minPrice: z.coerce.string().min(0).nullable(),
    maxPrice: z.coerce.string().min(0).nullable(),
    averageRating: z.number().min(0).max(5).nullable(),
  })
  export type ProductView = z.infer<typeof productView>
  //#endregion

  //#region All Products Schema
  export const allInput = paginationInputSchema.extend({
    search: z.string().optional().default(''),
    vendorId: z.cuid2('Invalid vendor ID').optional(),
  })
  export type AllInput = z.infer<typeof allInput>

  export const allOutput = z.object({
    products: z.array(productView),
    pagination: paginationOutputSchema,
  })
  export type AllOutput = z.infer<typeof allOutput>
  //#endregion

  //#region One Product Schema
  export const oneInput = z.object({
    productId: z.cuid2('Invalid product ID'),
  })
  export type OneInput = z.infer<typeof oneInput>

  export const oneOutput = z.object({
    id: z.cuid2(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.coerce.string(),
    stock: z.number().min(0),
    status: z.enum(productStatuses),

    vendor: z.object({
      id: z.cuid2(),
      name: z.string(),
    }),

    category: z.object({
      id: z.cuid2(),
      name: z.string(),
    }),

    images: z.array(
      z.object({
        url: z.url(),
        alt: z.string().nullable(),
      }),
    ),

    variantGroups: z.array(
      z.object({
        id: z.cuid2(),
        name: z.string(),
        variants: z.array(
          z.object({
            id: z.cuid2(),
            name: z.string(),
            extraPrice: z.coerce.string().min(0),
            stock: z.number().min(0),
          }),
        ),
      }),
    ),
  })
  export type OneOutput = z.infer<typeof oneOutput>
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
    price: z.coerce.string().min(1, 'Price is required'),
    stock: z.number().min(0, 'Stock must be at least 0'),

    images: z.array(
      z.object({
        url: z.url('Invalid image URL'),
        alt: z
          .string()
          .min(1, 'Image alt is required')
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
            extraPrice: z.coerce
              .string()
              .min(1, 'Variant extra price is required'),
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

  //#region Update Product Schema
  export const updateInput = createInput.omit({ vendorId: true }).extend({
    productId: z.cuid2('Invalid product ID'),
  })
  export type UpdateInput = z.infer<typeof updateInput>

  export const updateOutput = z.object({ productId: productView.shape.id })
  export type UpdateOutput = z.infer<typeof updateOutput>
  //#endregion
}
