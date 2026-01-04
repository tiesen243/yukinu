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

export const productSchema = z.object({
  id: z.cuid(),
  vendorId: z.cuid().nullable(),
  categoryId: z.cuid().nullable(),
  name: z.string().max(255, 'Name must be at most 255 characters long'),
  description: z.string().nullable(),
  price: currencySchema,
  stock: z.number().int().min(0).default(0),
  sold: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
})
export type ProductSchema = z.infer<typeof productSchema>

export const productImageSchema = z.object({
  id: z.cuid(),
  productId: z.cuid(),
  url: z
    .url('Invalid image URL')
    .max(500, 'Image URL must be at most 500 characters long'),
})
export type ProductImageSchema = z.infer<typeof productImageSchema>

export const attributeSchema = z.object({
  id: z.cuid(),
  name: z
    .string()
    .max(100, 'Attribute name must be at most 100 characters long'),
})
export type AttributeSchema = z.infer<typeof attributeSchema>

export const productAttributeSchema = z.object({
  productId: z.cuid(),
  attributeId: z.cuid(),
  value: z
    .string()
    .max(255, 'Attribute value must be at most 255 characters long'),
})
export type ProductAttributeSchema = z.infer<typeof productAttributeSchema>

export const variantSchema = z.object({
  id: z.cuid(),
  name: z.string().max(100, 'Variant name must be at most 100 characters long'),
})
export type VariantSchema = z.infer<typeof variantSchema>

export const variantOptionSchema = z.object({
  id: z.int().min(1000),
  variantId: z.cuid(),
  value: z
    .string()
    .max(100, 'Variant option must be at most 100 characters long'),
})
export type VariantOptionSchema = z.infer<typeof variantOptionSchema>

export const productVariantSchema = z.object({
  id: z.cuid(),
  productId: z.cuid(),
  sku: z.string().max(100, 'SKU must be at most 100 characters long'),
  price: currencySchema,
  stock: z.number().int().min(0).default(0),
})
export type ProductVariantSchema = z.infer<typeof productVariantSchema>

export const productPreviewSchema = z.object({
  id: z.cuid(),
  productId: z.cuid(),
  userId: z.cuid(),
  rating: z
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: z.string().max(1000, 'Comment must be at most 1000 characters long'),
  createdAt: z.date(),
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
