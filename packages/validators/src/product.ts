import * as z from 'zod'

export namespace ProductValidators {
  export const product = z.object({
    id: z.cuid(),
    vendorId: z.cuid(),
    categoryId: z.cuid(),
    sku: z.string().min(1).max(50),
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    price: z.number().min(0),
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

  export const productVariant = z.object({
    id: z.cuid(),
    productId: z.cuid(),
    name: z.string().min(1).max(100),
  })
  export type Variant = z.infer<typeof productVariant>

  export const productVariantOption = z.object({
    id: z.cuid(),
    variantId: z.cuid(),
    value: z.string().min(1).max(100),
    stock: z.number().min(0),
    extraPrice: z.number().min(0),
  })
  export type VariantOption = z.infer<typeof productVariantOption>

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
  })
  export type AllInput = z.infer<typeof allInput>
  export const allOutput = z.object({
    products: z.array(
      product.pick({ id: true, name: true, price: true }).extend({
        image: z.url(),
        lowestVariantPrice: z.number().min(0),
        highestVariantPrice: z.number().min(0),
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
  export const oneOutput = product.extend({
    images: z.array(productImage),
    variants: z.array(
      productVariant.extend({ options: z.array(productVariantOption) }),
    ),
    reviews: z.array(productReview),
  })
  export type OneOutput = z.infer<typeof oneOutput>

  export const createInput = z.object({
    vendorId: z.cuid(),
    categoryId: z.cuid(),
    sku: z.string().min(1, 'SKU is required').max(50),
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().optional(),
    price: z.number().min(0, 'Price must be at least 0'),

    images: z.array(z.url()),

    variants: z.array(
      z.object({
        name: z.string().min(1, 'Variant name is required').max(100),
        options: z.array(
          z.object({
            value: z.string().min(1, 'Option value is required').max(100),
            stock: z.number().min(0, 'Stock must be at least 0'),
            extraPrice: z.number().min(0, 'Extra price must be at least 0'),
          }),
        ),
      }),
    ),
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
