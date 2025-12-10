import * as z from 'zod'

export namespace ProductValidators {
  const numeric = z.string().regex(/^(?:\d{1,8})(?:\.\d{1,2})?$/, {
    error: 'Invalid price format',
  })

  export const product = z.object({
    id: z.cuid(),
    vendorId: z.cuid(),
    categoryId: z.cuid(),
    name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
    description: z.string().nullable(),
    price: numeric.default('0.00'),
    stock: z.int().min(0, 'Stock cannot be negative'),
    sold: z.int().min(0, 'Sold cannot be negative'),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  export type Product = z.infer<typeof product>

  export const productImage = z.object({
    id: z.cuid(),
    productId: z.cuid(),
    url: z.url('Invalid image URL'),
  })
  export type Image = z.infer<typeof productImage>

  export const attribute = z.object({
    id: z.cuid(),
    name: z
      .string()
      .min(1, "Attribute's name is required")
      .max(100, "Attribute's name is too long"),
  })
  export type Attribute = z.infer<typeof attribute>

  export const productAttribute = z.object({
    productId: z.cuid(),
    attributeId: z.cuid(),
    value: z
      .string()
      .min(1, "Attribute's value is required")
      .max(255, "Attribute's value is too long"),
  })
  export type ProductAttribute = z.infer<typeof productAttribute>

  export const variant = z.object({
    id: z.cuid(),
    name: z
      .string()
      .min(1, "Variant's name is required")
      .max(100, "Variant's name is too long"),
  })
  export type Variant = z.infer<typeof variant>

  export const variantOption = z.object({
    id: z.int().min(1000, 'ID must be at least 1000'),
    variantId: z.cuid(),
    value: z
      .string()
      .min(1, "Variant option's value is required")
      .max(100, "Variant option's value is too long"),
  })
  export type VariantOption = z.infer<typeof variantOption>

  export const productVariant = z.object({
    id: z.cuid(),
    productId: z.cuid(),
    sku: z.string().min(1, 'SKU is required').max(100, 'SKU is too long'),
    price: numeric,
    stock: z.int().min(0, 'Stock cannot be negative'),
  })
  export type ProductVariant = z.infer<typeof productVariant>

  export const productReview = z.object({
    id: z.cuid(),
    productId: z.cuid(),
    userId: z.cuid(),
    rating: z
      .number()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot be more than 5'),
    comment: z.string('Comment must be a valid string').nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  export type Review = z.infer<typeof productReview>

  export const orderByField = ['name', 'price', 'sold', 'createdAt'] as const
  export type OrderByField = (typeof orderByField)[number]

  export const orderByDirections = ['asc', 'desc'] as const
  export type OrderByDirection = (typeof orderByDirections)[number]

  export const orderBy = orderByField
    .map(
      (field) =>
        orderByDirections.map(
          (direction) => `${field}_${direction}`,
        ) as `${OrderByField}_${OrderByDirection}`[],
    )
    .flat()
  export type OrderBy = `${OrderByField}_${OrderByDirection}`

  export const allInput = z.object({
    search: z.string().nullable(),
    categoryId: z.cuid().nullable(),
    vendorId: z.cuid().nullable(),
    orderBy: z.enum(orderBy).nullable(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
    isDeleted: z.boolean().default(false),
  })
  export type AllInput = z.infer<typeof allInput>
  export const allOutput = z.object({
    products: z.array(
      product
        .pick({
          id: true,
          name: true,
          price: true,
          sold: true,
          createdAt: true,
          updatedAt: true,
        })
        .extend({
          category: z.string().nullable(),
          image: z.url().nullable(),
          rating: z.string(),
          minPrice: numeric,
          maxPrice: numeric,
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
    .omit({ categoryId: true, vendorId: true })
    .extend({
      category: z.object({ id: z.cuid(), name: z.string() }).nullable(),
      vendor: z
        .object({
          id: z.cuid(),
          name: z.string(),
          image: z.url().nullable(),
          address: z.string().nullable(),
        })
        .nullable(),
      attributes: z.array(
        productAttribute
          .omit({ attributeId: true, productId: true })
          .extend({ name: z.string() }),
      ),
      images: z.array(productImage.omit({ productId: true })),
      variants: z.array(
        productVariant.omit({ productId: true }).extend({
          options: z.array(z.object({ name: z.string(), value: z.string() })),
        }),
      ),
      reviews: z.array(
        productReview
          .omit({
            productId: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
          })
          .extend({
            user: z.object({
              id: z.cuid(),
              username: z.string(),
              image: z.url().nullable(),
            }),
            createdAt: z.coerce.date().transform((d) => new Date(d)),
          }),
      ),
    })
  export type OneOutput = z.infer<typeof oneOutput>

  export const createInput = product
    .omit({ id: true, sold: true, createdAt: true, updatedAt: true })
    .extend({
      description: z
        .string()
        .min(1, 'Description is required')
        .max(2000, 'Description is too long')
        .optional(),
      images: z.array(z.url()),
      attributes: z.array(
        z.object({
          name: attribute.shape.name,
          value: productAttribute.shape.value,
        }),
      ),
      variants: z.array(
        z.object({
          name: variant.shape.name,
          options: z
            .array(variantOption.shape.value)
            .nonempty('At least one variant option is required'),
        }),
      ),
    })
  export type CreateInput = z.infer<typeof createInput>
  export const createOutput = z.object({ id: z.cuid() })
  export type CreateOutput = z.infer<typeof createOutput>

  export const updateInput = createInput
    .omit({ variants: true })
    .extend({ id: z.cuid() })
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

  export const recreateVariantInput = createInput
    .pick({ variants: true, vendorId: true })
    .extend({ id: z.cuid() })
  export type RecreateVariantInput = z.infer<typeof recreateVariantInput>
  export const recreateVariantOutput = z.object({ id: z.cuid() })
  export type RecreateVariantOutput = z.infer<typeof recreateVariantOutput>

  export const updateVariantInput = productVariant
    .omit({ productId: true, sku: true })
    .extend({ vendorId: z.cuid() })
  export type UpdateVariantInput = z.infer<typeof updateVariantInput>
  export const updateVariantOutput = z.object({ id: z.cuid() })
  export type UpdateVariantOutput = z.infer<typeof updateVariantOutput>

  export const deleteVariantInput = productVariant.pick({ id: true }).extend({
    vendorId: z.cuid(),
  })
  export type DeleteVariantInput = z.infer<typeof deleteVariantInput>
  export const deleteVariantOutput = z.object({ id: z.cuid() })
  export type DeleteVariantOutput = z.infer<typeof deleteVariantOutput>
}
