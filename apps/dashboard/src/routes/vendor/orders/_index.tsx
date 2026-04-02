import { useInfiniteQuery } from '@tanstack/react-query'
import { STATUS_COLORS } from '@yukinu/lib/constants'
import { Badge } from '@yukinu/ui/badge'
import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import { DownloadIcon } from '@yukinu/ui/icons'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'
import { Typography } from '@yukinu/ui/typography'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'

import { exportCsv } from '@/lib/export-csv'
import { useTRPCClient } from '@/lib/trpc/react'

export default function VendorOrdersPage() {
  const trpcClient = useTRPCClient()
  const navigate = useNavigate()

  const { data, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [['vendor', 'orders'], { type: 'infinite' }],
    queryFn: ({ pageParam }) => trpcClient.vendor.orders.query(pageParam),
    initialPageParam: { page: 1, limit: 10 },
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? { page: lastPage.pagination.page + 1, limit: 10 }
        : undefined,
  })

  const orders = useMemo(
    () =>
      data?.pages
        .flatMap((page) => page.orders)
        .map((order) => ({
          id: order.id,
          customer: order.user?.username,
          items: order.items.reduce((acc, item) => acc + item.quantity, 0),
          status: order.status,
          totalAmount: order.totalAmount,
        })),
    [data?.pages],
  )

  return (
    <>
      <Typography variant='h2'>Orders Management</Typography>
      <Typography className='text-muted-foreground'>
        Manage and view all orders in your store from this dashboard.
      </Typography>

      <div className='my-4 flex items-center justify-end gap-4'>
        <Button
          variant='outline'
          onClick={() => exportCsv('orders', orders ?? [])}
        >
          <DownloadIcon />
          <span className='sr-only md:not-sr-only'>Export</span>
        </Button>
      </div>

      <Card className='px-4' render={<section />}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className='sr-only'>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {status === 'pending' ? (
              <OrdersListSkeleton />
            ) : (
              orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    {order.items} item{order.items > 1 ? 's' : ''}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_COLORS[order.status]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${order.totalAmount}</TableCell>
                  <TableCell className='text-right'>
                    <Button
                      variant='link'
                      size='sm'
                      onClick={() => navigate(`/vendor/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className='text-center'>
                {hasNextPage ? (
                  <Button onClick={() => fetchNextPage()}>Load More</Button>
                ) : (
                  <Typography className='text-muted-foreground'>
                    No more orders to load.
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </>
  )
}

const OrdersListSkeleton: React.FC = () =>
  Array.from({ length: 10 }, (_, index) => (
    <TableRow key={index}>
      {Array.from({ length: 5 }, (__, cellIndex) => (
        <TableCell key={cellIndex}>
          <div className='w-full rounded bg-muted'>&nbsp;</div>
        </TableCell>
      ))}
    </TableRow>
  ))
