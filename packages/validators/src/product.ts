import {
  attributes,
  productAttributes,
  productImages,
  productReviews,
  products,
  productVariants,
  variantOptions,
  variants,
} from '@yukinu/db/schema'
import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

import { userSchema } from '@/auth'
import { categorySchema } from '@/general'
import { currencySchema, paginationInput, paginationOutput } from '@/shared'
import { vendorSchema } from '@/vendor'

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
  price: z
    .string()
    .regex(/^(?:\d{1,8})(?:\.\d{1,2})?$/, 'Invalid price format'),
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
  id: z.int().min(1000),
  variantId: z.cuid(),
})
export type VariantOptionSchema = z.infer<typeof variantOptionSchema>

export const productVariantSchema = createSelectSchema(productVariants, {
  id: z.cuid(),
  productId: z.cuid(),
  price: currencySchema,
})
export type ProductVariantSchema = z.infer<typeof productVariantSchema>

export const productPreviewSchema = createSelectSchema(productReviews, {
  id: z.cuid(),
  productId: z.cuid(),
  userId: z.cuid(),
  rating: (schema) => schema.min(1).max(5).default(5),
})
export type ReviewSchema = z.infer<typeof productPreviewSchema>

/* --------------------------------------------------------------------------
 * Contract schemas for service inputs and outputs
 * --------------------------------------------------------------------------
 */

export const allInput = paginationInput.extend({
  search: z.string().nullable(),
  categoryId: z.cuid().nullable(),
  vendorId: z.cuid().nullable(),
  orderBy: z.enum(orderBy).nullable(),
  isDeleted: z.boolean().default(false),
})
export type AllInput = z.infer<typeof allInput>
export const allOutput = z.object({
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
export type AllOutput = z.infer<typeof allOutput>

export const oneInput = productSchema.pick({ id: true })
export type OneInput = z.infer<typeof oneInput>
export const oneOutput = productSchema
  .omit({ vendorId: true, categoryId: true, deletedAt: true })
  .extend({
    category: categorySchema.pick({ id: true, name: true }).nullable(),
    vendor: vendorSchema
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
            value: variantOptionSchema.shape.value,
          }),
        ),
      }),
    ),
    reviews: z.array(
      productPreviewSchema
        .omit({ productId: true, userId: true, createdAt: true })
        .extend({
          user: userSchema.pick({ id: true, username: true, image: true }),
          createdAt: z.coerce.date().transform((d) => new Date(d)),
        }),
    ),
  })
export type OneOutput = z.infer<typeof oneOutput>

export const createInput = productSchema
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
    attributes: z.array(
      z.object({
        name: attributeSchema.shape.name,
        value: productAttributeSchema.shape.value,
      }),
    ),
    variants: z.array(
      z.object({
        name: variantSchema.shape.name,
        options: z
          .array(variantOptionSchema.shape.value)
          .nonempty('At least one option is required'),
      }),
    ),
  })
export type CreateInput = z.infer<typeof createInput>
export const createOutput = productSchema.pick({ id: true })
export type CreateOutput = z.infer<typeof createOutput>

export const updateInput = createInput
  .omit({ variants: true })
  .extend({ id: productSchema.shape.id })
export type UpdateInput = z.infer<typeof updateInput>
export const updateOutput = productSchema.pick({ id: true })
export type UpdateOutput = z.infer<typeof updateOutput>

export const deleteInput = productSchema.pick({
  id: true,
  vendorId: true,
})
export type DeleteInput = z.infer<typeof deleteInput>
export const deleteOutput = productSchema.pick({ id: true })
export type DeleteOutput = z.infer<typeof deleteOutput>

export const restoreInput = productSchema.pick({
  id: true,
  vendorId: true,
})
export type RestoreInput = z.infer<typeof restoreInput>
export const restoreOutput = productSchema.pick({ id: true })
export type RestoreOutput = z.infer<typeof restoreOutput>

export const permanentlyDeleteInput = productSchema.pick({
  id: true,
  vendorId: true,
})
export type PermanentlyDeleteInput = z.infer<typeof permanentlyDeleteInput>
export const permanentlyDeleteOutput = productSchema.pick({ id: true })
export type PermanentlyDeleteOutput = z.infer<typeof permanentlyDeleteOutput>

export const recreateVariantInput = createInput
  .pick({ variants: true, vendorId: true })
  .extend({ id: productSchema.shape.id })
export type RecreateVariantInput = z.infer<typeof recreateVariantInput>
export const recreateVariantOutput = productSchema.pick({ id: true })
export type RecreateVariantOutput = z.infer<typeof recreateVariantOutput>

export const updateVariantInput = productVariantSchema
  .omit({ productId: true, sku: true })
  .extend({ vendorId: z.cuid() })
export type UpdateVariantInput = z.infer<typeof updateVariantInput>
export const updateVariantOutput = productVariantSchema.pick({
  id: true,
})
export type UpdateVariantOutput = z.infer<typeof updateVariantOutput>

export const deleteVariantInput = productVariantSchema
  .pick({ id: true })
  .extend({ vendorId: z.cuid() })
export type DeleteVariantInput = z.infer<typeof deleteVariantInput>
export const deleteVariantOutput = productVariantSchema.pick({
  id: true,
})
export type DeleteVariantOutput = z.infer<typeof deleteVariantOutput>
