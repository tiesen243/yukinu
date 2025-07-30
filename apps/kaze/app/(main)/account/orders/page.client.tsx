'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSuspenseQuery } from '@tanstack/react-query'

import type { RouterOutputs } from '@yuki/api'
import { Badge } from '@yuki/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'
import { CalendarDaysIcon, PackageIcon } from '@yuki/ui/icons'

import {
  MAX_ITEMS_DISPLAY,
  statusConfig,
} from '@/app/(main)/account/orders/_config'
import { formatCurrency, formatDate } from '@/lib/helpers'
import { useTRPC } from '@/trpc/react'

export const OrderList: React.FC = () => {
  const { trpc } = useTRPC()
  const { data } = useSuspenseQuery(trpc.order.all.queryOptions())

  return data.map((order) => <OrderPreviewCard key={order.id} order={order} />)
}

const OrderPreviewCard = ({
  order,
}: Readonly<{ order: RouterOutputs['order']['all'][number] }>) => {
  const totalItems = order.orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  )
  const statusInfo = statusConfig[order.status]

  return (
    <Link
      href={`/account/orders/${order.id}`}
      className='flex h-fit flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm'
    >
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg font-semibold'>
            Order #{order.id.toUpperCase()}
          </CardTitle>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
        <div className='flex items-center gap-4'>
          <CardDescription className='flex items-center gap-1'>
            <CalendarDaysIcon className='size-4' />
            {formatDate(order.createdAt)}
          </CardDescription>
          <CardDescription className='flex items-center gap-1'>
            <PackageIcon className='size-4' />
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='space-y-3'>
          {order.orderItems.slice(0, MAX_ITEMS_DISPLAY).map((item) => (
            <div
              key={`${item.orderId}-${item.productId}`}
              className='flex items-center gap-3'
            >
              <div className='relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border'>
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  className='object-cover'
                  fill
                />
              </div>

              <div className='min-w-0 flex-1'>
                <h4 className='truncate text-sm font-medium'>
                  {item.product.name}
                </h4>
                <p className='text-xs text-muted-foreground'>
                  Qty: {item.quantity} × {formatCurrency(item.price)}
                </p>
              </div>

              <div className='text-sm font-medium'>
                {formatCurrency(item.quantity * item.price)}
              </div>
            </div>
          ))}

          {order.orderItems.length > MAX_ITEMS_DISPLAY && (
            <div className='text-sm text-muted-foreground'>
              + {order.orderItems.length - MAX_ITEMS_DISPLAY} more item(s)
            </div>
          )}
        </div>

        <hr />

        <div className='flex items-center justify-between'>
          <span className='font-medium'>Total</span>
          <span className='text-lg font-bold'>
            {formatCurrency(order.payment?.amount ?? 0)}
          </span>
        </div>
      </CardContent>
    </Link>
  )
}

export const OrderCardSkeleton: React.FC = () => (
  <Card className='h-fit'>
    <CardHeader>
      <div className='flex items-center justify-between'>
        <CardTitle className='w-1/2 animate-pulse rounded-md bg-current'>
          &nbsp;
        </CardTitle>
        <Badge className='w-16 animate-pulse rounded-md'>&nbsp;</Badge>
      </div>
      <div className='flex items-center gap-4'>
        <CardDescription className='w-24 animate-pulse rounded-md bg-current text-xs'>
          &nbsp;
        </CardDescription>
        <CardDescription className='w-16 animate-pulse rounded-md bg-current text-xs'>
          &nbsp;
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent className='space-y-4'>
      <div className='space-y-3'>
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className='flex items-center gap-3'>
            <div className='size-12 flex-shrink-0 overflow-hidden rounded-md border bg-current' />
            <div className='min-w-0 flex-1 space-y-2'>
              <div className='w-2/3 animate-pulse rounded-md bg-current text-xs'>
                &nbsp;
              </div>
              <div className='w-1/4 animate-pulse rounded-md bg-current text-xs'>
                &nbsp;
              </div>
            </div>
            <div className='w-24 animate-pulse rounded-md bg-current text-xs'>
              &nbsp;
            </div>
          </div>
        ))}
      </div>
      <hr />

      <div className='flex items-center justify-between'>
        <span className='w-16 animate-pulse rounded-md bg-current text-sm'>
          &nbsp;
        </span>
        <span className='w-24 animate-pulse rounded-md bg-current text-sm'>
          &nbsp;
        </span>
      </div>
    </CardContent>
  </Card>
)
