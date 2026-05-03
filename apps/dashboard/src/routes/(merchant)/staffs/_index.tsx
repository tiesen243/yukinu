import { useQuery } from '@tanstack/react-query'
import { Typography } from '@yukinu/ui/typography'

import { DataTable } from '@/components/data-table'
import { useTRPC } from '@/lib/trpc'
import { DeleteStaffButton } from '@/routes/(merchant)/staffs/_components/delete-staff-button'
import { InviteStaffButton } from '@/routes/(merchant)/staffs/_components/invite-staff-button'

export default function MerchantStaffsIndexPage() {
  const { trpc } = useTRPC()
  const { data, isLoading } = useQuery({
    ...trpc.merchant.staff.all.queryOptions({}),
  })

  return (
    <>
      <Typography variant='h2'>Staffs</Typography>
      <Typography className='text-muted-foreground'>
        Manage your staff members and their roles. Add new staff, assign
        permissions, and ensure your team has the right access to manage your
        store effectively.
      </Typography>

      <DataTable
        header={
          <div className='flex justify-end'>
            <InviteStaffButton />
          </div>
        }
        data={data ?? []}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        columns={{
          userId: 'User ID',
          username: 'Username',
          email: 'Email',
          assignedAt: 'Assigned At',
        }}
        actions={(item) => (
          <DeleteStaffButton
            staffId={item.userId}
            staffUsername={item.username}
          />
        )}
      />
    </>
  )
}
