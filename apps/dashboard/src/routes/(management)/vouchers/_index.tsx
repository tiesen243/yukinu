import { useQuery } from '@tanstack/react-query'
import { formatDate, formatPrice } from '@yukinu/lib/utils'
import { Button } from '@yukinu/ui/button'
import { Typography } from '@yukinu/ui/typography'

import { DataTable } from '@/components/data-table'
import { useTRPC } from '@/lib/trpc'
import { DeleteVoucher } from '@/routes/(management)/vouchers/_components/delete-voucher'
import { SaveVoucher } from '@/routes/(management)/vouchers/_components/save-voucher'

export default function ManagementVouchersIndexPage() {
  const { trpc } = useTRPC()
  const { data, isLoading } = useQuery(trpc.sales.voucher.all.queryOptions())

  return (
    <>
      <Typography variant='h2'>Voucher</Typography>
      <Typography>
        Manage your vouchers here. You can create, edit, and delete vouchers as
        needed.
      </Typography>

      <DataTable
        header={
          <div className='flex items-center justify-end'>
            <SaveVoucher
              trigger={<Button variant='outline'>Add new voucher</Button>}
            />
          </div>
        }
        data={data ?? []}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        columns={{
          id: 'ID',
          code: 'Code',
          discountAmount: {
            label: 'Discount Amount',
            render: (val) => (val ? formatPrice(val) : '-'),
          },
          discountPercentage: {
            label: 'Discount Percentage',
            render: (val) => (val ? `${val}%` : '-'),
          },
          quantity: 'Quantity',
          expiredAt: {
            label: 'Expired At',
            render: (val) => formatDate(val, true),
          },
        }}
        actions={(item) => (
          <div className='flex items-center gap-2'>
            <SaveVoucher trigger={<Button>Edit</Button>} voucher={item} />
            <DeleteVoucher code={item.code} />
          </div>
        )}
      />
    </>
  )
}
