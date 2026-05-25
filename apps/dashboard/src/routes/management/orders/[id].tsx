import { useQuery } from '@tanstack/react-query'
import { Card } from '@yukinu/ui/card'
import { Typography } from '@yukinu/ui/typography'

import { useTRPC } from '@/lib/trpc'
import {
  Customer,
  CustomerSkeleton,
} from '@/routes/management/orders/_components/customer'
import {
  OrderItems,
  OrderItemsSkeleton,
} from '@/routes/management/orders/_components/order-items'
import {
  OrderSummary,
  OrderSummarySkeleton,
} from '@/routes/management/orders/_components/order-summary'
import {
  PaymentSummary,
  PaymentSummarySkeleton,
} from '@/routes/management/orders/_components/payment-summary'
import { UpdateStatus } from '@/routes/management/orders/_components/update-status'

import type { Route } from './+types/[id]'

export default function ManagementOrdersDetailPage({
  params,
}: Route.ComponentProps) {
  const { trpc } = useTRPC()

  const { data, isLoading } = useQuery(
    trpc.checkout.order.oneForVendor.queryOptions({
      id: Number.parseInt(params.id, 10),
    }),
  )

  return (
    <>
      <Typography variant='h2'>Order #{params.id}</Typography>
      <Typography className='text-muted-foreground'>
        View detailed information about this order, including customer details,
        order items, payment status, and shipping information. Use this page to
        manage and fulfill the order effectively, ensuring a smooth customer
        experience.
      </Typography>

      <Card render={<section />} className='my-4 px-4'>
        <h3 className='sr-only'>Order Details section</h3>

        {!isLoading && data ? (
          <OrderSummary data={data} />
        ) : (
          <OrderSummarySkeleton />
        )}

        {!isLoading && data ? (
          <Customer user={data.user} address={data.address} />
        ) : (
          <CustomerSkeleton />
        )}

        {!isLoading && data ? (
          <OrderItems items={data.items} />
        ) : (
          <OrderItemsSkeleton />
        )}

        {!isLoading && data ? (
          <PaymentSummary totalAmount={data.totalAmount} />
        ) : (
          <PaymentSummarySkeleton />
        )}

        {!isLoading && data && (
          <UpdateStatus
            orderId={data.id}
            currentStatus={data.status}
            disabled={
              data.status === 'cancelled' || data.status === 'completed'
            }
          />
        )}
      </Card>
    </>
  )
}
