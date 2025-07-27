'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import type { RouterOutputs } from '@yuki/api'
import { Badge } from '@yuki/ui/badge'
import { Button } from '@yuki/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'
import { ShoppingCartIcon } from '@yuki/ui/icons'
import { toast } from '@yuki/ui/sonner'

import { formatCurrency } from '@/lib/helpers'
import { slugify } from '@/lib/utils'
import { useTRPC } from '@/trpc/react'

interface ProductCardProps {
  product: RouterOutputs['product']['all']['products'][number]
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter()
  const { trpc, queryClient } = useTRPC()
  const { mutate, isPending } = useMutation({
    ...trpc.cart.update.mutationOptions(),
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      void queryClient.invalidateQueries(trpc.cart.get.queryFilter())
      toast.success('Item added to cart', {
        action: {
          label: 'View Cart',
          onClick: () => {
            router.push('/account/cart')
          },
        },
      })
    },
  })

  const isNew = useMemo(
    () => product.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    [product.createdAt],
  )

  const price = useMemo(
    () => product.price - product.price * (product.discount / 100),
    [product.price, product.discount],
  )

  return (
    <Card className='group/product-card h-full overflow-hidden py-4 pt-0 transition-all hover:shadow-md'>
      <Link href={`/${slugify(product.name)}-${product.id}`}>
        <div className='relative mb-2 aspect-square overflow-hidden rounded-t-xl'>
          <Image
            src={product.image}
            alt={product.name}
            className='object-cover transition-[scale] group-hover/product-card:scale-105'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            fill
          />
          {product.discount > 0 && (
            <Badge variant='error' className='absolute top-2 left-2 z-10'>
              {product.discount}% OFF
            </Badge>
          )}

          {isNew && (
            <Badge variant='info' className='absolute top-2 right-2 z-10'>
              New
            </Badge>
          )}
        </div>

        <CardHeader className='px-4'>
          <CardTitle className='line-clamp-1 text-lg'>{product.name}</CardTitle>
          <span className='font-medium'>
            {formatCurrency(price)}

            {product.discount > 0 && (
              <del className='ml-2 text-sm text-muted-foreground'>
                {formatCurrency(product.price)}
              </del>
            )}
          </span>
        </CardHeader>

        <CardContent className='px-4'>
          <CardDescription className='line-clamp-1'>
            {product.description}
          </CardDescription>
        </CardContent>
      </Link>

      <CardFooter className='px-4'>
        <Button
          className='w-full'
          disabled={isPending}
          onClick={() => {
            mutate({
              productId: product.id,
              type: 'increment',
              quantity: 1,
            })
          }}
        >
          <ShoppingCartIcon /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

export const ProductCardSkeleton: React.FC = () => (
  <Card className='h-full overflow-hidden py-4 pt-0 transition-all hover:shadow-md'>
    <div>
      <div className='relative mb-2 aspect-square animate-pulse overflow-hidden rounded-t-xl bg-current' />

      <CardHeader className='px-4'>
        <CardTitle className='w-2/3 animate-pulse rounded-md bg-current text-lg'>
          &nbsp;
        </CardTitle>
        <span className='w-1/3 animate-pulse rounded-md bg-current font-bold'>
          &nbsp;
        </span>
      </CardHeader>

      <CardContent className='px-4'>
        <CardDescription className='w-full animate-pulse rounded-md bg-current'>
          &nbsp;
        </CardDescription>
      </CardContent>
    </div>

    <CardFooter className='px-4'>
      <Button className='w-full'>
        <ShoppingCartIcon /> Add to Cart
      </Button>
    </CardFooter>
  </Card>
)
