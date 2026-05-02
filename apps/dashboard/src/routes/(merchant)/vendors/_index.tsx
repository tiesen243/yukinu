import { useQuery } from '@tanstack/react-query'
import { Badge } from '@yukinu/ui/badge'
import { Button } from '@yukinu/ui/button'
import { Typography } from '@yukinu/ui/typography'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

import { DataTable } from '@/components/data-table'
import { useTRPC } from '@/lib/trpc'
import { VendorSearchForm } from '@/routes/(merchant)/vendors/_components/search-form'

const STATUS_VARIANTS = {
  pending: 'info',
  approved: 'success',
  rejected: 'destructive',
  suspended: 'warning',
} as const

export default function MerchantVendorsIndexPage() {
  const { trpc } = useTRPC()
  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  })

  const { data, isLoading } = useQuery(
    trpc.merchant.vendor.all.queryOptions(query),
  )

  return (
    <>
      <Typography variant='h2'>Vendors</Typography>
      <Typography>
        Manage and view all registered vendors. Monitor vendor details, review
        their status, and manage their system access and permissions.
      </Typography>

      <DataTable
        header={
          <VendorSearchForm
            onSearch={({ search }) => setQuery({ search, page: 1 })}
          />
        }
        data={data?.vendors ?? []}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        columns={{
          id: 'ID',
          name: 'Name',
          owner: {
            label: 'Owner',
            render: (value) => value?.username,
          },
          status: {
            label: 'Status',
            render: (value) => (
              <Badge variant={STATUS_VARIANTS[value]}>
                {value?.toString()}
              </Badge>
            ),
          },
          createdAt: 'Created At',
          updatedAt: 'Updated At',
        }}
        actions={() => (
          <div className='flex items-center gap-2'>
            <Button>Edit</Button>
            <Button variant='destructive'>Delete</Button>
          </div>
        )}
        pagination={{
          ...data?.pagination,
          setPage: (page) => setQuery({ page }),
        }}
      />
    </>
  )
}
