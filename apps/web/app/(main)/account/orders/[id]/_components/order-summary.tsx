'use client'

import { useQuery } from '@tanstack/react-query'
import {
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_COLORS,
} from '@yukinu/lib/constants'
import { formatDate } from '@yukinu/lib/utils'
import { Badge } from '@yukinu/ui/badge'
import { Typography } from '@yukinu/ui/typography'

import { useTRPC } from '@/lib/trpc'

export const OrderSummary: React.FC<{ id: number }> = ({ id }) => {
  const { trpc } = useTRPC()
  const { data, status } = useQuery(
    trpc.checkout.order.one.queryOptions({ id }),
  )

  if (status !== 'success') return <OrderSummarySkeleton />

  return (
    <div className='flex items-start justify-between'>
      <div className='space-y-2'>
        <Typography>Purchased on {formatDate(data.createdAt)}</Typography>

        <Typography variant='small'>
          Order:&nbsp;
          <Badge variant={ORDER_STATUS_COLORS[data.status]}>
            {data.status}
          </Badge>
        </Typography>

        <Typography variant='small'>
          Payment:&nbsp;
          <Badge variant={PAYMENT_STATUS_COLORS[data.payment.status]}>
            {data.payment.status}
          </Badge>
        </Typography>
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

const OrderSummarySkeleton: React.FC = () => (
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
