import type { OneOutput } from '@yukinu/validators/order'

import { SHIPPING_COST, TAX_RATE } from '@yukinu/lib/constants'
import { formatPrice } from '@yukinu/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@yukinu/ui/card'

export const OrderSummary: React.FC<{ order: OneOutput }> = ({ order }) => (
  <Card>
    <CardHeader>
      <CardTitle>Order Summary</CardTitle>
    </CardHeader>
    <CardContent className='space-y-3'>
      <div className='flex justify-between text-sm'>
        <span className='text-muted-foreground'>Subtotal</span>
        <span>{formatPrice(order.totalAmount)}</span>
      </div>
      <div className='flex justify-between text-sm'>
        <span className='text-muted-foreground'>Shipping</span>
        <span>{formatPrice(SHIPPING_COST)}</span>
      </div>
      <div className='flex justify-between text-sm'>
        <span className='text-muted-foreground'>Tax</span>
        <span>
          {formatPrice(Number.parseFloat(order.totalAmount) * TAX_RATE)}
        </span>
      </div>
      <div className='flex justify-between border-t pt-3 font-bold'>
        <span>Total</span>
        <span>
          {formatPrice(
            Number.parseFloat(order.totalAmount) +
              SHIPPING_COST +
              Number.parseFloat(order.totalAmount) * TAX_RATE,
          )}
        </span>
      </div>
    </CardContent>
  </Card>
)

export const OrderSummarySkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Order Summary</CardTitle>
    </CardHeader>
    <CardContent className='space-y-3'>
      <div className='flex animate-pulse justify-between text-sm'>
        <span className='w-1/4 rounded bg-current'>&nbsp;</span>
        <span className='w-1/6 rounded bg-current'>&nbsp;</span>
      </div>
      <div className='flex animate-pulse justify-between text-sm'>
        <span className='w-1/4 rounded bg-current'>&nbsp;</span>
        <span className='w-1/6 rounded bg-current'>&nbsp;</span>
      </div>
      <div className='flex animate-pulse justify-between text-sm'>
        <span className='w-1/4 rounded bg-current'>&nbsp;</span>
        <span className='w-1/6 rounded bg-current'>&nbsp;</span>
      </div>
      <div className='flex animate-pulse justify-between border-t pt-3 font-bold'>
        <span className='w-1/4 rounded bg-current'>&nbsp;</span>
        <span className='w-1/6 rounded bg-current'>&nbsp;</span>
      </div>
    </CardContent>
  </Card>
)
