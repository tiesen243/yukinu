import * as z from 'zod'

import { Pagination } from '@/shared/schema'

export namespace AllProductsDto {
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

  export const input = Pagination.input.extend({
    search: z.string().optional(),
    categoryId: z.cuid2().nullable(),
    vendorId: z.cuid2().nullable(),
    orderBy: z.enum(orderBy).optional(),
    isDeleted: z.boolean().default(false),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    products: z.array(
      z.object({
        id: z.cuid2(),
        name: z.string(),
        price: z.string(),
        stock: z.number().default(0),
        sold: z.number().default(0),
        createdAt: z.date(),
        updatedAt: z.date(),
        deletedAt: z.date().nullable(),
        category: z.string().nullable(),
        image: z.url().nullable(),
        rating: z.string(),
      }),
    ),
    pagination: Pagination.output,
  })
  export type Output = z.infer<typeof output>
}
