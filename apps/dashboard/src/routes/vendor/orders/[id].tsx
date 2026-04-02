import { useQuery } from '@tanstack/react-query'
import { Typography } from '@yukinu/ui/typography'

import { useTRPC } from '@/lib/trpc/react'
import {
  CustomerInformation,
  CustomerInformationSkeleton,
} from '@/routes/vendor/orders/_components/customer-infomation'
import {
  DeliveryAddress,
  DeliveryAddressSkeleton,
} from '@/routes/vendor/orders/_components/delivery-address'
import {
  OrderItems,
  OrderItemsSkeleton,
} from '@/routes/vendor/orders/_components/order-items'
import {
  OrderStatus,
  OrderStatusSkeleton,
} from '@/routes/vendor/orders/_components/order-status'
import {
  OrderSummary,
  OrderSummarySkeleton,
} from '@/routes/vendor/orders/_components/order-summary'

import type { Route } from './+types/[id]'

export default function VendorOrderDetailPage({
  params,
}: Route.ComponentProps) {
  return (
    <>
      <Typography variant='h2'>Order #{params.id}</Typography>
      <Typography className='text-muted-foreground'>
        Detailed information about order #{params.id} will be displayed here.
      </Typography>

      <section className='mt-4 space-y-4'>
        <h3 className='sr-only'>Order Details</h3>

        <OrderDetail id={+params.id} />
      </section>
    </>
  )
}

const OrderDetail: React.FC<{ id: number }> = ({ id }) => {
  const trpc = useTRPC()
  const { data: order, isLoading } = useQuery(
    trpc.vendor.order.queryOptions({ id }),
  )

  if (isLoading || !order)
    return (
      <>
        <OrderStatusSkeleton />
        <OrderItemsSkeleton />
        <OrderSummarySkeleton />
        <DeliveryAddressSkeleton />
        <CustomerInformationSkeleton />
      </>
    )

  return (
    <>
      <OrderStatus order={order} />
      <OrderItems items={order.items} />
      <OrderSummary order={order} />
      <DeliveryAddress address={order.address} />
      <CustomerInformation user={order.user} />
    </>
  )
}
