import { useQuery } from '@tanstack/react-query'
import { useSession } from '@yukinu/auth/react'
import { Button } from '@yukinu/ui/button'
import { Typography } from '@yukinu/ui/typography'
import { useQueryStates, parseAsInteger } from 'nuqs'
import { Link } from 'react-router'

import { DataTable } from '@/components/data-table'
import { useTRPC } from '@/lib/trpc'

export default function ManagementOrdersIndexPage() {
  const { status, user } = useSession()
  if (status !== 'authenticated') return null

  return (
    <ManagementOrdersIndexPageContent
      isAdmin={['admin', 'moderator'].includes(user.role)}
    />
  )
}

const ManagementOrdersIndexPageContent: React.FC<{ isAdmin: boolean }> = ({
  isAdmin,
}) => {
  const { trpc } = useTRPC()
  const [query, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  })
  const { data, isLoading } = useQuery(
    isAdmin
      ? trpc.checkout.order.all.queryOptions(query)
      : trpc.checkout.order.vendor.queryOptions(query),
  )

  return (
    <>
      <Typography variant='h2'>Orders</Typography>
      <Typography className='text-muted-foreground'>
        Manage and view all orders. Monitor order details, track status, and
        handle customer inquiries effectively to ensure a smooth order
        fulfillment process.
      </Typography>

      <DataTable
        data={data?.orders ?? []}
        isLoading={isLoading}
        keyExtractor={(item) => item.id.toString()}
        columns={{
          id: 'ID',
          status: 'Status',
          totalAmount: 'Total Amount',
          items: {
            label: 'Items',
            render: (value) => value.length,
          },
          user: {
            label: 'User',
            render: (value) => value?.username ?? 'N/A',
          },
        }}
        actions={({ id }) => (
          <Button
            nativeButton={false}
            render={<Link to={`/management/orders/${id}`} />}
          >
            View
          </Button>
        )}
        pagination={{
          ...data?.pagination,
          setPage: (page) => setQuery({ page }),
        }}
      />
    </>
  )
}
