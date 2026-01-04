'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { cn } from '@yukinu/ui'
import { ChevronRightIcon } from '@yukinu/ui/icons'
import Image from 'next/image'
import { useQueryStates } from 'nuqs'
import { useState } from 'react'

import { CategoryCard, CategoryCardSkeleton } from '@/components/category-card'
import { ProductCard, ProductCardSkeleton } from '@/components/product-card'
import { productsOptions, productsParsers } from '@/lib/search'
import { useTRPC } from '@/lib/trpc/react'

export const BannersList: React.FC = () => {
  const trpc = useTRPC()
  const [imageIdx, setImageIdx] = useState(0)

  const { data } = useSuspenseQuery(trpc.banner.all.queryOptions())

  return (
    <>
      {data.map((banner, idx) => (
        <div
          key={banner.id}
          className={cn(
            'relative w-full h-full rounded-xl animate-in fade-in duration-500 ease-linear',
            {
              block: idx === imageIdx,
              hidden: idx !== imageIdx,
            },
          )}
        >
          <Image
            src={banner.url}
            alt={banner.id ?? 'Banner Image'}
            className='object-top object-cover rounded-xl'
            fill
          />
        </div>
      ))}

      <button
        type='button'
        className='group/prev absolute w-12 flex flex-col items-center justify-center top-0 left-0 h-full bg-linear-to-r from-background/50 hover:to-background/10 to-background/5 transition-colors'
        onClick={() =>
          setImageIdx((prev) => (prev - 1 + data.length) % data.length)
        }
      >
        <ChevronRightIcon className='rotate-180 transition-colors group-hover/prev:text-primary' />
        <span className='sr-only'>Previous Banner</span>
      </button>

      <div className='absolute bottom-2 w-full flex items-center justify-center gap-2'>
        {Array.from({ length: data.length }, (_, idx) => (
          <button
            key={idx}
            type='button'
            className={cn('size-2 rounded-full transition-colors', {
              'bg-primary': idx === imageIdx,
              'bg-muted': idx !== imageIdx,
            })}
            onClick={() => setImageIdx(idx)}
          />
        ))}
      </div>

      <button
        type='button'
        className='group/next absolute w-12 flex flex-col items-center justify-center top-0 right-0 h-full bg-linear-to-l from-background/50 hover:to-background/10 to-background/5 transition-colors'
        onClick={() => setImageIdx((prev) => (prev + 1) % data.length)}
      >
        <ChevronRightIcon className='transition-colors group-hover/next:text-primary' />
        <span className='sr-only'>Next Banner</span>
      </button>
    </>
  )
}

export const ProductsList: React.FC = () => {
  const trpc = useTRPC()
  const [query] = useQueryStates(productsParsers, productsOptions)

  const { data } = useSuspenseQuery(
    trpc.product.all.queryOptions({ ...query, limit: 6 }),
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
    trpc.category.all.queryOptions({
      search: null,
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
