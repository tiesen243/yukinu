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

import { SearchForm } from '@/routes/admin/users/search-form'
import { UsersList } from '@/routes/admin/users/users-list'
import { UsersPagination } from '@/routes/admin/users/users-pagination'

export default function UsersPage() {
  return (
    <>
      <Typography variant='h2'>Users Management</Typography>
      <Typography className='text-muted-foreground'>
        Manage and monitor all registered users in the system.
      </Typography>

      <div className='my-4 flex items-center justify-between gap-4'>
        <SearchForm />

        <div className='flex-1' />

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
      </Card>
    </>
  )
}
