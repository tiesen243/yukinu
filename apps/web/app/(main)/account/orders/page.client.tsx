'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { STATUS_COLORS } from '@yukinu/lib/constants'
import { formatPrice } from '@yukinu/lib/utils'
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
import { useRouter } from 'next/navigation'

import { useTRPC } from '@/lib/trpc/react'

export const OrderHistories: React.FC = () => {
  const trpc = useTRPC()
  const router = useRouter()

  const { data } = useSuspenseQuery(trpc.order.all.queryOptions({}))

  return data.orders.map((order) => (
    <Item
      key={order.id}
      variant='outline'
      className='cursor-pointer hover:border-ring/80'
      onClick={() => router.push(`/account/orders/${order.id}`)}
    >
      <ItemHeader>
        <ItemContent>
          <ItemTitle>#{order.id}</ItemTitle>
          <ItemDescription>{formatPrice(order.totalAmount)}</ItemDescription>
        </ItemContent>
        <Badge variant={STATUS_COLORS[order.status]}>{order.status}</Badge>
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
                  src={item.productImage ?? '/assets/favicon.svg'}
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
