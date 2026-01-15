'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
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
import * as React from 'react'

import { EditButton } from '@/app/(main)/account/cart/_components/edit-button'
import { RemoveButton } from '@/app/(main)/account/cart/_components/remove-button'
import { useTRPC } from '@/lib/trpc/react'

export const CartItemsList: React.FC = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.cart.get.queryOptions())

  return data.items.map((item) => (
    <Item key={item.id} variant='outline' role='listitem'>
      <ItemMedia variant='image'>
        <Image
          src={item.productImage ?? '/favicon.svg'}
          alt={`thumbnail of ${item.productName}`}
          width={40}
          height={40}
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className='line-clamp-1'>{item.productName}</ItemTitle>
        <ItemDescription>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(parseFloat(item.unitPrice))}{' '}
          x {item.quantity}
        </ItemDescription>
      </ItemContent>

      <ItemContent>
        {item.variant &&
          Object.entries(item.variant).map(([key, value]) => (
            <div key={key}>
              {key}: {value}
            </div>
          ))}
      </ItemContent>
      <ItemActions>
        <EditButton
          vendorId={item.vendorId}
          productId={item.productId}
          variantId={item.productVariantId}
          unitPrice={item.unitPrice}
          name={item.productName}
          variant={item.variant}
          quantity={item.quantity}
          stock={item.productVariantId ? item.variantStock : item.stock}
        />
        <RemoveButton itemId={item.id} />
      </ItemActions>
    </Item>
  ))
}

export const CartItemsListSkeleton: React.FC = () =>
  Array.from({ length: 3 }, (_, i) => (
    <Item key={i} variant='outline' className='animate-pulse'>
      <ItemMedia variant='image'>
        <div className='size-10 bg-muted' />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className='w-1/3 rounded-sm bg-muted'>&nbsp;</ItemTitle>
        <ItemDescription className='w-1/4 rounded-sm bg-muted'>
          &nbsp;
        </ItemDescription>
      </ItemContent>
    </Item>
  ))

export const CartItemsTotal: React.FC = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.cart.get.queryOptions())

  const total = data.items.reduce((acc, item) => {
    return acc + parseFloat(item.unitPrice) * item.quantity
  }, 0)

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
        <Button variant='outline' size='sm'>
          Checkout
        </Button>
      </ItemActions>
    </Item>
  )
}

export const CartItemsTotalSkeleton: React.FC = () => (
  <Item className='animate-pulse'>
    <ItemContent>
      <ItemTitle className='w-1/4 rounded-sm bg-muted'>&nbsp;</ItemTitle>
    </ItemContent>
    <ItemActions>
      <Button variant='outline' size='sm' disabled>
        Checkout
      </Button>
    </ItemActions>
  </Item>
)
