'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSuspenseQuery } from '@tanstack/react-query'

import { slugify } from '@yukinu/lib/slugify'
import { cn } from '@yukinu/ui'
import {
  Card,
  CardContent,
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
    <Card
      key={item.product.id}
      render={
        <Link href={`/${slugify(item.product.name)}-${item.product.id}`} />
      }
      className='group/product-card aspect-square pt-0 hover:border-accent hover:bg-accent/20 hover:text-accent-foreground'
    >
      <CardHeader className='relative flex-1 rounded-t-xl'>
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

      <CardContent className='flex items-center justify-between'>
        <CardTitle className='line-clamp-1 text-lg'>
          {item.product.name}
        </CardTitle>
        <CardDescription>${item.product.price}</CardDescription>
      </CardContent>
    </Card>
  ))
}

export const WishlistItemsSkeleton: React.FC = () =>
  Array.from({ length: 8 }, (_, index) => (
    <div
      key={index}
      className='group/product-card flex aspect-square animate-pulse flex-col gap-6 rounded-xl border bg-card pb-6 text-card-foreground shadow-sm hover:border-accent hover:bg-accent/20 hover:text-accent-foreground'
    >
      <CardHeader className='relative flex-1 animate-pulse overflow-hidden rounded-t-xl bg-muted p-0' />

      <CardFooter className='justify-between'>
        <CardTitle className='w-3/4 animate-pulse rounded-md bg-muted'>
          &nbsp;
        </CardTitle>
        <CardDescription className='w-1/4 animate-pulse rounded-md bg-muted'>
          &nbsp;
        </CardDescription>
      </CardFooter>
    </div>
  ))
