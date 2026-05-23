'use client'

import { useQuery } from '@tanstack/react-query'
import { formatPrice } from '@yukinu/lib/utils'
import { Button } from '@yukinu/ui/button'
import Link from 'next/link'

import { CancelButton } from '@/app/(main)/account/orders/[id]/_components/cancel-button'
import { useTRPC } from '@/lib/trpc'

export const TotalAmount: React.FC<{ id: number }> = ({ id }) => {
  const { trpc } = useTRPC()
  const { data, status } = useQuery(
    trpc.checkout.order.one.queryOptions({ id }),
  )
  if (status !== 'success') return <TotalAmountSkeleton />

  return (
    <div className='flex items-center justify-end space-x-2'>
      <span className='text-lg font-semibold'>Total Amount:</span>
      <span className='text-xl font-bold text-primary'>
        {formatPrice(data.totalAmount)}
      </span>

      {['pending', 'confirmed'].includes(data.status) && (
        <CancelButton orderId={data.id} />
      )}

      {data.payment.status === 'pending' && (
        <Button
          nativeButton={false}
          render={<Link href={`/account/orders/checkout/${data.payment.id}`} />}
        >
          Process to Checkout
        </Button>
      )}
    </div>
  )
}

const TotalAmountSkeleton: React.FC = () => (
  <div className='flex items-center justify-end space-x-2'>
    <span className='w-32 rounded bg-current text-lg font-semibold'>
      &nbsp;
    </span>
    <span className='w-24 rounded bg-current text-xl font-bold'>&nbsp;</span>
  </div>
)
