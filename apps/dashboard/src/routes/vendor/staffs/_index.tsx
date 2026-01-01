import { Card } from '@yukinu/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'
import { Typography } from '@yukinu/ui/typography'

import { InviteStaffButton } from '@/routes/vendor/staffs/invite-staff-button'
import { StaffsList } from '@/routes/vendor/staffs/staffs-list'

export default function VendorStaffsPage() {
  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <Typography variant='h2'>Staffs Management</Typography>
          <Typography className='text-muted-foreground'>
            Manage and view all staffs in your vendor from this dashboard.
          </Typography>
        </div>

        <InviteStaffButton />
      </div>

      <Card className='px-4' render={<section />}>
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
      </Card>
    </>
  )
}
