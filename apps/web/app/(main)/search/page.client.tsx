'use client'

import { useQuery } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

import { Button } from '@yukinu/ui/button'

import { ProductCard, ProductCardSkeleton } from '@/components/product-card'
import { productsOptions, productsParsers } from '@/lib/search'
import { useTRPC } from '@/lib/trpc/react'

export const ProductsSearchResults: React.FC = () => {
  const [query] = useQueryStates(productsParsers, productsOptions)
  const trpc = useTRPC()

  const { data, isLoading } = useQuery(trpc.product.all.queryOptions(query))

  if (isLoading)
    return Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)

  if (!data || data.products.length === 0)
    return (
      <div className='text-sm text-muted-foreground'>No products found.</div>
    )

  return data.products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))
}

export const ProductsSearchPagination: React.FC = () => {
  const [query, setQuery] = useQueryStates(productsParsers, productsOptions)
  const trpc = useTRPC()

  const { data, isLoading } = useQuery(trpc.product.all.queryOptions(query))
  if (isLoading || !data) return null

  const { pagination } = data

  const goToPage = async (page: number) => {
    await setQuery((prev) => ({ ...prev, page }))
  }

  return (
    <div className='flex items-center justify-center gap-2'>
      {getPaginationRange(query.page, pagination.totalPages).map(
        (item, idx) => (
          <Button
            // eslint-disable-next-line @eslint-react/no-array-index-key
            key={`pagination-item-${idx}`}
            variant='outline'
            size='icon'
            onClick={() => goToPage(Number(item))}
            disabled={item === '...' || item === query.page}
          >
            {item}
          </Button>
        ),
      )}
    </div>
  )
}

function getPaginationRange(cp: number, tp: number): (number | string)[] {
  if (tp <= 7) {
    return Array.from({ length: tp }, (_, i) => i + 1)
  }

  const range: (number | string)[] = []
  if (cp <= 4) {
    range.push(1, 2, 3, 4, 5, '...', tp)
  } else if (cp >= tp - 3) {
    range.push(1, '...', tp - 4, tp - 3, tp - 2, tp - 1, tp)
  } else {
    range.push(1, '...', cp - 1, cp, cp + 1, '...', tp)
  }
  return range
}
