'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@yukinu/ui/item'
import Image from 'next/image'

import { useTRPC } from '@/lib/trpc/react'

export function CartItems() {
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
    </Item>
  ))
}
