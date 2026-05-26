import type { OneOrderDto } from '@yukinu/api/checkout'

import {
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_COLORS,
} from '@yukinu/lib/constants'
import { formatDate } from '@yukinu/lib/utils'
import { Badge } from '@yukinu/ui/badge'
import { CalendarIcon } from '@yukinu/ui/icons'

export const OrderSummary: React.FC<{ data: OneOrderDto.Output }> = ({
  data,
}) => (
  <section className='flex flex-wrap items-center justify-between gap-4 border-b pb-4'>
    <h4 className='sr-only'>Order Summary</h4>

    <div className='flex items-center gap-4'>
      <div className='flex items-center gap-1.5 text-sm font-medium'>
        <span className='text-muted-foreground'>Order:</span>
        <Badge variant={ORDER_STATUS_COLORS[data.status]}>{data?.status}</Badge>
      </div>

      <div className='flex items-center gap-1.5 text-sm font-medium'>
        <span className='text-muted-foreground'>Payment:</span>
        <Badge variant={PAYMENT_STATUS_COLORS[data.payment.status]}>
          {data.payment.status}
        </Badge>
      </div>
    </div>

    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
      <CalendarIcon className='size-4' />
      <span>Created at: {formatDate(data.createdAt)}</span>
    </div>
  </section>
)

export const OrderSummarySkeleton: React.FC = () => (
  <section className='flex animate-pulse flex-wrap items-center justify-between gap-4 border-b pb-4'>
    <h4 className='sr-only'>Order Summary</h4>

    <div className='flex items-center gap-4'>
      <div className='flex items-center gap-1.5 text-sm font-medium'>
        <span className='text-muted-foreground'>Order Status:</span>
        <Badge variant='ghost' className='w-16 bg-muted'>
          &nbsp;
        </Badge>
      </div>

      <div className='flex items-center gap-1.5 text-sm font-medium'>
        <span className='text-muted-foreground'>Payment:</span>
        <Badge variant='ghost' className='w-16 bg-muted'>
          &nbsp;
        </Badge>
      </div>
    </div>

    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
      <CalendarIcon className='size-4' />
      <span className='w-32 rounded bg-muted'>&nbsp;</span>
    </div>
  </section>
)
