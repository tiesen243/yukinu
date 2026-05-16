'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { CategoryCard, CategoryCardSkeleton } from '@/components/category-card'
import { useTRPC } from '@/lib/trpc'

export const CategoriesList: React.FC = () => {
  const { trpc } = useTRPC()

  const { data } = useSuspenseQuery(
    trpc.catalog.category.all.queryOptions({
      isTopLevelOnly: true,
      limit: 12,
    }),
  )

  return data.categories.map((category) => (
    <CategoryCard key={category.id} category={category} />
  ))
}

export const CategoriesListSkeleton: React.FC = () =>
  Array.from({ length: 10 }, (_, idx) => <CategoryCardSkeleton key={idx} />)
