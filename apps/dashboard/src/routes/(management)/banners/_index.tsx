import { useQuery } from '@tanstack/react-query'
import { Typography } from '@yukinu/ui/typography'

import { DataTable } from '@/components/data-table'
import { useTRPC } from '@/lib/trpc'
import { AddNewBanner } from '@/routes/(management)/banners/_components/add-new-banner'
import { DeleteBanner } from '@/routes/(management)/banners/_components/delete-banner'

export default function ManagementBannersIndexPage() {
  const { trpc } = useTRPC()

  const { data, isLoading } = useQuery(trpc.sales.banner.all.queryOptions())

  return (
    <>
      <Typography variant='h2'>Banners</Typography>
      <Typography className='text-muted-foreground'>
        Manage your banners here. You can create and delete banners as needed.
      </Typography>

      <DataTable
        header={
          <div className='flex items-center justify-end'>
            <AddNewBanner />
          </div>
        }
        data={data ?? []}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        columns={{
          id: 'ID',
          url: 'URL',
          createdAt: 'Created At',
        }}
        actions={(item) => <DeleteBanner bannerId={item.id} />}
      />
    </>
  )
}
