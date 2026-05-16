'use client'

import { useQuery } from '@tanstack/react-query'
import { formatPrice } from '@yukinu/lib/utils'
import { Button } from '@yukinu/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@yukinu/ui/item'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { EditButton } from '@/app/(main)/account/cart/_components/edit-button'
import { RemoveButton } from '@/app/(main)/account/cart/_components/remove-button'
import { useTRPC } from '@/lib/trpc'

export const CartItemsList: React.FC = () => {
  const { trpc } = useTRPC()
  const { data, status } = useQuery(trpc.sales.cart.get.queryOptions({}))

  if (status !== 'success') return <CartItemsListSkeleton />

  return data.items.map((item) => (
    <Item
      key={item.id}
      variant='outline'
      className='hover:bg-muted dark:hover:bg-muted/50'
    >
      <ItemMedia variant='image'>
        <Image
          src={item.product.image ?? '/assets/logo.svg'}
          alt={item.product.name}
          className='h-20 w-20 rounded-md object-cover'
          width={80}
          height={80}
        />
      </ItemMedia>
      <ItemContent className='flex-1'>
        <ItemTitle>{item.product.name}</ItemTitle>
        <ItemDescription>
          {item.product.variant
            ? Object.entries(item.product.variant as Record<string, string>)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ')
            : null}
        </ItemDescription>
      </ItemContent>

      <ItemContent className='flex flex-col items-end'>
        <ItemTitle className='text-lg text-primary'>
          {formatPrice(Number.parseFloat(item.product.price) * item.quantity)}
        </ItemTitle>
        <ItemDescription>
          {formatPrice(item.product.price)} × {item.quantity}
        </ItemDescription>
      </ItemContent>

      <ItemActions>
        <EditButton
          {...item}
          name={item.product.name}
          stock={item.product.stock}
          variant={item.product.variant}
        />
        <RemoveButton itemId={item.id} />
      </ItemActions>
    </Item>
  ))
}

const CartItemsListSkeleton: React.FC = () =>
  Array.from({ length: 3 }, (_, i) => (
    <Item
      key={i}
      variant='outline'
      className='animate-pulse hover:bg-muted dark:hover:bg-muted/50'
    >
      <ItemMedia variant='image'>
        <Image
          src='/assets/logo.svg'
          alt={`thumbnail of product ${i + 1}`}
          className='h-20 w-20 rounded-md object-cover'
          width={80}
          height={80}
        />
      </ItemMedia>
      <ItemContent className='flex-1'>
        <ItemTitle className='w-1/3 rounded-sm bg-muted'>&nbsp;</ItemTitle>
        <ItemDescription className='w-1/2 rounded-sm bg-muted'>
          &nbsp;
        </ItemDescription>
      </ItemContent>

      <ItemContent className='flex flex-col items-end'>
        <ItemTitle className='w-20 rounded-sm bg-muted text-lg'>
          &nbsp;
        </ItemTitle>
        <ItemDescription className='w-24 rounded-sm bg-muted'>
          &nbsp;
        </ItemDescription>
      </ItemContent>

      <ItemActions>
        <Button variant='link' disabled>
          Edit
        </Button>
        <Button variant='link' className='text-destructive' disabled>
          Remove
        </Button>
      </ItemActions>
    </Item>
  ))

export const CartItemsTotal: React.FC = () => {
  const { trpc } = useTRPC()
  const { data, status } = useQuery(trpc.sales.cart.get.queryOptions({}))

  if (status !== 'success') return <CartItemsTotalSkeleton />

  const total = data.items.reduce(
    (acc, { product: { price }, quantity }) =>
      acc + (price ? Number.parseFloat(price) * quantity : 0),
    0,
  )

  return (
    <Item>
      <ItemContent>
        <ItemTitle className='font-bold'>
          Total:{' '}
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(total)}
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <Button
          variant='outline'
          size='sm'
          nativeButton={false}
          render={<Link href='/account/cart/checkout' />}
          disabled={data.items.length === 0}
          className='aria-disabled:pointer-events-none aria-disabled:opacity-50'
        >
          Proceed to Checkout
        </Button>
      </ItemActions>
    </Item>
  )
}

const CartItemsTotalSkeleton: React.FC = () => (
  <Item className='animate-pulse'>
    <ItemContent>
      <ItemTitle className='w-1/4 rounded-sm bg-muted'>&nbsp;</ItemTitle>
    </ItemContent>

    <ItemActions>
      <Button variant='outline' size='sm' disabled>
        Proceed to Checkout
      </Button>
    </ItemActions>
  </Item>
)
