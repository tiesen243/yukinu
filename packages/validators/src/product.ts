import * as z from 'zod'

export namespace ProductValidators {
  const numeric = z.string().regex(/^\d+(\.\d+)?$/)

  export const product = z.object({
    id: z.cuid(),
    vendorId: z.cuid(),
    categoryId: z.cuid(),
    name: z.string().min(1).max(255),
    description: z.string().nullable(),
    price: numeric,
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  export type Product = z.infer<typeof product>

  export const productImage = z.object({
    id: z.cuid(),
    productId: z.cuid(),
    url: z.url(),
  })
  export type Image = z.infer<typeof productImage>

  export const productAttribute = z.object({
    id: z.cuid(),
    productId: z.cuid(),
    key: z.string().min(1).max(100),
    value: z.string().min(1).max(255),
  })
  export type Attribute = z.infer<typeof productAttribute>

  export const productVariant = z.object({
    id: z.cuid(),
    productId: z.cuid(),
    name: z.string().min(1).max(100),
  })
  export type Variant = z.infer<typeof productVariant>

  export const productVariantOption = z.object({
    id: z.int().min(1000),
    variantId: z.cuid(),
    value: z.string().min(1).max(100),
  })
  export type VariantOption = z.infer<typeof productVariantOption>

  export const productVariantCombination = z.object({
    id: z.cuid(),
    productId: z.cuid(),
    sku: z.string().min(1).max(50),
    price: numeric,
    stock: z.number().min(0),
  })
  export type VariantCombination = z.infer<typeof productVariantCombination>

  export const productReview = z.object({
    id: z.cuid(),
    productId: z.cuid(),
    userId: z.cuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  export type Review = z.infer<typeof productReview>

  export const allInput = z.object({
    search: z.string().optional(),
    categoryId: z.cuid().optional(),
    vendorId: z.cuid().optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
    isDeleted: z.boolean().default(false),
  })
  export type AllInput = z.infer<typeof allInput>
  export const allOutput = z.object({
    products: z.array(
      product.pick({ id: true, name: true, price: true }).extend({
        image: z.url().nullable(),
        lowestVariantPrice: numeric.nullable(),
        highestVariantPrice: numeric.nullable(),
      }),
    ),
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
  export const oneOutput = product
    .omit({ categoryId: true, vendorId: true, updatedAt: true })
    .extend({
      category: z.object({ id: z.cuid(), name: z.string() }).nullable(),
      vendor: z.object({
        id: z.cuid(),
        name: z.string(),
        image: z.url().nullable(),
        createdAt: z.date(),
      }),
      images: z.array(productImage.omit({ productId: true })),
      reviews: z.array(
        productReview.pick({ id: true, rating: true, createdAt: true }).extend({
          user: z.object({
            id: z.cuid(),
            username: z.string(),
            image: z.url().nullable(),
          }),
        }),
      ),
    })
  export type OneOutput = z.infer<typeof oneOutput>

  export const createInput = product
    .omit({ id: true, createdAt: true, updatedAt: true })
    .extend({
      attributes: z.array(
        z.object({
          name: z.string().min(1).max(100),
          value: z.string().min(1).max(255),
        }),
      ),
    })
  export type CreateInput = z.infer<typeof createInput>
  export const createOutput = z.object({ id: z.cuid() })
  export type CreateOutput = z.infer<typeof createOutput>

  export const updateInput = createInput.extend({ id: z.cuid() })
  export type UpdateInput = z.infer<typeof updateInput>
  export const updateOutput = z.object({ id: z.cuid() })
  export type UpdateOutput = z.infer<typeof updateOutput>

  export const deleteInput = z.object({ id: z.cuid(), vendorId: z.cuid() })
  export type DeleteInput = z.infer<typeof deleteInput>
  export const deleteOutput = z.object({ id: z.cuid() })
  export type DeleteOutput = z.infer<typeof deleteOutput>

  export const restoreInput = z.object({ id: z.cuid(), vendorId: z.cuid() })
  export type RestoreInput = z.infer<typeof restoreInput>
  export const restoreOutput = z.object({ id: z.cuid() })
  export type RestoreOutput = z.infer<typeof restoreOutput>
}
