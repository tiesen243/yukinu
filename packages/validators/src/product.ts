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
  export type ProductImage = z.infer<typeof productImage>

  export const productVariant = z.object({
    id: z.cuid(),
    productId: z.cuid(),
    name: z.string().min(1).max(100),
  })
  export type ProductVariant = z.infer<typeof productVariant>

  export const productVariantOption = z.object({
    id: z.cuid(),
    variantId: z.cuid(),
    value: z.string().min(1).max(100),
    stock: z.number().min(0),
    extraPrice: z.number().min(0),
  })
  export type ProductVariantOption = z.infer<typeof productVariantOption>

  export const productReview = z.object({
    id: z.cuid(),
    productId: z.cuid(),
    userId: z.cuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  export type ProductReview = z.infer<typeof productReview>

  export const getProductsInput = z.object({
    search: z.string().optional(),
    categoryId: z.cuid().optional(),
    vendorId: z.cuid().optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  })
  export type GetProductsInput = z.infer<typeof getProductsInput>
  export const getProductsOutput = z.object({
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
  export type GetProductsOutput = z.infer<typeof getProductsOutput>

  export const getProductInput = z.object({ id: z.cuid() })
  export type GetProductInput = z.infer<typeof getProductInput>
  export const getProductOutput = product.extend({
    images: z.array(productImage),
    variants: z.array(
      productVariant.extend({ options: z.array(productVariantOption) }),
    ),
    reviews: z.array(productReview),
  })
  export type GetProductOutput = z.infer<typeof getProductOutput>

  export const createProductInput = z.object({
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
  export type CreateProductInput = z.infer<typeof createProductInput>
  export const createProductOutput = z.object({ id: z.cuid() })
  export type CreateProductOutput = z.infer<typeof createProductOutput>

  export const updateProductInput = createProductInput.extend({
    id: z.cuid(),
  })
  export type UpdateProductInput = z.infer<typeof updateProductInput>
  export const updateProductOutput = z.object({ id: z.cuid() })
  export type UpdateProductOutput = z.infer<typeof updateProductOutput>

  export const deleteProductInput = z.object({ id: z.cuid() })
  export type DeleteProductInput = z.infer<typeof deleteProductInput>
  export const deleteProductOutput = z.object({ id: z.cuid() })
  export type DeleteProductOutput = z.infer<typeof deleteProductOutput>
}
