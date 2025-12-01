import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'

import { SearchForm } from '@/routes/vendors/_components/search-form'
import { VendorsList } from '@/routes/vendors/_components/vendors-list'
import { VendorsPagination } from '@/routes/vendors/_components/vendors-pagination'

export default function VendorsPage() {
  return (
    <>
      <h1 className='text-3xl font-bold'>Vendors Management</h1>
      <p className='mt-2 text-muted-foreground'>
        Manage and view all vendors in your organization from this dashboard.
      </p>

      <SearchForm />

      <section className='rounded-lg bg-card p-6 text-card-foreground shadow-sm'>
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
      </section>
    </>
  )
}
