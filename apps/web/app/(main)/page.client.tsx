'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

import { CategoryCard, CategoryCardSkeleton } from '@/components/category-card'
import { ProductCard, ProductCardSkeleton } from '@/components/product-card'
import { productsOptions, productsParsers } from '@/lib/search'
import { useTRPC } from '@/lib/trpc/react'

export const ProductsList: React.FC = () => {
  const trpc = useTRPC()
  const [query] = useQueryStates(productsParsers, productsOptions)

  const { data } = useSuspenseQuery(
    trpc.product.all.queryOptions({ ...query, limit: 3 }),
  )

  return data.products.map((product, idx) => (
    <ProductCard
      key={product.id}
      product={product}
      className={idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}
    />
  ))
}

export const ProductsListSkeleton: React.FC = () =>
  Array.from({ length: 3 }, (_, idx) => (
    <ProductCardSkeleton
      key={idx}
      className={idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}
    />
  ))

export const CategoriesList: React.FC = () => {
  const trpc = useTRPC()

  const { data } = useSuspenseQuery(
    trpc.category.all.queryOptions({ search: null, istopLevelOnly: true }),
  )

  return data.categories.map((category) => (
    <CategoryCard key={category.id} category={category} />
  ))
}

export const CategoriesListSkeleton: React.FC = () =>
  Array.from({ length: 10 }, (_, idx) => <CategoryCardSkeleton key={idx} />)
