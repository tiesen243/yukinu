'use client'

import { useQuery } from '@tanstack/react-query'
import { ORDER_STATUS_COLORS } from '@yukinu/lib/constants'
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

import { useTRPC } from '@/lib/trpc'

export const OrderHistories: React.FC<{ paymentId?: string }> = ({
  paymentId,
}) => {
  const { trpc } = useTRPC()
  const router = useRouter()

  const { data, status } = useQuery(
    trpc.checkout.order.me.queryOptions({ paymentId }),
  )
  if (status !== 'success') return <OrderHistoriesSkeleton />

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
        <Badge variant={ORDER_STATUS_COLORS[order.status]}>
          {order.status}
        </Badge>
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
                  src={item.productImage ?? '/assets/logo.svg'}
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

const OrderHistoriesSkeleton: React.FC = () =>
  Array.from({ length: 3 }).map((_, index) => (
    <Item key={index} variant='outline' className='animate-pulse'>
      <ItemHeader>
        <ItemContent>
          <ItemTitle className='bg-muted text-transparent'>
            Order #{index + 1}
          </ItemTitle>
          <ItemDescription className='bg-muted text-transparent'>
            Loading...
          </ItemDescription>
        </ItemContent>
        <Badge variant='default'>Loading</Badge>
      </ItemHeader>

      <ItemContent>
        <ItemGroup>
          {Array.from({ length: 2 }).map((__, itemIndex) => (
            <Item
              key={itemIndex}
              variant='muted'
              className='border-l-2 border-l-primary'
            >
              <ItemMedia variant='image'>
                <div className='size-20 bg-muted' />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className='bg-muted text-transparent'>
                  Product Name
                </ItemTitle>
                <ItemDescription className='bg-muted text-transparent'>
                  Loading...
                </ItemDescription>
              </ItemContent>
              <ItemContent>
                <ItemDescription className='bg-muted text-transparent'>
                  Loading...
                </ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </ItemContent>
    </Item>
  ))
