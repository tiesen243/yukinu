'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { STATUS_COLORS } from '@yukinu/lib/constants'
import { slugify } from '@yukinu/lib/slugify'
import { formatDate, formatPrice } from '@yukinu/lib/utils'
import { Badge } from '@yukinu/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@yukinu/ui/item'
import { Typography } from '@yukinu/ui/typography'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useTRPC } from '@/lib/trpc/react'

export const OrderSummary: React.FC<{ id: number }> = ({ id }) => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.order.one.queryOptions({ id }))

  return (
    <div className='flex items-start justify-between'>
      <div className='space-y-2'>
        <Typography>Purchased on {formatDate(data.createdAt)}</Typography>
        <Badge variant={STATUS_COLORS[data.status]}>{data.status}</Badge>
      </div>

      {data.address && (
        <div className='text-right'>
          <Typography className='font-medium'>
            {data.address.recipientName}
          </Typography>
          <Typography className='text-sm text-muted-foreground'>
            {data.address.street}
          </Typography>
        </div>
      )}
    </div>
  )
}

export const OrderSummarySkeleton: React.FC = () => (
  <div className='flex animate-pulse items-start justify-between'>
    <div className='space-y-2'>
      <Typography className='w-48 rounded bg-current'>&nbsp;</Typography>
      <Badge className='w-24 rounded bg-current'>&nbsp;</Badge>
    </div>
    <div className='text-right'>
      <Typography className='w-32 rounded bg-current font-medium'>
        &nbsp;
      </Typography>
      <Typography className='w-40 rounded bg-current text-sm text-muted-foreground'>
        &nbsp;
      </Typography>
    </div>
  </div>
)

export const OrderItems: React.FC<{ id: number }> = ({ id }) => {
  const router = useRouter()
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.order.one.queryOptions({ id }))

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
          src={item.productImage ?? '/assets/favicon.svg'}
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

export const OrderItemsSkeleton: React.FC = () =>
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

export const TotalAmount: React.FC<{ id: number }> = ({ id }) => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.order.one.queryOptions({ id }))

  return (
    <div className='flex items-center justify-end space-x-2'>
      <span className='text-lg font-semibold'>Total Amount:</span>
      <span className='text-xl font-bold text-primary'>
        {formatPrice(data.totalAmount)}
      </span>
    </div>
  )
}

export const TotalAmountSkeleton: React.FC = () => (
  <div className='flex items-center justify-end space-x-2'>
    <span className='w-32 rounded bg-current text-lg font-semibold'>
      &nbsp;
    </span>
    <span className='w-24 rounded bg-current text-xl font-bold'>&nbsp;</span>
  </div>
)
