import { useQuery } from '@tanstack/react-query'
import { VendorEntity } from '@yukinu/api/merchant'
import { Badge } from '@yukinu/ui/badge'
import { Typography } from '@yukinu/ui/typography'
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs'

import { DataTable } from '@/components/data-table'
import { useTRPC } from '@/lib/trpc'
import { VendorSearchForm } from '@/routes/management/vendors/_components/search-form'
import { UpdateVendorButton } from '@/routes/management/vendors/_components/update-vendor-button'

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
    status: parseAsStringEnum([...VendorEntity.statuses]),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  })

  const { data, isLoading } = useQuery(
    trpc.merchant.vendor.all.queryOptions({
      ...query,
      status: query.status?.trim() ? query.status : null,
    }),
  )

  return (
    <>
      <Typography variant='h2'>Vendors</Typography>
      <Typography className='text-muted-foreground'>
        Manage and view all registered vendors. Monitor vendor details, review
        their status, and manage their system access and permissions.
      </Typography>

      <DataTable
        header={
          <VendorSearchForm
            query={query}
            onSearch={({ search, status }) =>
              setQuery({ search, status, page: 1 })
            }
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
        actions={(item) => (
          <UpdateVendorButton
            vendorId={item.id}
            vendorOwnerId={item.owner?.id ?? null}
            vendorName={item.name}
            vendorStatus={item.status}
          />
        )}
        pagination={{
          ...data?.pagination,
          setPage: (page) => setQuery({ page }),
        }}
      />
    </>
  )
}
