'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

import { Badge } from '@yuki/ui/badge'
import { Button } from '@yuki/ui/button'
import { Card, CardContent } from '@yuki/ui/card'
import {
  HeartIcon,
  RotateCcwIcon,
  ShieldIcon,
  ShoppingCartIcon,
  StarIcon,
  TruckIcon,
} from '@yuki/ui/icons'
import { Input } from '@yuki/ui/input'
import { toast } from '@yuki/ui/sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@yuki/ui/tabs'
import { Typography } from '@yuki/ui/typography'

import { useTRPC } from '@/trpc/react'

export const ProductDetail = ({ id }: { id: string }) => {
  const { trpc, queryClient } = useTRPC()
  const {
    data: { product, reviews },
  } = useSuspenseQuery(trpc.product.byId.queryOptions({ id }))

  const [quantity, setQuantity] = useState(1)
  const { mutate, isPending } = useMutation({
    ...trpc.cart.update.mutationOptions(),
    onSuccess: () => {
      void queryClient.invalidateQueries(trpc.cart.get.queryFilter())
      toast.success('Item added to cart', {
        action: {
          label: 'View Cart',
          onClick: () => (window.location.href = '/profile/cart'),
        },
      })
    },
  })
  if (!product) return

  const rating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length ||
    0
  const discountedPrice = product.price * (1 - product.discount / 100)

  return (
    <>
      <section className='mb-12 grid gap-8 lg:grid-cols-2'>
        <h2 className='sr-only'>{product.name} details section</h2>
        {/* Product Images */}
        <section className='relative aspect-square overflow-hidden rounded-lg'>
          <h3 className='sr-only'>Product Image section</h3>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className='object-cover'
            priority
          />
          {product.discount > 0 && (
            <Badge className='absolute top-4 left-4 bg-red-500 hover:bg-red-600'>
              -{product.discount}%
            </Badge>
          )}
        </section>

        <section className='space-y-6'>
          <h2 className='sr-only'>Product Details section</h2>
          <section>
            <Badge variant='secondary' className='mb-2'>
              {product.category}
            </Badge>
            <Typography variant='h3'>{product.name}</Typography>
            <div className='mb-4 flex items-center gap-2'>
              <div className='flex items-center gap-0.5'>
                {Array.from({ length: 5 }, (_, idx) => (
                  <StarIcon
                    key={idx}
                    className={`h-5 w-5 ${
                      idx < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className='text-sm text-muted-foreground'>
                {rating.toFixed(2)} ({reviews.length} reviews)
              </span>
            </div>
          </section>

          <section className='space-y-2'>
            <h3 className='sr-only'>Product Price section</h3>
            <div className='flex items-center gap-3'>
              <span className='text-3xl font-bold'>
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className='text-xl text-muted-foreground line-through'>
                    ${product.price.toFixed(2)}
                  </span>
                  <Badge variant='destructive'>
                    Save ${(product.price - discountedPrice).toFixed(2)}
                  </Badge>
                </>
              )}
            </div>
          </section>

          <Typography className='text-muted-foreground'>
            {product.description}
          </Typography>

          <section className='flex items-center gap-2'>
            <h3 className='sr-only'>Product Stock Status section</h3>

            <div
              className={`size-3 rounded-full ${product.stock > 0 ? 'bg-success' : 'bg-error'}`}
            />
            <span
              className={`font-medium ${product.stock > 0 ? 'text-success' : 'text-error'}`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock} available)`
                : 'Out of Stock'}
            </span>
          </section>

          <section className='space-y-4'>
            <h3 className='sr-only'>Add to Cart section</h3>

            <label
              htmlFor='quantity'
              className='flex items-center gap-2 font-medium'
            >
              Quantity:
              <Input
                type='number'
                className='w-20'
                id='quantity'
                disabled={product.stock === 0 || isPending}
                min='1'
                max={product.stock}
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10)
                  if (!isNaN(value) && value > 0) setQuantity(value)
                  else setQuantity(1)
                }}
              />
            </label>

            <div className='flex gap-3'>
              <Button
                size='lg'
                className='flex-1'
                disabled={product.stock === 0 || isPending}
                onClick={() => {
                  mutate({ productId: product.id, quantity })
                }}
              >
                <ShoppingCartIcon />
                Add to Cart
              </Button>
              <Button size='lg' variant='outline'>
                <HeartIcon />
              </Button>
            </div>
          </section>

          <section className='grid grid-cols-3 gap-4 border-t pt-4'>
            <h3 className='sr-only'>Product Features section</h3>

            <div className='flex items-center gap-2'>
              <TruckIcon className='text-success' />
              <span className='text-sm'>Free Shipping</span>
            </div>
            <div className='flex items-center gap-2'>
              <ShieldIcon className='text-info' />
              <span className='text-sm'>2 Year Warranty</span>
            </div>
            <div className='flex items-center gap-2'>
              <RotateCcwIcon className='text-warning' />
              <span className='text-sm'>30-Day Returns</span>
            </div>
          </section>
        </section>
      </section>

      <Tabs defaultValue='reviews' className='mb-12' asChild>
        <section>
          <h2 className='sr-only'>
            Product Reviews & Shipping Information section
          </h2>

          <TabsList className='w-full'>
            <TabsTrigger value='reviews'>
              Reviews ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value='shipping'>Shipping & Returns</TabsTrigger>
          </TabsList>

          <TabsContent value='reviews' className='space-y-4'>
            {reviews.map((review) => (
              <Card key={review.id}>
                <h3 className='sr-only'>Review by {review.name}</h3>
                <CardContent>
                  <div className='mb-3 flex items-start justify-between'>
                    <div>
                      <h4 className='font-semibold'>{review.name}</h4>
                      <div className='flex items-center gap-2'>
                        <div className='flex'>
                          {Array.from({ length: 5 }, (_, idx) => (
                            <StarIcon
                              key={idx}
                              className={`h-4 w-4 ${
                                idx < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className='text-sm text-muted-foreground'>
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className='text-muted-foreground'>{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value='shipping'>
            <Card>
              <h3 className='sr-only'>Shipping & Returns Information</h3>

              <CardContent className='pt-6'>
                <section className='space-y-4'>
                  <div>
                    <h4 className='mb-2 font-semibold'>Shipping Information</h4>
                    <ul className='space-y-2 text-sm text-muted-foreground'>
                      <li>• Free standard shipping on orders over $50</li>
                      <li>• Express shipping available for $9.99</li>
                      <li>• Orders processed within 1-2 business days</li>
                      <li>• Delivery time: 3-7 business days</li>
                    </ul>
                  </div>
                  <hr />
                  <div>
                    <h4 className='mb-2 font-semibold'>Returns & Exchanges</h4>
                    <ul className='space-y-2 text-sm text-muted-foreground'>
                      <li>• 30-day return policy</li>
                      <li>• Items must be in original condition</li>
                      <li>• Free return shipping for defective items</li>
                      <li>• Refunds processed within 5-7 business days</li>
                    </ul>
                  </div>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
        </section>
      </Tabs>
    </>
  )
}
