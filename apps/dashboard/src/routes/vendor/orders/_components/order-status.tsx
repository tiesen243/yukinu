import type { OneOutput } from '@yukinu/validators/order'

import { formatDate } from '@yukinu/lib/utils'
import { Badge } from '@yukinu/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@yukinu/ui/card'

import { statusColors } from '@/routes/vendor/orders/_components/stauts-map'

export const OrderStatus: React.FC<{ order: OneOutput }> = ({ order }) => (
  <Card>
    <CardHeader>
      <CardTitle>Order Status</CardTitle>
    </CardHeader>
    <CardContent className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-muted-foreground'>Current Status</p>
          <Badge
            variant={statusColors[order.status]}
            className='mt-2 capitalize'
          >
            {order.status}
          </Badge>
        </div>
        <div>
          <p className='text-sm text-muted-foreground'>Last Updated</p>
          <p className='font-medium'>{formatDate(order.updatedAt)}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

export const OrderStatusSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Order Status</CardTitle>
    </CardHeader>
    <CardContent className='space-y-4'>
      <div className='flex animate-pulse items-center justify-between'>
        <div className='w-1/3 rounded bg-current'>&nbsp;</div>
        <div className='w-1/4 rounded bg-current'>&nbsp;</div>
      </div>
    </CardContent>
  </Card>
)
