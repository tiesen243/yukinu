'use client'

import { useQuery } from '@tanstack/react-query'
import { formatPrice } from '@yukinu/lib/utils'
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from '@yukinu/ui/item'
import Image from 'next/image'

import { useTRPC } from '@/lib/trpc'

export const OrderItems: React.FC = () => {
  const { trpc } = useTRPC()
  const { data, status } = useQuery(trpc.sales.cart.get.queryOptions({}))

  if (status !== 'success') return <OrderItemsSkeleton />

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
    </Item>
  ))
}

const OrderItemsSkeleton: React.FC = () =>
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
    </Item>
  ))
