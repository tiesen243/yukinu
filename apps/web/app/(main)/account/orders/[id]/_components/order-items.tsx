'use client'

import { useQuery } from '@tanstack/react-query'
import { formatPrice, slugify } from '@yukinu/lib/utils'
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from '@yukinu/ui/item'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useTRPC } from '@/lib/trpc'

export const OrderItems: React.FC<{ id: number }> = ({ id }) => {
  const router = useRouter()
  const { trpc } = useTRPC()
  const { data, status } = useQuery(
    trpc.checkout.order.one.queryOptions({ id }),
  )
  if (status !== 'success') return <OrderItemsSkeleton />

  return data.items.map((item) => (
    <Item
      key={item.productId}
      variant='outline'
      className='cursor-pointer hover:border-ring/80'
      onClick={() =>
        router.push(`/${slugify(item.productName ?? '')}-${item.productId}`)
      }
    >
      <ItemMedia variant='image' className='size-20'>
        <Image
          src={item.productImage ?? '/assets/logo.svg'}
          alt={item.productName ?? `Product ${item.productId}'s image`}
          className='object-cover'
          fill
        />
      </ItemMedia>

      <ItemContent>
        <ItemTitle>{item.productName}</ItemTitle>
        <ItemDescription>Quantity: {item.quantity}</ItemDescription>
        <ItemTitle>{formatPrice(item.unitPrice)}</ItemTitle>
      </ItemContent>

      <ItemContent>
        <ItemDescription>Subtotal</ItemDescription>
        <ItemTitle>
          {formatPrice(Number.parseFloat(item.unitPrice) * item.quantity)}
        </ItemTitle>
      </ItemContent>
    </Item>
  ))
}

const OrderItemsSkeleton: React.FC = () =>
  Array.from({ length: 3 }, (_, i) => (
    <Item key={i} variant='outline' className='animate-pulse'>
      <ItemMedia variant='image' className='size-20 bg-current' />
      <ItemContent>
        <ItemTitle className='w-3/4 rounded bg-current'>&nbsp;</ItemTitle>
        <ItemDescription className='w-1/2 rounded bg-current'>
          &nbsp;
        </ItemDescription>
        <ItemTitle className='w-1/4 rounded bg-current'>&nbsp;</ItemTitle>
      </ItemContent>
      <ItemContent>
        <ItemDescription className='w-24 rounded bg-current'>
          &nbsp;
        </ItemDescription>
        <ItemTitle className='w-16 rounded bg-current'>&nbsp;</ItemTitle>
      </ItemContent>
    </Item>
  ))
