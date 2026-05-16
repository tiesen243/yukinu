'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { ProductCard, ProductCardSkeleton } from '@/components/product-card'
import { useTRPC } from '@/lib/trpc'

export const ProductsList: React.FC = () => {
  const { trpc } = useTRPC()

  const { data } = useSuspenseQuery(
    trpc.catalog.product.all.queryOptions({
      categoryId: null,
      vendorId: null,
      limit: 6,
    }),
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
