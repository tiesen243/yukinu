import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'

import { InviteStaffButton } from '@/routes/vendor/staffs/invite-staff-button'
import { StaffsList } from '@/routes/vendor/staffs/staffs-list'

export default function VendorStaffsPage() {
  return (
    <>
      <h1 className='sr-only'>Staffs Management page</h1>

      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Staffs Management</h1>
          <p className='mt-2 text-muted-foreground'>
            Manage and view all staffs in your vendor from this dashboard.
          </p>
        </div>

        <InviteStaffButton />
      </div>

      <section className='mt-6 rounded-lg bg-card p-6 text-card-foreground shadow-sm dark:border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Assigned At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <StaffsList />
          </TableBody>
        </Table>
      </section>
    </>
  )
}
