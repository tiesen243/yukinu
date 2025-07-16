import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { and, asc, desc, eq, ilike, ne } from '@yuki/db'
import { categories, products } from '@yuki/db/schema'
import { allSchema, byIdSchema } from '@yuki/validators/product'

import { publicProcedure } from '../trpc'

export const productRouter = {
  all: publicProcedure.input(allSchema).query(async ({ ctx, input }) => {
    const { page, limit, sort, order, query, category } = input
    const orderBy = order === 'asc' ? asc : desc

    const whereConditions = and(
      query ? ilike(products.name, `%${query}%`) : undefined,
      category ? eq(products.categoryId, category) : undefined,
    )

    const productList = await ctx.db
      .select(productPreview)
      .from(products)
      .where(whereConditions)
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(orderBy(products[sort]))

    const total = await ctx.db.$count(products, whereConditions)
    const totalPage = Math.ceil(total / limit)

    return {
      products: productList,
      totalPage,
      page,
    }
  }),

  byId: publicProcedure.input(byIdSchema).query(async ({ ctx, input }) => {
    const [product] = await ctx.db
      .select(productDetail)
      .from(products)
      .where(eq(products.id, input.id))
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .limit(1)

    if (!product)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with ID ${input.id} not found`,
      })

    return {
      product,
      reviews,
    }
  }),

  relativeProducts: publicProcedure
    .input(byIdSchema)
    .query(async ({ ctx, input }) => {
      if (!input.categoryId)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Category ID is required to fetch relative products',
        })

      const relativeProducts = await ctx.db
        .select(productPreview)
        .from(products)
        .where(
          and(
            eq(products.categoryId, input.categoryId),
            ne(products.id, input.id),
          ),
        )
        .limit(8)

      return relativeProducts
    }),
} satisfies TRPCRouterRecord

const productPreview = {
  id: products.id,
  name: products.name,
  description: products.description,
  image: products.image,
  price: products.price,
  discount: products.discount,
  createdAt: products.createdAt,
}

const productDetail = {
  id: products.id,
  name: products.name,
  description: products.description,
  image: products.image,
  stock: products.stock,
  price: products.price,
  discount: products.discount,
  category: categories.name,
}

const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    date: '2024-01-15',
    comment:
      'Absolutely amazing sound quality! The noise cancellation works perfectly and the battery life is exactly as advertised.',
  },
  {
    id: 2,
    name: 'Mike Chen',
    rating: 4,
    date: '2024-01-10',
    comment:
      "Great headphones overall. Very comfortable for long listening sessions. Only minor complaint is they're a bit heavy.",
  },
  {
    id: 3,
    name: 'Emily Davis',
    rating: 5,
    date: '2024-01-05',
    comment:
      "Best purchase I've made this year! The audio quality is incredible and they're so comfortable I forget I'm wearing them.",
  },
]
