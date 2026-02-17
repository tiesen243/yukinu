import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import { DownloadIcon, PlusIcon } from '@yukinu/ui/icons'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'
import { Typography } from '@yukinu/ui/typography'
import { Link } from 'react-router'

import { SearchForm } from '@/routes/admin/vouchers/search-form'
import { VouchersList } from '@/routes/admin/vouchers/vouchers-list'
import { VouchersPagination } from '@/routes/admin/vouchers/vouchers-pagination'

export default function VouchersPage() {
  return (
    <>
      <Typography variant='h2'>Vouchers Management</Typography>
      <Typography className='text-muted-foreground'>
        Manage and view all vouchers in the system.
      </Typography>

      <div className='my-4 flex items-center justify-between gap-4'>
        <SearchForm />

        <div className='flex-1' />

        <Button
          variant='outline'
          render={
            <Link to='/admin/vouchers/new'>
              <PlusIcon />
              <span className='sr-only md:not-sr-only'>Add</span>
            </Link>
          }
        />

        <Button variant='outline' disabled>
          <DownloadIcon />
          <span className='sr-only md:not-sr-only'>Export</span>
        </Button>
      </div>

      <Card className='px-6' render={<section />}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount Amount ($)</TableHead>
              <TableHead>Discount Percentage (%)</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <VouchersList />
          </TableBody>
        </Table>

        <VouchersPagination />
      </Card>
    </>
  )
}
