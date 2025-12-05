'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSuspenseQuery } from '@tanstack/react-query'

import { slugify } from '@yukinu/lib/slugify'
import { cn } from '@yukinu/ui'
import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@yukinu/ui/card'

import { useTRPC } from '@/lib/trpc/react'

export const WishlistItems: React.FC = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.user.wishlist.queryOptions({}))

  return data.map((item) => (
    <Link
      key={item.product.id}
      href={`/${slugify(item.product.name)}-${item.product.id}`}
      className='group/product-card flex aspect-square flex-col gap-6 rounded-xl border bg-card pb-6 text-card-foreground shadow-sm hover:border-accent hover:bg-accent/20 hover:text-accent-foreground'
    >
      <CardHeader className='relative flex-1 overflow-hidden rounded-t-xl p-0'>
        <Image
          src={item.product.image ?? '/assets/logo.svg'}
          alt={item.product.name}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className={cn(
            'rounded-t-xl object-cover transition-transform group-hover/product-card:scale-105',
            { 'dark:invert': item.product.image == null },
          )}
          fill
        />
      </CardHeader>

      <CardFooter>
        <CardTitle className='line-clamp-1 text-lg'>
          {item.product.name}
        </CardTitle>
        <CardDescription>${item.product.price}</CardDescription>
      </CardFooter>
    </Link>
  ))
}

export const WishlistItemsSkeleton: React.FC = () =>
  Array.from({ length: 8 }, (_, index) => (
    <div
      key={index}
      className='group/product-card flex aspect-square animate-pulse flex-col gap-6 rounded-xl border bg-card pb-6 text-card-foreground shadow-sm hover:border-accent hover:bg-accent/20 hover:text-accent-foreground'
    >
      <CardHeader className='relative flex-1 animate-pulse overflow-hidden rounded-t-xl bg-muted p-0' />

      <CardFooter>
        <CardTitle className='w-3/4 animate-pulse rounded-md bg-muted'>
          &nbsp;
        </CardTitle>
        <CardDescription className='w-1/4 animate-pulse rounded-md bg-muted'>
          &nbsp;
        </CardDescription>
      </CardFooter>
    </div>
  ))
