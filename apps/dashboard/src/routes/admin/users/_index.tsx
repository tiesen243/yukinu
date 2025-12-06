import { Button } from '@yukinu/ui/button'
import { DownloadIcon } from '@yukinu/ui/icons'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'

import { SearchForm, UserFilterButton } from '@/routes/admin/users/search-form'
import { UsersList } from '@/routes/admin/users/users-list'
import { UsersPagination } from '@/routes/admin/users/users-pagination'

export default function UsersPage() {
  return (
    <>
      <h1 className='text-3xl font-bold'>Users Management</h1>
      <p className='mt-2 text-muted-foreground'>
        Manage and monitor all registered users in the system.
      </p>

      <div className='my-6 flex items-center justify-between gap-4'>
        <SearchForm />

        <div className='flex-1' />

        <UserFilterButton />

        <Button variant='outline' disabled>
          <DownloadIcon />
          <span className='sr-only md:not-sr-only'>Export</span>
        </Button>
      </div>

      <section className='rounded-lg bg-card p-6 text-card-foreground shadow-sm'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Email Verified</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Deleted At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <UsersList />
          </TableBody>
        </Table>

        <UsersPagination />
      </section>
    </>
  )
}
