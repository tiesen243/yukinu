import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import { DownloadIcon } from '@yukinu/ui/icons'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'
import { Typography } from '@yukinu/ui/typography'

import { SearchForm } from '@/routes/admin/vendors/search-form'
import { VendorsList } from '@/routes/admin/vendors/vendors-list'
import { VendorsPagination } from '@/routes/admin/vendors/vendors-pagination'

export default function VendorsPage() {
  return (
    <>
      <Typography variant='h2'>Vendors Management</Typography>
      <Typography className='text-muted-foreground'>
        Manage and view all vendors in your organization from this dashboard.
      </Typography>

      <div className='my-4 flex items-center justify-between gap-4'>
        <SearchForm />

        <Button variant='outline' disabled>
          <DownloadIcon />
          <span className='sr-only md:not-sr-only'>Export</span>
        </Button>
      </div>

      <Card className='px-4' render={<section />}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Staff Count</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <VendorsList />
          </TableBody>
        </Table>

        <VendorsPagination />
      </Card>
    </>
  )
}
