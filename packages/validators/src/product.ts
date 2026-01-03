import {
  attributes,
  categories,
  productAttributes,
  productImages,
  productReviews,
  products,
  productVariants,
  variantOptions,
  variants,
  vendors,
} from '@yukinu/db/schema'
import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

import { paginationInput, paginationOutput } from '@/shared'

export namespace ProductValidators {
  /* --------------------------------------------------------------------------
   * Helper schemas
   * --------------------------------------------------------------------------
   */

  export const orderByField = ['name', 'price', 'sold', 'createdAt'] as const
  export type OrderByField = (typeof orderByField)[number]

  export const orderByDirections = ['asc', 'desc'] as const
  export type OrderByDirection = (typeof orderByDirections)[number]

  export const orderBy = orderByField.flatMap(
    (field) =>
      orderByDirections.map(
        (direction) => `${field}_${direction}`,
      ) as `${OrderByField}_${OrderByDirection}`[],
  )
  export type OrderBy = `${OrderByField}_${OrderByDirection}`

  /* --------------------------------------------------------------------------
   * Convert Drizzle ORM schemas to Zod schemas for validation
   * --------------------------------------------------------------------------
   */

  export const productSchema = createSelectSchema(products, {
    id: z.cuid(),
    vendorId: z.cuid().nullable(),
    categoryId: z.cuid().nullable(),
    description: (shema) => shema.min(1).max(2000),
    price: (schema) =>
      schema.regex(/^(?:\d{1,8})(?:\.\d{1,2})?$/, 'Invalid price format'),
  })
  export type ProductSchema = z.infer<typeof productSchema>

  export const productImageSchema = createSelectSchema(productImages, {
    id: z.cuid(),
    productId: z.cuid(),
    url: z.url('Invalid image URL'),
  })
  export type ProductImageSchema = z.infer<typeof productImageSchema>

  export const attributeSchema = createSelectSchema(attributes)
  export type AttributeSchema = z.infer<typeof attributeSchema>

  export const productAttributeSchema = createSelectSchema(productAttributes, {
    productId: z.cuid(),
    attributeId: z.cuid(),
  })
  export type ProductAttributeSchema = z.infer<typeof productAttributeSchema>

  export const variantSchema = createSelectSchema(variants, { id: z.cuid() })
  export type VariantSchema = z.infer<typeof variantSchema>

  export const variantOptionSchema = createSelectSchema(variantOptions, {
    id: z.number().min(1000),
    variantId: z.cuid(),
  })
  export type VariantOptionSchema = z.infer<typeof variantOptionSchema>

  export const productVariantSchema = createSelectSchema(productVariants, {
    id: z.cuid(),
    productId: z.cuid(),
    price: (schema) =>
      schema.regex(/^(?:\d{1,8})(?:\.\d{1,2})?$/, 'Invalid price format'),
  })
  export type ProductVariantSchema = z.infer<typeof productVariantSchema>

  export const productPreviewSchema = createSelectSchema(productReviews, {
    id: z.cuid(),
    productId: z.cuid(),
    userId: z.cuid(),
    rating: (schema) => schema.min(1).max(5),
  })
  export type ProductReviewSchema = z.infer<typeof productPreviewSchema>

  /* --------------------------------------------------------------------------
   * Contract schemas for service inputs and outputs
   * --------------------------------------------------------------------------
   */

  export const allProductsInput = paginationInput.extend({
    search: z.string().nullable(),
    categoryId: z.cuid().nullable(),
    vendorId: z.cuid().nullable(),
    orderBy: z.enum(orderBy).nullable(),
    isDeleted: z.boolean().default(false),
  })
  export type AllProductsInput = z.infer<typeof allProductsInput>
  export const allProductsOutput = z.object({
    category: z
      .object({
        id: z.cuid(),
        name: z.string(),
        description: z.string().nullable(),
        image: z.url().nullable(),
      })
      .nullable(),
    vendor: z
      .object({
        id: z.cuid(),
        name: z.string(),
        description: z.string().nullable(),
        image: z.url().nullable(),
      })
      .nullable(),
    products: z.array(
      productSchema
        .omit({ vendorId: true, categoryId: true, description: true })
        .extend({
          category: z.string().nullable(),
          image: z.url().nullable(),
          rating: z.string(),
        }),
    ),
    pagination: paginationOutput,
  })
  export type AllProductsOutput = z.infer<typeof allProductsOutput>

  export const oneProductInput = productSchema.pick({ id: true })
  export type OneProductInput = z.infer<typeof oneProductInput>
  export const oneProductOutput = productSchema
    .omit({ vendorId: true, categoryId: true, deletedAt: true })
    .extend({
      category: createSelectSchema(categories)
        .pick({ id: true, name: true })
        .nullable(),
      vendor: createSelectSchema(vendors)
        .pick({ id: true, name: true, image: true, address: true })
        .nullable(),
      images: z.array(productImageSchema.omit({ productId: true })),
      attributes: z.array(
        z.object({
          name: attributeSchema.shape.name,
          value: productAttributeSchema.shape.value,
        }),
      ),
      variants: z.array(
        productVariantSchema.omit({ productId: true }).extend({
          options: z.array(
            z.object({
              name: variantSchema.shape.name,
              value: variantOptionSchema.shape.id,
            }),
          ),
        }),
      ),
    })
  export type OneProductOutput = z.infer<typeof oneProductOutput>

  export const createProductInput = productSchema
    .pick({
      name: true,
      description: true,
      price: true,
      stock: true,
      vendorId: true,
      categoryId: true,
    })
    .extend({
      images: z
        .array(productImageSchema.shape.url)
        .nonempty('At least one image is required'),
      attributes: z
        .array(
          z.object({
            name: attributeSchema.shape.name,
            value: productAttributeSchema.shape.value,
          }),
        )
        .nonempty('At least one attribute is required'),
      variants: z.array(
        z.object({
          name: variantSchema.shape.name,
          options: z
            .array(variantOptionSchema.shape.value)
            .nonempty('At least one option is required'),
        }),
      ),
    })
  export type CreateProductInput = z.infer<typeof createProductInput>
  export const createProductOutput = productSchema.pick({ id: true })
  export type CreateProductOutput = z.infer<typeof createProductOutput>

  export const updateProductInput = createProductInput
    .omit({ variants: true })
    .extend({ id: productSchema.shape.id })
  export type UpdateProductInput = z.infer<typeof updateProductInput>
  export const updateProductOutput = productSchema.pick({ id: true })
  export type UpdateProductOutput = z.infer<typeof updateProductOutput>

  export const deleteProductInput = productSchema.pick({
    id: true,
    vendorId: true,
  })
  export type DeleteProductInput = z.infer<typeof deleteProductInput>
  export const deleteProductOutput = productSchema.pick({ id: true })
  export type DeleteProductOutput = z.infer<typeof deleteProductOutput>

  export const restoreProductInput = productSchema.pick({
    id: true,
    vendorId: true,
  })
  export type RestoreProductInput = z.infer<typeof restoreProductInput>
  export const restoreProductOutput = productSchema.pick({ id: true })
  export type RestoreProductOutput = z.infer<typeof restoreProductOutput>

  export const permanentlyDeleteProductInput = productSchema.pick({
    id: true,
    vendorId: true,
  })
  export type PermanentlyDeleteProductInput = z.infer<
    typeof permanentlyDeleteProductInput
  >
  export const permanentlyDeleteProductOutput = productSchema.pick({ id: true })
  export type PermanentlyDeleteProductOutput = z.infer<
    typeof permanentlyDeleteProductOutput
  >

  export const recreateProductVariantInput = createProductInput
    .pick({ variants: true, vendorId: true })
    .extend({ id: productSchema.shape.id })
  export type RecreateProductVariantInput = z.infer<
    typeof recreateProductVariantInput
  >
  export const recreateProductVariantOutput = productSchema.pick({ id: true })
  export type RecreateProductVariantOutput = z.infer<
    typeof recreateProductVariantOutput
  >

  export const updateProductVariantInput = productVariantSchema
    .omit({ productId: true, sku: true })
    .extend({ vendorId: z.cuid() })
  export type UpdateProductVariantInput = z.infer<
    typeof updateProductVariantInput
  >
  export const updateProductVariantOutput = productVariantSchema.pick({
    id: true,
  })
  export type UpdateProductVariantOutput = z.infer<
    typeof updateProductVariantOutput
  >

  export const deleteProductVariantInput = productVariantSchema
    .pick({ id: true })
    .extend({ vendorId: z.cuid() })
  export type DeleteProductVariantInput = z.infer<
    typeof deleteProductVariantInput
  >
  export const deleteProductVariantOutput = productVariantSchema.pick({
    id: true,
  })
  export type DeleteProductVariantOutput = z.infer<
    typeof deleteProductVariantOutput
  >
}
