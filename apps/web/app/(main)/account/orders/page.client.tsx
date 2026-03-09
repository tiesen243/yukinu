'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { Badge } from '@yukinu/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@yukinu/ui/item'
import Image from 'next/image'

import { useTRPC } from '@/lib/trpc/react'
import { formatPrice } from '@/lib/utils'

export const OrderHistories: React.FC = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.order.all.queryOptions({}))

  return data.orders.map((order) => (
    <Item
      key={order.id}
      variant='outline'
      className='hover:bg-muted dark:hover:bg-muted/50'
    >
      <ItemHeader>
        <ItemContent>
          <ItemTitle>#{order.id}</ItemTitle>
          <ItemDescription>{formatPrice(order.totalAmount)}</ItemDescription>
        </ItemContent>
        <Badge variant={statusMap[order.status]}>{order.status}</Badge>
      </ItemHeader>

      <ItemContent>
        <ItemGroup>
          {order.items.map((item) => (
            <Item
              key={`${order.id}-${item.productId}`}
              variant='muted'
              className='border-l-2 border-l-primary'
            >
              <ItemMedia variant='image'>
                <Image
                  src={item.productImage ?? '/favicon.svg'}
                  alt={item.productName ?? 'Product Image'}
                  width={80}
                  height={80}
                  className='size-20 object-cover'
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className='line-clamp-1'>
                  {item.productName}
                </ItemTitle>
                <ItemDescription>
                  {formatPrice(item.unitPrice)} x {item.quantity}
                </ItemDescription>
              </ItemContent>
              <ItemContent>
                <ItemDescription>
                  {formatPrice(
                    Number.parseFloat(item.unitPrice) * item.quantity,
                  )}
                </ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </ItemContent>
    </Item>
  ))
}

const statusMap = {
  pending: 'secondary',
  confirmed: 'info',
  shipped: 'default',
  completed: 'success',
  cancelled: 'destructive',
} as const
